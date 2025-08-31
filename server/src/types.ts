export type AgentEvent = { ts: number; agent: string; type: string; data: any };
export type Artifacts = Record<string, any>;

export type AgentContext = {
  runId: string;
  product: string;
  audience: string;
  budget: number;
  brandRules: string;
  connectors?: Record<string, any>;
  memory: Record<string, any>;
  artifacts: Artifacts;
  emit: (e: AgentEvent) => void;
};

export type Agent = (ctx: AgentContext) => Promise<void>;


