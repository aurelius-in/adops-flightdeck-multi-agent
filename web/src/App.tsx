import { useState } from "react";
import Plan from "./screens/Plan";
import Operate from "./screens/Operate";
import Audit from "./screens/Audit";
import Library from "./screens/Library";
import Investigate from "./screens/Investigate";
import { isOfflineMode } from "./lib/offline";

type Tab = "Plan"|"Operate"|"Audit";

export default function App() {
  const [runId, setRunId] = useState<string>("");
  const [tab, setTab] = useState<Tab>("Plan");
  const [showLib, setShowLib] = useState(false);
  const [showInvestigate, setShowInvestigate] = useState(false);
  const offline = isOfflineMode();

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
        <header className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <img src="/logo-af.gif" alt="AdOps Flightdeck" className="h-16 w-auto" />
            {offline && <span className="text-xs text-brand-blue/80 border border-brand-blue/40 rounded px-2 py-0.5">offline</span>}
          </div>
          <div className="flex items-center gap-2">
            <button title="Browse asset library and offer ideas; push selections into Plan" className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-brand-blue transition" onClick={()=>setShowLib(true)}>Assets & Offers</button>
            <button title="Open root-cause explorer to understand performance dips and remedies" className="px-3 py-2 rounded-lg bg-brand-purple/20 text-brand-blue hover:bg-brand-purple/30 transition" onClick={()=>setShowInvestigate(true)}>Explain a Dip</button>
          </div>
        </header>
        <nav className="flex gap-2">
          {(["Plan","Operate","Audit"] as Tab[]).map(t=>(
            <button title={t==="Plan"?"Define product, audience, budget and generate creatives":t==="Operate"?"Watch pacing, delivery and anomaly handling":"Review attribution, LTV and signed artifacts"} key={t} onClick={()=>setTab(t)} className={`px-3 py-2 rounded-lg border ${tab===t?"bg-white text-black border-white":"bg-neutral-900 border-neutral-800"}`}>{t}</button>
          ))}
        </nav>
        {tab==="Plan" && <Plan onRun={setRunId} runId={runId}/>} 
        {tab==="Operate" && <Operate runId={runId}/>} 
        {tab==="Audit" && <Audit runId={runId}/>} 

        {showLib && <Library onClose={()=>setShowLib(false)} runId={runId}/>} 
        {showInvestigate && <Investigate onClose={()=>setShowInvestigate(false)} runId={runId}/>} 
      </div>
    </div>
  );
}


