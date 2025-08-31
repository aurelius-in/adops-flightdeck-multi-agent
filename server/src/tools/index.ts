import { Adapters } from "./types";
import { createMetaAdapter } from "./meta";
import { createGoogleAdsAdapter } from "./google";
import { createTikTokAdapter } from "./tiktok";
import { createGA4Adapter } from "./ga4";
import { createHubSpotAdapter } from "./hubspot";

export function buildAdapters(env: Record<string, any> = process.env): Adapters {
  return {
    ads: {
      meta: createMetaAdapter(env.META_ACCESS_TOKEN),
      google: createGoogleAdsAdapter(env.GOOGLE_ADS_REFRESH_TOKEN),
      tiktok: createTikTokAdapter(env.TIKTOK_ACCESS_TOKEN)
    },
    analytics: {
      ga4: createGA4Adapter(env.GA4_KEY_JSON)
    },
    crm: {
      hubspot: createHubSpotAdapter(env.HUBSPOT_TOKEN)
    }
  };
}


