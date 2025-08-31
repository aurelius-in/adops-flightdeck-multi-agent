import { AgentEvent } from "./types";

export const now = () => Date.now();

export function mkEvent(agent: string, type: string, data: any): AgentEvent {
  return { ts: now(), agent, type, data };
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}


