export type Project = {
  id: string;
  name: string;
  product?: string;
  audience?: string;
  dailyBudget?: number;
  brandRules?: string;
  channels?: string[];
  locales?: string[];
  archivedAt?: number|null;
  createdAt: number;
  updatedAt: number;
};

export type RunSummary = {
  id: string;
  projectId: string;
  startedAt: number;
  status: "running"|"done"|"paused";
  iROAS?: number;
  cpa?: number;
};

const KEY_PROJS = "af_projects";
const KEY_RUNS = "af_runs"; // map projectId -> RunSummary[]
const KEY_LAST = "af_last_project";

function loadJSON<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); if (!raw) return fallback; return JSON.parse(raw) as T; } catch { return fallback; }
}
function saveJSON(key: string, value: any) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }

export function listProjects(): Project[] {
  return loadJSON<Project[]>(KEY_PROJS, []);
}

export function upsertProject(p: Project): Project {
  const list = listProjects();
  const idx = list.findIndex(x=>x.id===p.id);
  if (idx>=0) list[idx] = p; else list.unshift(p);
  saveJSON(KEY_PROJS, list);
  saveJSON(KEY_LAST, p.id);
  return p;
}

export function createProject(data: Partial<Project>): Project {
  const now = Date.now();
  const p: Project = {
    id: cryptoId(),
    name: data.name || `Project ${new Date(now).toLocaleDateString()}`,
    product: data.product,
    audience: data.audience,
    dailyBudget: data.dailyBudget,
    brandRules: data.brandRules,
    channels: data.channels || ["Meta","Search","TikTok"],
    locales: data.locales || ["en"],
    archivedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  return upsertProject(p);
}

export function duplicateProject(sourceId: string): Project | null {
  const src = listProjects().find(p=>p.id===sourceId); if (!src) return null;
  return createProject({
    name: `${src.name} (Copy)`,
    product: src.product,
    audience: src.audience,
    dailyBudget: src.dailyBudget,
    brandRules: src.brandRules,
    channels: src.channels,
    locales: src.locales,
  });
}

export function archiveProject(id: string): void {
  const list = listProjects();
  const idx = list.findIndex(p=>p.id===id); if (idx<0) return;
  list[idx].archivedAt = Date.now();
  list[idx].updatedAt = Date.now();
  saveJSON(KEY_PROJS, list);
}

export function setLastProjectId(id: string) { saveJSON(KEY_LAST, id); }
export function getLastProjectId(): string | null { try { return localStorage.getItem(KEY_LAST); } catch { return null; } }

export function listRuns(projectId: string): RunSummary[] {
  const all = loadJSON<Record<string, RunSummary[]>>(KEY_RUNS, {});
  return (all[projectId] || []).slice().sort((a,b)=>b.startedAt - a.startedAt);
}

export function addRun(projectId: string, partial?: Partial<RunSummary>): RunSummary {
  const run: RunSummary = {
    id: cryptoId(),
    projectId,
    startedAt: Date.now(),
    status: partial?.status || "running",
    iROAS: partial?.iROAS,
    cpa: partial?.cpa,
  };
  const all = loadJSON<Record<string, RunSummary[]>>(KEY_RUNS, {});
  all[projectId] = [run, ...(all[projectId]||[])].slice(0,50);
  saveJSON(KEY_RUNS, all);
  return run;
}

export function seedSampleProjectsIfEmpty() {
  const list = listProjects();
  if (list.length>0) return;
  const p1 = createProject({ name: "Getting Started", product: "SmartWater Bottle", audience: "Fitness enthusiasts 25–45", dailyBudget: 200, brandRules: "No medical claims. Friendly, confident tone."});
  const p2 = createProject({ name: "Q3 New Market", product: "Hydration App", audience: "Desk Athletes", dailyBudget: 150, brandRules: "Evidence-based tone. No guarantees."});
  setLastProjectId(p1.id);
}

function cryptoId(): string {
  try { return Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b=>b.toString(16).padStart(2,"0")).join(""); } catch { return Math.random().toString(36).slice(2); }
}


