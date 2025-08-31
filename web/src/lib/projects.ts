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
  const seeds: Partial<Project>[] = [
    { name: "Project • Fitness Wearables", product: "SmartWater Bottle", audience: "Fitness enthusiasts 25–45", dailyBudget: 200, brandRules: "No medical claims. Friendly, confident tone."},
    { name: "Project • Q3 New Market", product: "Hydration App", audience: "Desk Athletes", dailyBudget: 150, brandRules: "Evidence-based tone. No guarantees."},
    { name: "Project • DTC Skincare", product: "Retinol Serum", audience: "Women 28–45, skincare-aware", dailyBudget: 350, brandRules: "No cure/diagnose claims. Dermatologist-reviewed."},
    { name: "Project • Meal Kits", product: "Family Meal Kit", audience: "Parents with 2+ kids", dailyBudget: 400, brandRules: "No weight-loss claims. Emphasize convenience."},
    { name: "Project • Fintech Card", product: "Cashback Credit Card", audience: "Young professionals 22–35", dailyBudget: 600, brandRules: "APR disclosures required. No guaranteed approvals."},
    { name: "Project • B2B SaaS", product: "Analytics Platform", audience: "Marketing Directors in eCom", dailyBudget: 500, brandRules: "No confidential benchmarks. Case studies approved only."},
    { name: "Project • Gaming", product: "Mobile RPG", audience: "Gamers 18–34", dailyBudget: 300, brandRules: "Avoid addictive framing. ESRB-appropriate."},
    { name: "Project • Travel OTA", product: "Weekend Getaways", audience: "Couples 25–44", dailyBudget: 450, brandRules: "No guarantee of availability. Taxes/fees apply."},
    { name: "Project • EdTech", product: "Language Learning App", audience: "Lifelong learners 20–55", dailyBudget: 250, brandRules: "No fluency guarantees. Emphasize practice."},
    { name: "Project • Auto", product: "EV Lease", audience: "Urban commuters 28–50", dailyBudget: 700, brandRules: "EPA ranges vary. Terms apply."},
    { name: "Project • Health DTC", product: "Electrolyte Mix", audience: "Endurance athletes", dailyBudget: 220, brandRules: "No medical claims. Hydration benefits only."},
    { name: "Project • Home Fitness", product: "Smart Rowing Machine", audience: "Home gym buyers", dailyBudget: 380, brandRules: "Results vary. No weight-loss promises."},
    { name: "Project • Fashion", product: "Sustainable Denim", audience: "Eco-conscious 20–40", dailyBudget: 260, brandRules: "Avoid greenwashing; specify materials."},
    { name: "Project • Pet Care", product: "Fresh Dog Food", audience: "Dog owners HHI 80k+", dailyBudget: 340, brandRules: "No medical cures. Vet-reviewed statements only."},
    { name: "Project • Streaming", product: "Documentary Bundle", audience: "Knowledge seekers", dailyBudget: 320, brandRules: "Content availability varies."},
    { name: "Project • Marketplace", product: "Handmade Goods", audience: "Millennial shoppers", dailyBudget: 210, brandRules: "No counterfeit claims; seller guidelines."},
    { name: "Project • Beauty", product: "Vitamin C Serum", audience: "Skincare explorers", dailyBudget: 290, brandRules: "Avoid medical outcomes; glow/brightness allowed."},
    { name: "Project • Education", product: "Coding Bootcamp", audience: "Career switchers 24–40", dailyBudget: 550, brandRules: "No job guarantees; outcomes vary."},
    { name: "Project • Home", product: "Air Purifier", audience: "Allergy sufferers", dailyBudget: 270, brandRules: "CADR disclosures; no cure claims."},
    { name: "Project • Coffee", product: "Single-Origin Subscription", audience: "Coffee aficionados", dailyBudget: 180, brandRules: "Sourcing transparency; no health claims."}
  ];
  const created = seeds.map(s=>createProject(s));
  if (created[0]) setLastProjectId(created[0].id);
}

function cryptoId(): string {
  try { return Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b=>b.toString(16).padStart(2,"0")).join(""); } catch { return Math.random().toString(36).slice(2); }
}


