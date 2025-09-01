import { formatCurrency } from "../lib/format";
import ProjectSwitcher from "./ProjectSwitcher";
import type { Project } from "../lib/projects";
import { allowedTabs } from "../lib/roles";

type Tab = "Plan"|"Operate"|"Audit"|"Buy"|"Studio"|"Govern"|"Dashboard";

export type PerformanceSummary = {
  spend?: number;
  conversions?: number;
  roas?: number;
  cpa?: number;
};

export default function RunHeader({
  product,
  budget,
  isOffline,
  runId,
  lastEvent,
  perf,
  onToggleOffline,
  onOpenQueue,
  role,
  onRoleChange,
  onOpenToday,
  onOpenContext,
  onProjectSelect,
  tab,
  onTabChange
}:{
  product?: string;
  budget?: number;
  isOffline: boolean;
  runId?: string;
  lastEvent?: string;
  perf?: PerformanceSummary;
  onToggleOffline: () => void;
  onOpenQueue: () => void;
  role: string;
  onRoleChange: (r:string)=>void;
  onOpenToday: ()=>void;
  onOpenContext: ()=>void;
  onProjectSelect?: (p: Project)=>void;
  tab: Tab;
  onTabChange: (t: Tab)=>void;
}) {
  const threeTabs = (allowedTabs(role) as Tab[]).filter(t=> ["Plan","Operate","Audit"].includes(t));
  return (
    <div className="sticky top-0 z-20 bg-neutral-950/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 flex items-center justify-between border-b border-neutral-800 pb-3">
      <div className="flex items-center gap-3">
        <img src="/logo-af.gif" alt="AdOps Flightdeck" className="h-12 w-auto" />
        <div className="w-56" />
        <div className="text-xs">
          <div className="text-neutral-400 mb-0.5">My Role</div>
          <select aria-label="Select my role" className="bg-neutral-950 border border-neutral-800 rounded p-1" value={role} onChange={e=>onRoleChange(e.target.value)}>
            <option>Ad Rep</option>
            <option>Executive</option>
            <option>Creative</option>
            <option>Compliance</option>
            <option>Media Buyer</option>
          </select>
        </div>
        <nav className="flex gap-2 ml-2 flex-wrap">
          {threeTabs.map(tn=> (
            <button key={tn} title={tn==="Plan"?"Define product, audience, budget and generate creatives":tn==="Operate"?"Watch pacing, delivery and anomaly handling":"Review attribution, LTV and signed artifacts"} onClick={()=>onTabChange(tn)} className={`px-3 py-2 rounded-lg border text-xs ${tab===tn?"bg-white text-black border-white":"bg-neutral-900 border-neutral-800"}`}>{tn}</button>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <button aria-label="Open Action Queue" className="px-2.5 py-1.5 rounded-lg bg-brand-purple/20 text-brand-blue hover:bg-brand-purple/30 transition text-xs" onClick={onOpenQueue}>📥 <span className="hidden sm:inline">Action Queue</span></button>
        {isOffline && <span className="text-xs text-brand-blue/80 border border-brand-blue/40 rounded px-2 py-0.5">offline</span>}
        <button aria-label={isOffline?"Go live":"Go offline"} className="px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-brand-blue text-xs" onClick={onToggleOffline}>{isOffline?"Go live":"Go offline"}</button>
      </div>
    </div>
  );
}

function PerfTile({ label, value }:{ label:string; value:string }) {
  return (
    <div className="border border-neutral-800 rounded-lg px-2 py-1 bg-neutral-950 text-center">
      <div className="text-[10px] text-neutral-400">{label}</div>
      <div className="text-xs">{value}</div>
    </div>
  );
}


