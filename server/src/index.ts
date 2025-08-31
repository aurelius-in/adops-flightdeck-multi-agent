import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import jwt from "@fastify/jwt";
import { nanoid } from "nanoid";
import { runGraph } from "./graph";
import { AgentContext } from "./types";
import { config } from "./config";
import { createRun, getRun, putArtifact, getArtifactSignedUrl, getIdempotentRunId, setIdempotentRunId, recordAction } from "./store";
import { buildAdapters } from "./tools";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

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
  const idemKey = req.headers["idempotency-key"] as string | undefined;
  if (idemKey) {
    const existing = await getIdempotentRunId(idemKey);
    if (existing) return { runId: existing };
  }
  const runId = nanoid();
  const artifacts: any = {};
  await createRun(runId);
  const emit = (e: any) => {
    const ls = listeners.get(runId) || new Set();
    ls.forEach((res) => res.write(`data: ${JSON.stringify(e)}\n\n`));
  };
  const ctx: AgentContext = { runId, product, audience, budget, brandRules, connectors: buildAdapters(), memory: {}, artifacts, emit };
  (async () => {
    try { await runGraph(ctx); } 
    catch (err) { emit({ ts: Date.now(), agent: "system", type: "error", data: String(err) }); }
    finally { emit({ ts: Date.now(), agent: "system", type: "done", data: {} }); }
  })();
  if (idemKey) { try { await setIdempotentRunId(idemKey, runId); } catch {} }
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

// Approvals API: gate platform writes
app.post("/api/actions/:runId", async (req: any, reply) => {
  if (config.JWT_SECRET) {
    try { await req.jwtVerify(); } catch { reply.code(401); return { error: "unauthorized" }; }
  }
  const { runId } = req.params;
  const { actionId, approved, payload } = req.body || {};
  if (!actionId || typeof approved !== "boolean") { reply.code(400); return { error: "actionId and approved required" }; }
  await recordAction({ runId, actionId, approved, at: Date.now(), payload, approvedBy: "user" });
  return { ok: true };
});

// Policies endpoint
app.get("/api/policies", async () => {
  try {
    const guide = await readFile(join(process.cwd(), "server", "src", "policies", "brand_guide.md"), "utf8");
    const bannedJson = await readFile(join(process.cwd(), "server", "src", "datasets", "banned.json"), "utf8");
    const banned = JSON.parse(bannedJson);
    return { guide, banned };
  } catch {
    return { guide: "", banned: [] };
  }
});

// Not found
app.setNotFoundHandler((req, reply) => {
  reply.code(404).send({ error: "not_found", path: req.url });
});

// Error handler
app.setErrorHandler((err, req, reply) => {
  req.log.error({ err }, "request_error");
  reply.code(500).send({ error: "internal_error" });
});

app.addHook("onClose", async () => {
  listeners.forEach((set) => set.forEach((res) => { try { res.end(); } catch {} }));
  heartbeats.forEach((t) => clearInterval(t));
  heartbeats.clear();
});

app.listen({ port: config.PORT, host: config.HOST });
console.log(`Server on http://${config.HOST}:${config.PORT}`);


