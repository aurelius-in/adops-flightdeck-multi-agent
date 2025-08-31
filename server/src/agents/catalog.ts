import { Agent, AgentContext } from "../types";
import { mkEvent, sleep } from "../utils";

const rand = (min:number, max:number) => +(min + Math.random()*(max-min)).toFixed(2);

// Helper to emit and store artifacts
function write(ctx: AgentContext, key: string, data: any, agent: string, type="data") {
  ctx.artifacts[key] = data;
  ctx.emit(mkEvent(agent, type, data));
}

// ---------------------- PLAN: Target & Offer ----------------------
export const audienceDNA: Agent = async (ctx) => {
  const cohorts = [
    { name: "HIIT Heroes", size: 42000, ltv: 280, affinities: ["Wearables","Electrolytes"], angle: "performance & recovery" },
    { name: "Desk Athletes", size: 67000, ltv: 190, affinities: ["Posture","Focus"], angle: "habit nudges" },
    { name: "Biohack Moms", size: 23000, ltv: 350, affinities: ["Sleep","Macros"], angle: "family wellness" },
  ];
  write(ctx, "audienceDNA", cohorts, "audienceDNA", "cohorts");
};

export const warmStart: Agent = async (ctx) => {
  const priors = [
    { category: "Smart Hydration", confidence: 0.78 },
    { category: "Connected Fitness", confidence: 0.65 },
  ];
  write(ctx, "warmStart", { priors, initialBids: { meta: 1.2, search: 1.5, tiktok: 0.9 } }, "warmStart", "priors");
};

export const offerComposer: Agent = async (ctx) => {
  const base = Math.max(10, Math.min(50, Math.floor(ctx.budget/5)));
  const offers = [
    { label: "Bundle x2", marginFloor: 0.35, predicted_iROAS: 2.1 },
    { label: `${base}% Off 1st`, marginFloor: 0.25, predicted_iROAS: 1.8 },
    { label: "Free Ship w/ Min", marginFloor: 0.4, predicted_iROAS: 1.6 },
  ];
  write(ctx, "offers", offers, "offers", "matrix");
};

export const assetLibrarian: Agent = async (ctx) => {
  const assets = [
    { id: "img01", tags: ["blue","outdoor","bottle"], palette: ["#1E3A8A","#93C5FD"] },
    { id: "img02", tags: ["gym","closeup","sweat"], palette: ["#111827","#F59E0B"] },
  ];
  write(ctx, "assets", assets, "assets", "catalog");
};

export const creativeBrief: Agent = async (ctx) => {
  const brief = { promise: "Hydration you can measure", tone: "confident, friendly", angles: ["performance","habit"], ctAs:["Start your trial","Track your hydration"] };
  write(ctx, "creativeBrief", brief, "brief", "doc");
};

// ---------------------- PLAN: Creative & Guardrails ----------------------
export const creativeGenerator: Agent = async (ctx) => {
  const variants = [
    { headline: "Proven hydration for busy days", primaryText: "See your intake in real time. Feel the difference in a week.", cta: "Start your trial", imagePrompt: "athlete tying shoes, dawn run" },
    { headline: "Make hydration a habit", primaryText: "Smart reminders that adapt to your day.", cta: "Get started", imagePrompt: "desk worker with sleek bottle, soft light" },
    { headline: "Train harder, recover faster", primaryText: "Electrolyte-aware tracking for serious sessions.", cta: "Learn more", imagePrompt: "gym scene, sweat, closeup bottle" }
  ];
  write(ctx, "creatives", variants, "creative", "variants");
};

export const geneSplicer: Agent = async (ctx) => {
  const v = (ctx.artifacts as any).creatives || [];
  const evolved = v.slice(0,3).map((x:any,i:number)=>({ ...x, headline: x.headline.replace(/best|top/ig,"proven"), note:"Gen2" }));
  write(ctx, "generation", { gen: 2, variants: evolved }, "splicer", "generation");
};

export const toneBalancer: Agent = async (ctx) => {
  const v = (ctx.artifacts as any).creatives || [];
  const balanced = v.map((x:any)=>({ ...x, tone:"confident, friendly", readingGrade: 6 }));
  write(ctx, "tone", balanced, "tone", "balanced");
};

