import { AdsAdapter, AdapterResponse } from "./types";

export function createTikTokAdapter(token?: string): AdsAdapter {
  return {
    async createCampaign(input: any): Promise<AdapterResponse> { return { ok: true, data: { id: "tiktok-campaign-1", input } }; },
    async updateBid(input: any): Promise<AdapterResponse> { return { ok: true, data: { updated: true, input } }; },
    async pauseAd(input: any): Promise<AdapterResponse> { return { ok: true, data: { paused: true, input } }; },
  };
}


