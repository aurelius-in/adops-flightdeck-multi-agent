import Fastify from "fastify";
import cors from "@fastify/cors";
import { nanoid } from "nanoid";
import { runGraph } from "./graph";
import { AgentContext } from "./types";

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

const runs = new Map<string, any>();
const listeners = new Map<string, Set<any>>();

app.post("/api/run", async (req: any) => {
  const { product, audience, budget, brandRules, connectors } = req.body || {};
  const runId = nanoid();
  const artifacts: any = {};
  runs.set(runId, { artifacts });
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
  req.raw.on("close", () => { set.delete(reply.raw); });
  return reply;
});

app.get("/api/runs/:runId", async (req: any) => runs.get(req.params.runId) || {});

app.listen({ port: 8787 });
console.log("Server on http://localhost:8787");