export const complianceSentinel: Agent = async (ctx) => {
  const v = (ctx.artifacts as any).creatives || [];
  const results = v.map((x:any,i:number)=>({ idx:i, pass: !/cure|guarantee/i.test(x.primaryText), fixes: x.primaryText.replace(/guarantee/ig,"aim") }));
  write(ctx, "compliance", results, "compliance", "review");
};

export const thumbStop: Agent = async (ctx) => {
  const frames = Array.from({length: 6}).map((_,i)=>({ frame: i, stopProb: +(0.2 + Math.random()*0.6).toFixed(2), caption: i===0?"Lead with benefit":"Add social proof" }));
  frames.sort((a,b)=>b.stopProb-a.stopProb);
  write(ctx, "thumbstop", { best: frames[0], ranked: frames }, "thumbstop", "ranked");
};

export const multilingualLocalizer: Agent = async (ctx) => {
  const localized = [{ lang:"es", headline:"Hidratación comprobada", cta:"Empieza tu prueba" }];
  write(ctx, "localization", localized, "localize", "variants");
};

export const accessibilityAgent: Agent = async (ctx) => {
  const alts = ((ctx.artifacts as any).creatives||[]).map((_:any,i:number)=>({ variant:i, alt:`Product photo variant ${i} showing target context` }));
  write(ctx, "a11y", alts, "a11y", "alts");
};

export const styleTransfer: Agent = async (ctx) => {
  const prompts = ((ctx.artifacts as any).creatives||[]).map((x:any)=>x.imagePrompt + ", brand palette compliant, high-contrast");
  write(ctx, "style", { prompts }, "style", "prompts");
};

export const voiceoverScript: Agent = async (ctx) => {
  const scripts = [
    { seconds: 6, script: "Hydration you can measure. Smarter reminders. Better days." },
    { seconds: 6, script: "Track. Sip. Repeat. Make hydration a habit." }
  ];
  write(ctx, "voiceover", scripts, "voiceover", "scripts");
};

export const ugcOutline: Agent = async (ctx) => {
  const outline = ["Hook: tired at desk", "Problem: headaches", "Solution: smart bottle", "Proof: app view", "CTA: Start trial"];
  write(ctx, "ugc", outline, "ugc", "outline");
};

export const promptPalette: Agent = async (ctx) => {
  const palette = { tones:["confident","friendly","evidence-based"], claims:["no medical guarantees"], emojis:false };
  write(ctx, "promptPalette", palette, "palette", "rules");
};

// ---------------------- OPERATE: Pacing & Delivery ----------------------
export const experimentPlanner: Agent = async (ctx) => {
  const plan = { arms: 3, metric: "iROAS", minRuntimeHours: 24, stopRule: "2x std err over baseline" };
  write(ctx, "experiment", plan, "experiment", "design");
};

export const spendPacer: Agent = async (ctx) => {
  const vCount = ((ctx.artifacts as any).creatives||[]).length || 3;
  const plan = Array.from({length:vCount}).map((_,i)=>({ arm:i, dailyBudget: +(ctx.budget/vCount).toFixed(2), bid: +(0.6 + Math.random()*0.8).toFixed(2) }));
  write(ctx, "pacing", plan, "pacing", "plan");
};

export const supplyPathOptimizer: Agent = async (ctx) => {
  const spo = [{ path:"ExchangeA>DSP1", win:0.62, ivt:0.01 }, { path:"ExchangeB>DSP2", win:0.55, ivt:0.03 }];
  write(ctx, "spo", { allow:["ExchangeA>DSP1"], deny:["ExchangeB>DSP2"] , detail: spo }, "spo", "routes");
};

export const roadmapPlanner: Agent = async (ctx) => {
  const backlog = [
    { name:"Frame test", impact: "high", ttd:"short" },
    { name:"Offer type", impact: "med", ttd:"short" },
    { name:"New cohort", impact: "med", ttd:"med" }
  ];
  write(ctx, "roadmap", backlog, "roadmap", "queue");
};

