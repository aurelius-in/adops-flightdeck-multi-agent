import { AgentContext } from "./types";
import * as A from "./agents/catalog";

export async function runGraph(ctx: AgentContext) {
  // PLAN
  await A.audienceDNA(ctx);
  await A.warmStart(ctx);
  await A.offerComposer(ctx);
  await A.assetLibrarian(ctx);
  await A.creativeBrief(ctx);

  await A.creativeGenerator(ctx);
  await A.geneSplicer(ctx);
  await A.toneBalancer(ctx);
  await A.complianceSentinel(ctx);
  await A.thumbStop(ctx);
  await A.multilingualLocalizer(ctx);
  await A.accessibilityAgent(ctx);
  await A.styleTransfer(ctx);
  await A.voiceoverScript(ctx);
  await A.ugcOutline(ctx);
  await A.promptPalette(ctx);

  // OPERATE
  await A.experimentPlanner(ctx);
  await A.spendPacer(ctx);
  await A.supplyPathOptimizer(ctx);
  await A.roadmapPlanner(ctx);

  await A.anomalyWatchdog(ctx);
  await A.rootCauseSleuth(ctx);
  await A.negativeSignalMiner(ctx);
  await A.fraudSentinel(ctx);
  await A.budgetOfficer(ctx);
  await A.changeAuditor(ctx);

  // AUDIT & LEARN
  await A.attributionReconciler(ctx);
  await A.ltvForecaster(ctx);
  await A.reporter(ctx);
  await A.execNarrative(ctx);
  await A.knowledgeDistiller(ctx);
}


