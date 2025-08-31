import { AnalyticsAdapter, AdapterResponse } from "./types";

export function createGA4Adapter(keyJson?: string): AnalyticsAdapter {
  return {
    async fetchMetrics(query: any): Promise<AdapterResponse> { return { ok: true, data: { rows: [], query } }; }
  };
}


