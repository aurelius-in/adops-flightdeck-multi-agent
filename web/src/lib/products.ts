export type ProductTemplate = {
  id: string;
  name: string; // product label
  audience?: string;
  dailyBudget?: number;
  brandRules?: string;
};

const KEY_PRODUCTS = "af_products";

function loadJSON<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); if (!raw) return fallback; return JSON.parse(raw) as T; } catch { return fallback; }
}
function saveJSON(key: string, value: any) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }

export function listProducts(): ProductTemplate[] {
  return loadJSON<ProductTemplate[]>(KEY_PRODUCTS, []);
}

export function createProductTemplate(partial: Partial<ProductTemplate>): ProductTemplate {
  const p: ProductTemplate = {
    id: cryptoId(),
    name: partial.name || "Untitled Product",
    audience: partial.audience,
    dailyBudget: partial.dailyBudget,
    brandRules: partial.brandRules,
  };
  const list = listProducts();
  list.unshift(p);
  saveJSON(KEY_PRODUCTS, list);
  return p;
}

export function seedSampleProductsIfEmpty() {
  const list = listProducts(); if (list.length>0) return;
  const seeds: Partial<ProductTemplate>[] = [
    { name: "SmartWater Bottle", audience: "Fitness enthusiasts 25–45", dailyBudget: 200, brandRules: "No medical claims. Friendly, confident tone."},
    { name: "Hydration App", audience: "Desk Athletes", dailyBudget: 150, brandRules: "Evidence-based tone. No guarantees."},
    { name: "Retinol+ Night Serum", audience: "Skincare-aware women 28–45", dailyBudget: 350, brandRules: "No cure/diagnose claims."},
    { name: "Family Meal Kit", audience: "Parents with 2+ kids", dailyBudget: 400, brandRules: "Emphasize convenience; no weight-loss."},
    { name: "Cashback Pro Card", audience: "Young professionals 22–35", dailyBudget: 600, brandRules: "APR disclosures required."},
    { name: "Insight Analytics SaaS", audience: "eCom Marketing Directors", dailyBudget: 500, brandRules: "No confidential benchmarks."},
    { name: "Legends RPG Mobile", audience: "Gamers 18–34", dailyBudget: 300, brandRules: "ESRB-appropriate; avoid addictive framing."},
    { name: "Weekend Getaways", audience: "Couples 25–44", dailyBudget: 450, brandRules: "Availability varies; taxes/fees apply."},
    { name: "LingoNow", audience: "Lifelong learners 20–55", dailyBudget: 250, brandRules: "No fluency guarantees."},
    { name: "City EV Lease", audience: "Urban commuters 28–50", dailyBudget: 700, brandRules: "EPA ranges vary. Terms apply."},
    { name: "Electrolyte Mix", audience: "Endurance athletes", dailyBudget: 220, brandRules: "Hydration benefits only."},
    { name: "Smart Rowing Machine", audience: "Home gym buyers", dailyBudget: 380, brandRules: "Results vary."},
    { name: "Eco Denim", audience: "Eco-conscious 20–40", dailyBudget: 260, brandRules: "Substantiate sustainability claims."},
    { name: "Fresh Pup Meals", audience: "Dog owners HHI 80k+", dailyBudget: 340, brandRules: "Vet-reviewed statements only."},
    { name: "DocuStream Bundle", audience: "Knowledge seekers", dailyBudget: 320, brandRules: "Content availability varies."},
    { name: "Handmade Marketplace", audience: "Millennial shoppers", dailyBudget: 210, brandRules: "No counterfeit claims."},
    { name: "C+ Glow Serum", audience: "Skincare explorers", dailyBudget: 290, brandRules: "Avoid medical outcomes; glow allowed."},
    { name: "SwitchUp Bootcamp", audience: "Career switchers 24–40", dailyBudget: 550, brandRules: "No job guarantees."},
    { name: "Pure Air Purifier", audience: "Allergy sufferers", dailyBudget: 270, brandRules: "No cure claims; disclose CADR."},
    { name: "Single-Origin Coffee Club", audience: "Coffee aficionados", dailyBudget: 180, brandRules: "Sourcing transparency; no health claims."}
  ];
  saveJSON(KEY_PRODUCTS, seeds.map(s=>createProductTemplate(s)));
}

function cryptoId(): string {
  try { return Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b=>b.toString(16).padStart(2,"0")).join(""); } catch { return Math.random().toString(36).slice(2); }
}


