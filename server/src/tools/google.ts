import { AdsAdapter, AdapterResponse } from "./types";

export function createGoogleAdsAdapter(refreshToken?: string): AdsAdapter {
  return {
    async createCampaign(input: any): Promise<AdapterResponse> { return { ok: true, data: { id: "google-campaign-1", input } }; },
    async updateBid(input: any): Promise<AdapterResponse> { return { ok: true, data: { updated: true, input } }; },
    async pauseAd(input: any): Promise<AdapterResponse> { return { ok: true, data: { paused: true, input } }; },
  };
}


