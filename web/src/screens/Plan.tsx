import { useState } from "react";
import { isOfflineMode } from "../lib/offline";

export default function Plan({ onRun, runId }: { onRun: (id: string)=>void; runId?: string }) {
  const [product, setProduct] = useState("SmartWater Bottle");
  const [audience, setAudience] = useState("Fitness enthusiasts 25–45");
  const [budget, setBudget] = useState(200);
  const [rules, setRules] = useState("No medical claims. Friendly, confident tone.");

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
      <AgentGrid title="Target & offer" agents={["Audience DNA","Warm start","Offer composer","Asset librarian","Creative brief"]} runId={runId} />
      <AgentGrid title="Creative & guardrails" agents={["Creative variants","Gene splicer","Tone balancer","Compliance review","Thumb‑stop","Localization","Accessibility","Style prompts","Voiceover scripts","UGC outline","Prompt palette"]} runId={runId} />
    </div>
  );
}

function AgentGrid({ title, agents, runId}:{title:string; agents:string[]; runId?: string}) {
  return (
    <div className="lg:col-span-3 card p-4">
      <div className="font-medium mb-3 text-brand-blue">{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {agents.map(a=><AgentCard key={a} agent={a} runId={runId}/>)}
      </div>
    </div>
  );
}

function AgentCard({ agent, runId }:{agent:string; runId?: string}) {
  return (
    <div title="Agent module that populates this area during the run" className="border border-neutral-800 rounded-xl p-3 bg-neutral-950">
      <div className="text-sm font-medium">{agent}</div>
      <div className="text-xs text-neutral-400">{runId?"Populated.":"Populates after run begins."}</div>
    </div>
  );
}


