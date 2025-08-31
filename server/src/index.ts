import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import jwt from "@fastify/jwt";
import { nanoid } from "nanoid";
import { runGraph } from "./graph";
import { AgentContext } from "./types";
import { config } from "./config";
import { createRun, getRun, putArtifact, getArtifactSignedUrl } from "./store";

const app = Fastify({ logger: true, trustProxy: true, bodyLimit: 1_000_000 });
await app.register(cors, { origin: config.CORS_ORIGIN, credentials: true });
await app.register(rateLimit, { max: config.RATE_LIMIT_MAX, timeWindow: config.RATE_LIMIT_TIME_WINDOW_MS });
if (config.JWT_SECRET) {
  await app.register(jwt, { secret: config.JWT_SECRET });
}

const listeners = new Map<string, Set<any>>();
const heartbeats = new Map<any, NodeJS.Timeout>();

app.post("/api/run", async (req: any, reply) => {
  const { product, audience, budget, brandRules, connectors } = req.body || {};
  if (!product || !audience || typeof budget !== "number") {
    reply.code(400);
    return { error: "product, audience, budget required" };
  }
  const runId = nanoid();
  const artifacts: any = {};
  await createRun(runId);
  const emit = (e: any) => {
    const ls = listeners.get(runId) || new Set();
    ls.forEach((res) => res.write(`data: ${JSON.stringify(e)}\n\n`));
  };
  const ctx: AgentContext = { runId, product, audience, budget, brandRules, connectors, memory: {}, artifacts, emit };
  (async () => {
    try { await runGraph(ctx); } 
    catch (err) { emit({ ts: Date.now(), agent: "system", type: "error", data: String(err) }); }
    finally { emit({ ts: Date.now(), agent: "system", type: "done", data: {} }); }
  })();
  return { runId };
});

app.get("/api/stream/:runId", async (req: any, reply) => {
  const { runId } = req.params;
  reply.raw.setHeader("Content-Type", "text/event-stream");
  reply.raw.setHeader("Cache-Control", "no-cache");
  reply.raw.setHeader("Connection", "keep-alive");
  reply.raw.flushHeaders();
  const set = listeners.get(runId) || new Set();
  set.add(reply.raw);
  listeners.set(runId, set);
  reply.raw.write(`data: ${JSON.stringify({ ts: Date.now(), agent: "system", type: "connected", data: {} })}\n\n`);
  const hb = setInterval(() => {
    try { reply.raw.write(": hb\n\n"); } catch {}
  }, 15000);
  heartbeats.set(reply.raw, hb);
  req.raw.on("close", () => { clearInterval(hb); heartbeats.delete(reply.raw); set.delete(reply.raw); });
  return reply;
});

app.get("/api/runs/:runId", async (req: any) => {
  const run = await getRun(req.params.runId);
  if (!run) return {};
  // attach signed URLs if S3 enabled
  const withUrls: any = { ...run };
  if (withUrls.artifacts) {
    const keys = Object.keys(withUrls.artifacts);
    const urlIndex: Record<string,string> = {};
    await Promise.all(keys.map(async (k) => {
      const u = await getArtifactSignedUrl(run.runId, k);
      if (u) urlIndex[k] = u;
    }));
    withUrls.signed = urlIndex;
  }
  return withUrls;
});

app.get("/api/healthz", async () => ({ ok: true }));
app.get("/api/readyz", async () => ({ ok: true }));

app.addHook("onClose", async () => {
  listeners.forEach((set) => set.forEach((res) => { try { res.end(); } catch {} }));
  heartbeats.forEach((t) => clearInterval(t));
  heartbeats.clear();
});

app.listen({ port: config.PORT, host: config.HOST });
console.log(`Server on http://${config.HOST}:${config.PORT}`);


