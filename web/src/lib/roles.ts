export type UserRole = "Ad Rep"|"Creative"|"Compliance"|"Media Buyer"|"Executive";

export type RoleConfig = {
  planAgents: string[];
  operateBlocks: [agent:string, type?:string][];
  audit: { showAttribution:boolean; attributionWhatIf:boolean; showLTV:boolean; showReport:boolean; showExec:boolean; compactAttribution:boolean };
};

const ALL_PLAN = [
  "Audience DNA","Warm start","Offer composer","Asset librarian","Creative brief",
  "Creative variants","Gene splicer","Tone balancer","Compliance review","Thumb‑stop",
  "Localization","Accessibility","Style prompts","Voiceover scripts","UGC outline","Prompt palette"
];

const ALL_OPERATE: [string,string?][] = [
  ["experiment","design"],["pacing","plan"],["spo","routes"],["roadmap","queue"],
  ["anomaly","tick"],["rootcause","analysis"],["negatives","list"],["fraud","ivtrate"],["budget","caps"],["audit","changes"]
];

export const roleConfig: Record<UserRole, RoleConfig> = {
  "Ad Rep": {
    planAgents: ["Audience DNA","Warm start","Offer composer","Asset librarian","Creative brief","Creative variants","UGC outline","Thumb‑stop"],
    operateBlocks: [["experiment","design"],["pacing","plan"],["roadmap","queue"],["anomaly","tick"],["rootcause","analysis"],["negatives","list"],["budget","caps"],["audit","changes"]],
    audit: { showAttribution:true, attributionWhatIf:false, showLTV:true, showReport:true, showExec:false, compactAttribution:true }
  },
  "Creative": {
    planAgents: ["Creative brief","Creative variants","Gene splicer","Tone balancer","Style prompts","Voiceover scripts","UGC outline","Accessibility","Localization"],
    operateBlocks: [["experiment","design"],["anomaly","tick"],["rootcause","analysis"],["roadmap","queue"],["audit","changes"],["negatives","list"]],
    audit: { showAttribution:false, attributionWhatIf:false, showLTV:true, showReport:true, showExec:false, compactAttribution:true }
  },
  "Compliance": {
    planAgents: ["Compliance review","Creative brief","Prompt palette","Accessibility","Localization"],
    operateBlocks: [["audit","changes"],["negatives","list"],["fraud","ivtrate"]],
    audit: { showAttribution:true, attributionWhatIf:false, showLTV:false, showReport:true, showExec:false, compactAttribution:true }
  },
  "Media Buyer": {
    planAgents: ["Audience DNA","Warm start","Offer composer","Creative variants","Thumb‑stop"],
    operateBlocks: ALL_OPERATE,
    audit: { showAttribution:true, attributionWhatIf:true, showLTV:true, showReport:true, showExec:false, compactAttribution:false }
  },
  "Executive": {
    planAgents: ["Audience DNA","Warm start","Offer composer","Creative brief","Creative variants"],
    operateBlocks: [["experiment","design"],["pacing","plan"],["anomaly","tick"],["rootcause","analysis"],["negatives","list"],["budget","caps"],["roadmap","queue"],["audit","changes"]],
    audit: { showAttribution:true, attributionWhatIf:true, showLTV:true, showReport:true, showExec:true, compactAttribution:false }
  }
};

export function allowedPlanAgents(role?: string): string[] {
  if (!role || !(role in roleConfig)) return ALL_PLAN;
  return roleConfig[role as UserRole].planAgents;
}

export function allowedOperateBlocks(role?: string): [string,string?][] {
  if (!role || !(role in roleConfig)) return ALL_OPERATE;
  return roleConfig[role as UserRole].operateBlocks;
}

export function auditPreferences(role?: string) {
  if (!role || !(role in roleConfig)) return roleConfig["Media Buyer"]; // default to full
  return roleConfig[role as UserRole];
}

export function allowedTabs(role?: string): ("Plan"|"Operate"|"Audit")[] {
  // Framework for role-based tab visibility. Adjust per org policy.
  switch (role as UserRole) {
    case "Ad Rep":
    case "Media Buyer":
    case "Executive":
      return ["Plan","Operate","Audit"];
    case "Creative":
      return ["Plan","Operate","Audit"]; // creatives often need LTV/report read-only
    case "Compliance":
      return ["Plan","Operate","Audit"]; // compliance needs Audit/export
    default:
      return ["Plan","Operate","Audit"];
  }
}


