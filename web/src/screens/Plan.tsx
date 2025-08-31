import { useEffect, useState } from "react";
import { isOfflineMode, loadOfflineRun } from "../lib/offline";

export default function Plan({ onRun, runId }: { onRun: (id: string)=>void; runId?: string }) {
  const [product, setProduct] = useState("SmartWater Bottle");
  const [audience, setAudience] = useState("Fitness enthusiasts 25–45");
  const [budget, setBudget] = useState(200);
  const [rules, setRules] = useState("No medical claims. Friendly, confident tone.");
  const [snapshot, setSnapshot] = useState<any>(null);

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
      <AgentGrid title="Target & offer" agents={["Audience DNA","Warm start","Offer composer","Asset librarian","Creative brief"]} runId={runId} snapshot={snapshot} />
      <AgentGrid title="Creative & guardrails" agents={["Creative variants","Gene splicer","Tone balancer","Compliance review","Thumb‑stop","Localization","Accessibility","Style prompts","Voiceover scripts","UGC outline","Prompt palette"]} runId={runId} snapshot={snapshot} />
    </div>
  );
}

function AgentGrid({ title, agents, runId, snapshot}:{title:string; agents:string[]; runId?: string; snapshot?: any}) {
  return (
    <div className="lg:col-span-3 card p-4">
      <div className="font-medium mb-3 text-brand-blue">{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {agents.map(a=><AgentCard key={a} agent={a} runId={runId} snapshot={snapshot}/>)}
      </div>
    </div>
  );
}

function AgentCard({ agent, runId, snapshot }:{agent:string; runId?: string; snapshot?: any}) {
  const s = snapshot?.artifacts || {};
  const summary = summarizePlan(agent, s);
  return (
    <div title="Agent module that populates this area during the run" className="border border-neutral-800 rounded-xl p-3 bg-neutral-950">
      <div className="text-sm font-medium">{agent}</div>
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


