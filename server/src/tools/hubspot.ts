import { CrmAdapter, AdapterResponse } from "./types";

export function createHubSpotAdapter(token?: string): CrmAdapter {
  return {
    async upsertAudience(payload: any): Promise<AdapterResponse> { return { ok: true, data: { upserted: true, payload } }; }
  };
}


