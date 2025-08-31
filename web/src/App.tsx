import { useMemo, useState } from "react";
import Plan from "./screens/Plan";
import Operate from "./screens/Operate";
import Audit from "./screens/Audit";
import Library from "./screens/Library";
import Investigate from "./screens/Investigate";
import { isOfflineMode } from "./lib/offline";
import RunHeader from "./components/RunHeader";
import ActionQueue from "./components/ActionQueue";
import TodayDrawer from "./components/TodayDrawer";
import RoleToolbar from "./components/RoleToolbar";

type Tab = "Plan"|"Operate"|"Audit";

export default function App() {
  const [runId, setRunId] = useState<string>("");
  const [tab, setTab] = useState<Tab>("Plan");
  const [showLib, setShowLib] = useState(false);
  const [showInvestigate, setShowInvestigate] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showToday, setShowToday] = useState(false);
  const [lastEvent, setLastEvent] = useState<string>("");
  const [queue, setQueue] = useState<{id:string; agent:string; title:string; reason?:string; impact?:string}[]>([]);
  const offline = isOfflineMode();
  const perf = useMemo(()=>({ spend: 0, conversions: 0, roas: undefined as any, cpa: undefined as any }), []);
  const [role, setRole] = useState<string>("Ad Rep");

  return (
    <div className={`min-h-screen bg-neutral-950 text-white role-${role.replace(/\s+/g,'').toLowerCase()}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
        <RunHeader product="SmartWater Bottle" budget={200} isOffline={offline} runId={runId} lastEvent={lastEvent} perf={perf} onToggleOffline={()=>{ window.location.search = offline?"":"?offline=1"; }} onOpenQueue={()=>setShowQueue(true)} role={role} onRoleChange={setRole} onOpenToday={()=>setShowToday(true)} />
        <div className="flex items-center gap-2">
          <button title="Browse asset library and offer ideas; push selections into Plan" className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-brand-blue transition" onClick={()=>setShowLib(true)}>Assets & Offers</button>
          <button title="Open root-cause explorer to understand performance dips and remedies" className="px-3 py-2 rounded-lg bg-brand-purple/20 text-brand-blue hover:bg-brand-purple/30 transition" onClick={()=>setShowInvestigate(true)}>Explain a Dip</button>
        </div>
        <RoleToolbar role={role} onQueue={(item)=>{ setQueue(q=>[...q, item]); setLastEvent(`${item.agent} • queued action`); }} />
        <nav className="flex gap-2">
          {(["Plan","Operate","Audit"] as Tab[]).map(t=>(
            <button title={t==="Plan"?"Define product, audience, budget and generate creatives":t==="Operate"?"Watch pacing, delivery and anomaly handling":"Review attribution, LTV and signed artifacts"} key={t} onClick={()=>setTab(t)} className={`px-3 py-2 rounded-lg border ${tab===t?"bg-white text-black border-white":"bg-neutral-900 border-neutral-800"}`}>{t}</button>
          ))}
        </nav>
        {tab==="Plan" && <Plan role={role} onRun={(id)=>{ setRunId(id); setLastEvent("Run started"); }} runId={runId} onQueue={(item)=>{ setQueue(q=>[...q, item]); setLastEvent(`${item.agent} • queued action`); }} />} 
        {tab==="Operate" && <Operate role={role} runId={runId} onQueue={(item)=>setQueue(q=>[...q, item])} onEvent={(msg)=>setLastEvent(msg)} />} 
        {tab==="Audit" && <Audit role={role} runId={runId} onQueue={(item)=>{ setQueue(q=>[...q, item]); setLastEvent(`${item.agent} • proposed action`); }} />} 

        {showLib && <Library onClose={()=>setShowLib(false)} runId={runId} onQueue={(item)=>{ setQueue(q=>[...q, item]); setLastEvent(`${item.agent} • added`); }} />} 
        {showInvestigate && <Investigate onClose={()=>setShowInvestigate(false)} runId={runId} onPropose={(item)=>{ setQueue(q=>[...q, item]); setLastEvent(`${item.agent} • proposed action`); }} />} 
        {showQueue && <ActionQueue items={queue} onApprove={(id)=>setQueue(q=>q.filter(x=>x.id!==id))} onReject={(id)=>setQueue(q=>q.filter(x=>x.id!==id))} onClose={()=>setShowQueue(false)} />} 
        {showToday && <TodayDrawer role={role} onClose={()=>setShowToday(false)} onAction={(t)=>setLastEvent(`Today • ${t}`)} />}
      </div>
    </div>
  );
}