// ---------------------- OPERATE: Watch & Respond ----------------------
export const anomalyWatchdog: Agent = async (ctx) => {
  const ticks = 10;
  (ctx.artifacts as any).history = [];
  for (let t=0;t<ticks;t++) {
    const metrics = Array.from({length:3}).map((_,i)=>{
      const impr = 120 + Math.floor(Math.random()*80);
      const clicks = Math.max(1, Math.floor(impr*(0.02+Math.random()*0.03)));
      const spend = +(1+Math.random()*3).toFixed(2);
      const conv = Math.random()<0.1 ? 1 : 0;
      return { impr, clicks, spend, conv, ctr: +(clicks/impr).toFixed(3), cpc: +(spend/Math.max(clicks,1)).toFixed(2) };
    });
    const actions:any[] = [];
    metrics.forEach((m,i)=>{
      if (m.ctr > 0.04) actions.push({ t, variant:i, action:"boost", reason:"High CTR" });
      if (m.ctr < 0.015) actions.push({ t, variant:i, action:"pause", reason:"Low CTR" });
    });
    (ctx.artifacts as any).history.push({ t, metrics, actions });
    ctx.emit(mkEvent("anomaly","tick",{ t, metrics, actions }));
    await sleep(1500);
  }
  ctx.emit(mkEvent("anomaly","done",{}));
};

export const rootCauseSleuth: Agent = async (ctx) => {
  const suspects = [
    { factor: "Creative Fatigue", weight: 0.34, action: "Rotate Gen2 headline" },
    { factor: "Inventory Shift", weight: 0.27, action: "Raise bid cap by 5%" },
    { factor: "Geo Mix", weight: 0.22, action: "Reduce CA, boost TX" },
    { factor: "Device", weight: 0.17, action: "Mobile-first cut for first 2s" }
  ];
  write(ctx, "rootcause", { suspects }, "rootcause", "analysis");
};

export const negativeSignalMiner: Agent = async (ctx) => {
  const negatives = ["free download", "kids", "DIY hack"];
  write(ctx, "negatives", negatives, "negatives", "list");
};

export const fraudSentinel: Agent = async (ctx) => {
  const ivt = { rate: 0.012, sources: ["datacenter-ip","click-farm-suspect"], action: "exclude segment X" };
  write(ctx, "fraud", ivt, "fraud", "ivtrate");
};

export const budgetOfficer: Agent = async (ctx) => {
  const caps = { dailyMax: ctx.budget, perChannel: { meta: ctx.budget*0.5, search: ctx.budget*0.35, tiktok: ctx.budget*0.15 } };
  write(ctx, "budget", caps, "budget", "caps");
};

export const changeAuditor: Agent = async (ctx) => {
  const log = [{ at: Date.now(), user:"system", change:"Paused variant 2 due to CTR < 1.5%" }];
  write(ctx, "auditLog", log, "audit", "changes");
};

// ---------------------- AUDIT & LEARN ----------------------
export const attributionReconciler: Agent = async (ctx) => {
  const credit = [
    { channel: "Meta", point: 0.42, low: 0.35, high: 0.5 },
    { channel: "Search", point: 0.33, low: 0.28, high: 0.39 },
    { channel: "TikTok", point: 0.18, low: 0.12, high: 0.24 },
    { channel: "Email", point: 0.07, low: 0.05, high: 0.1 },
  ];
  const realloc = [{ from:"TikTok", to:"Meta", pct: 10 },{ from:"Search", to:"Email", pct: 3 }];
  write(ctx, "attribution", { credit, realloc }, "attrib", "credit");
};

export const ltvForecaster: Agent = async (ctx) => {
  const cohorts = [{ cohort:"HIIT Heroes", ltv: 280 }, { cohort:"Desk Athletes", ltv: 190 }];
  write(ctx, "ltv", cohorts, "ltv", "curves");
};

export const reporter: Agent = async (ctx) => {
  const summary = { iROAS: 2.4, recommendation: "Scale variant 1, pause 2", artifacts: Object.keys(ctx.artifacts) };
  write(ctx, "report", summary, "report", "summary");
};

export const execNarrative: Agent = async (ctx) => {
  const narrative = "Performance stabilized with improved CTR on Gen2 creatives; reallocating 10% to Meta increases iROAS.";
  write(ctx, "execNarrative", narrative, "exec", "narrative");
};

export const knowledgeDistiller: Agent = async (ctx) => {
  const playbook = ["Hook with benefit first", "Guard claims; avoid guarantees", "Prioritize HIIT Heroes + Desk Athletes"];
  write(ctx, "playbook", playbook, "distill", "playbook");
};


