export type AdapterResponse<T = any> = { ok: boolean; data?: T; error?: string };

export interface AdsAdapter {
  createCampaign(input: any): Promise<AdapterResponse>;
  updateBid(input: any): Promise<AdapterResponse>;
  pauseAd(input: any): Promise<AdapterResponse>;
}

export interface AnalyticsAdapter {
  fetchMetrics(query: any): Promise<AdapterResponse>;
}

export interface CrmAdapter {
  upsertAudience(payload: any): Promise<AdapterResponse>;
}

export type Adapters = {
  ads?: Partial<Record<"meta" | "google" | "tiktok", AdsAdapter>>;
  analytics?: Partial<Record<"ga4", AnalyticsAdapter>>;
  crm?: Partial<Record<"hubspot" | "salesforce", CrmAdapter>>;
};


