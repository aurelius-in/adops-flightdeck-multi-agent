import { AdsAdapter, AdapterResponse } from "./types";

export function createMetaAdapter(token?: string): AdsAdapter {
  return {
    async createCampaign(input: any): Promise<AdapterResponse> {
      // TODO: call Meta Marketing API
      return { ok: true, data: { id: "meta-campaign-1", input } };
    },
    async updateBid(input: any): Promise<AdapterResponse> {
      return { ok: true, data: { updated: true, input } };
    },
    async pauseAd(input: any): Promise<AdapterResponse> {
      return { ok: true, data: { paused: true, input } };
    },
  };
}


