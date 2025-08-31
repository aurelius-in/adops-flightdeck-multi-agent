import { useEffect, useState } from "react";
import { isOfflineMode, loadOfflineRun } from "../lib/offline";

export default function Plan({ onRun, runId }: { onRun: (id: string)=>void; runId?: string }) {
  const [product, setProduct] = useState("SmartWater Bottle");
  const [audience, setAudience] = useState("Fitness enthusiasts 25–45");
  const [budget, setBudget] = useState(200);
  const [rules, setRules] = useState("No medical claims. Friendly, confident tone.");
  const [snapshot, setSnapshot] = useState<any>(null);
  const [persona, setPersona] = useState<"Ad Rep"|"Executive">("Ad Rep");

  async function start() {
    if (isOfflineMode()) { onRun("offline-run"); return; }
    const res = await fetch("http://localhost:8787/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, audience, budget, brandRules: rules })
    });
    const json = await res.json();
    onRun(json.runId);
  }

  useEffect(() => {
    let active = true;
    async function load() {
      if (!runId && !isOfflineMode()) { setSnapshot(null); return; }
      if (isOfflineMode()) { const s = await loadOfflineRun(); if (active) setSnapshot(s); return; }
      const r = await fetch(`http://localhost:8787/api/runs/${runId}`).then(x=>x.json());
      if (active) setSnapshot(r);
    }
    load();
    const t = setInterval(load, 2000);
    return () => { active = false; clearInterval(t); };
  }, [runId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 card p-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-neutral-400">Product</label>
            <input className="w-full bg-neutral-950 border border-neutral-800 p-2 rounded outline-none focus:border-brand-blue" value={product} onChange={e=>setProduct(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-neutral-400">Daily budget</label>
            <input className="w-full bg-neutral-950 border border-neutral-800 p-2 rounded outline-none focus:border-brand-blue" value={budget} type="number" onChange={e=>setBudget(+e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-neutral-400">Audience</label>
            <textarea className="w-full bg-neutral-950 border border-neutral-800 p-2 rounded outline-none focus:border-brand-blue" value={audience} onChange={e=>setAudience(e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-neutral-400">Brand guardrails</label>
            <textarea className="w-full bg-neutral-950 border border-neutral-800 p-2 rounded outline-none focus:border-brand-blue" value={rules} onChange={e=>setRules(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="card p-4 flex items-end">
        <button title="Kick off agent workflow for this product and audience" className="w-full px-3 py-2 rounded-lg bg-white text-black hover:bg-brand-blue/80" onClick={start}>Run</button>
      </div>
      <div className="lg:col-span-3 card p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium text-brand-blue">Key outcomes</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-400">View for</span>
            <button className={`px-2 py-1 rounded border ${persona==="Ad Rep"?"bg-white text-black border-white":"bg-neutral-900 border-neutral-800"}`} onClick={()=>setPersona("Ad Rep")}>Ad Rep</button>
            <button className={`px-2 py-1 rounded border ${persona==="Executive"?"bg-white text-black border-white":"bg-neutral-900 border-neutral-800"}`} onClick={()=>setPersona("Executive")}>Executive</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <OutcomeCard title="Audiences" value={formatAudience(snapshot)} />
          <OutcomeCard title="Top offer" value={formatOffer(snapshot)} />
          {persona==="Ad Rep" ? (
            <OutcomeCard title="Creatives" value={formatCreative(snapshot)} />
          ) : (
            <OutcomeCard title="Budget & KPI" value={formatBudgetKPI(snapshot, budget)} />
          )}
        </div>
      </div>
      <AgentGrid title="Target & offer" agents={["Audience DNA","Warm start","Offer composer","Asset librarian","Creative brief"]} runId={runId} snapshot={snapshot} />
      <AgentGrid title="Creative & guardrails" agents={["Creative variants","Gene splicer","Tone balancer","Compliance review","Thumb‑stop","Localization","Accessibility","Style prompts","Voiceover scripts","UGC outline","Prompt palette"]} runId={runId} snapshot={snapshot} />
    </div>
  );
}

const AGENT_DISPLAY: Record<string, "tile"|"card"> = {
  // Large, information-dense cards
  "Audience DNA": "card",
  "Offer composer": "card",
  "Asset librarian": "card",
  "Creative brief": "card",
  "Creative variants": "card",
  "UGC outline": "card",
  "Thumb‑stop": "card",

  // Compact tiles
  "Warm start": "tile",
  "Gene splicer": "tile",
  "Tone balancer": "tile",
  "Compliance review": "tile",
  "Localization": "tile",
  "Accessibility": "tile",
  "Style prompts": "tile",
  "Voiceover scripts": "tile",
  "Prompt palette": "tile",
};

function AgentGrid({ title, agents, runId, snapshot}:{title:string; agents:string[]; runId?: string; snapshot?: any}) {
  return (
    <div className="lg:col-span-3 card p-4">
      <div className="font-medium mb-3 text-brand-blue">{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {agents.map(a=>{
          const mode = AGENT_DISPLAY[a] ?? "tile";
          return mode === "card"
            ? <AgentCardDetailed key={a} agent={a} runId={runId} snapshot={snapshot} />
            : <AgentTile key={a} agent={a} runId={runId} snapshot={snapshot} />;
        })}
      </div>
    </div>
  );
}

function AgentTile({ agent, runId, snapshot }:{agent:string; runId?: string; snapshot?: any}) {
  const s = snapshot?.artifacts || {};
  const summary = summarizePlan(agent, s);
  return (
    <div title="Agent module" className="border border-neutral-800 rounded-xl p-3 bg-neutral-950">
      <div className="text-sm font-medium flex items-center justify-between">
        <span>{agent}</span>
        {runId && <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700">live</span>}
      </div>
      <div className="text-xs text-neutral-300 mt-1">{runId && summary ? summary : (runId?"Populated.":"Populates after run begins.")}</div>
    </div>
  );
}

function summarizePlan(agentLabel: string, a: Record<string, any>): string | "" {
  try {
    switch (agentLabel) {
      case "Audience DNA": {
        const c = a.audienceDNA?.[0]; if (!c) return ""; return `${c.name} • ${c.size?.toLocaleString?.()} people`;
      }
      case "Warm start": {
        const p = a.warmStart?.priors?.[0]; if (!p) return ""; return `${p.category} • ${(p.confidence*100|0)}% confidence`;
      }
      case "Offer composer": {
        const o = a.offers?.[0]; if (!o) return ""; return `${o.label} • iROAS ${o.predicted_iROAS}`;
      }
      case "Asset librarian": {
        const n = a.assets?.length || 0; return n? `${n} tagged assets ready` : "";
      }
      case "Creative brief": {
        const b = a.creativeBrief; if (!b) return ""; return `${b.promise} • Tone: ${b.tone}`;
      }
      case "Creative variants": {
        const n = a.creatives?.length || 0; return n? `${n} variants ready` : "";
      }
      case "Gene splicer": {
        const g = a.generation?.gen; return g? `Generation ${g} evolved` : "";
      }
      case "Tone balancer": {
        const t = a.tone?.[0]?.readingGrade; return t? `Reading grade ≈ ${t}` : "";
      }
      case "Compliance review": {
        const list = a.compliance || []; const ok = list.filter((x:any)=>x.pass).length; return list.length? `${ok}/${list.length} pass` : "";
      }
      case "Thumb‑stop": {
        const bs = a.thumbstop?.best; return bs? `Best frame ${bs.frame} • ${(bs.stopProb*100|0)}%` : "";
      }
      case "Localization": {
        const n = a.localization?.length || 0; return n? `${n} locales` : "";
      }
      case "Accessibility": {
        const n = a.a11y?.length || 0; return n? `${n} alt texts` : "";
      }
      case "Style prompts": {
        const n = a.style?.prompts?.length || 0; return n? `${n} prompts` : "";
      }
      case "Voiceover scripts": {
        const n = a.voiceover?.length || 0; return n? `${n} scripts` : "";
      }
      case "UGC outline": {
        const n = a.ugc?.length || 0; return n? `${n} beats` : "";
      }
      case "Prompt palette": {
        const n = a.promptPalette?.tones?.length || 0; return n? `${n} tones configured` : "";
      }
      default:
        return "";
    }
  } catch {
    return "";
  }
}

function OutcomeCard({ title, value }:{ title:string; value:string }) {
  return (
    <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950" title="High-level outcome for quick review">
      <div className="text-xs text-neutral-400 mb-1">{title}</div>
      <div className="text-sm">{value || ("Run to populate.")}</div>
    </div>
  );
}

function formatAudience(snapshot?: any): string {
  const a = snapshot?.artifacts?.audienceDNA;
  if (!Array.isArray(a) || a.length===0) return "";
  const top = a[0];
  return `${top.name} • ${top.size?.toLocaleString?.()} ppl`;
}

function formatOffer(snapshot?: any): string {
  const o = snapshot?.artifacts?.offers;
  if (!Array.isArray(o) || o.length===0) return "";
  const top = o[0];
  return `${top.label} • iROAS ${top.predicted_iROAS}`;
}

function formatCreative(snapshot?: any): string {
  const c = snapshot?.artifacts?.creatives;
  if (!Array.isArray(c) || c.length===0) return "";
  return `${c[0].headline} • ${c[0].cta}`;
}

function formatBudgetKPI(snapshot?: any, budget?: number): string {
  const pacing = snapshot?.artifacts?.pacing;
  const total = Array.isArray(pacing) ? pacing.reduce((s:number,x:any)=>s+(x.dailyBudget||0),0) : (budget||0);
  const report = snapshot?.artifacts?.report;
  const iroas = report?.iROAS;
  return `Daily budget ${total} • iROAS ${iroas ?? "—"}`;
}

function AgentCardDetailed({ agent, runId, snapshot }:{agent:string; runId?: string; snapshot?: any}) {
  const a = snapshot?.artifacts || {};
  const header = (
    <div className="text-sm font-medium flex items-center justify-between mb-2">
      <span>{agent}</span>
      {runId && <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700">live</span>}
    </div>
  );
  const empty = <div className="text-xs text-neutral-400">{runId?"Populated.":"Populates after run begins."}</div>;

  switch (agent) {
    case "Audience DNA": {
      const cohorts = Array.isArray(a.audienceDNA) ? a.audienceDNA.slice(0,3) : [];
      return (
        <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950 md:col-span-2 lg:col-span-2">
          {header}
          {cohorts.length ? (
            <div className="space-y-1 text-xs">
              {cohorts.map((c:any)=> (
                <div key={c.name} className="flex items-center justify-between">
                  <div className="truncate">{c.name} <span className="text-neutral-500">• {c.angle}</span></div>
                  <div className="text-neutral-400">{c.size?.toLocaleString?.()} ppl</div>
                </div>
              ))}
            </div>
          ) : empty}
        </div>
      );
    }
    case "Offer composer": {
      const offers = Array.isArray(a.offers) ? a.offers.slice(0,3) : [];
      return (
        <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950">
          {header}
          {offers.length ? (
            <div className="space-y-1 text-xs">
              {offers.map((o:any)=> (
                <div key={o.label} className="flex items-center justify-between">
                  <div>{o.label}</div>
                  <div className="text-neutral-400">iROAS {o.predicted_iROAS}</div>
                </div>
              ))}
            </div>
          ) : empty}
        </div>
      );
    }
    case "Asset librarian": {
      const assets = Array.isArray(a.assets) ? a.assets.slice(0,6) : [];
      return (
        <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950">
          {header}
          {assets.length ? (
            <div className="flex flex-wrap gap-1 text-[11px]">
              {assets.map((as:any)=> (
                <span key={as.id} className="px-2 py-0.5 border border-neutral-800 rounded bg-neutral-900">{as.tags?.[0] ?? as.id}</span>
              ))}
            </div>
          ) : empty}
        </div>
      );
    }
    case "Creative brief": {
      const b = a.creativeBrief;
      return (
        <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950 md:col-span-2 lg:col-span-2">
          {header}
          {b ? (
            <div className="text-xs space-y-1">
              <div className="font-medium">{b.promise}</div>
              <div className="text-neutral-400">Tone: {b.tone}</div>
              <div className="flex flex-wrap gap-1">
                {(b.ctAs||[]).map((c:string)=> <span key={c} className="px-2 py-0.5 border border-neutral-800 rounded bg-neutral-900">{c}</span>)}
              </div>
            </div>
          ) : empty}
        </div>
      );
    }
    case "Creative variants": {
      const list = Array.isArray(a.creatives) ? a.creatives.slice(0,2) : [];
      return (
        <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950">
          {header}
          {list.length ? (
            <div className="text-xs space-y-1">
              {list.map((v:any,idx:number)=> (
                <div key={idx} className="truncate">{v.headline} <span className="text-neutral-500">• {v.cta}</span></div>
              ))}
            </div>
          ) : empty}
        </div>
      );
    }
    case "UGC outline": {
      const beats = Array.isArray(a.ugc) ? a.ugc.slice(0,5) : [];
      return (
        <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950">
          {header}
          {beats.length ? (
            <ol className="list-decimal list-inside text-xs space-y-0.5">
              {beats.map((b:string, i:number)=> <li key={i} className="truncate">{b}</li>)}
            </ol>
          ) : empty}
        </div>
      );
    }
    case "Thumb‑stop": {
      const best = a.thumbstop?.best;
      return (
        <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950">
          {header}
          {best ? (
            <div className="text-xs">
              <div className="mb-1">Caption: {best.caption ?? "Best frame"}</div>
              <div className="text-neutral-400">Attention: {(best.stopProb*100|0)}%</div>
            </div>
          ) : empty}
        </div>
      );
    }
    default:
      return (
        <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950">
          {header}
          <div className="text-xs text-neutral-300">{summarizePlan(agent, a) || empty}</div>
        </div>
      );
  }
}


