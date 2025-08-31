import { formatCurrency } from "../lib/format";
import ProjectSwitcher from "./ProjectSwitcher";
import type { Project } from "../lib/projects";

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
  onProjectSelect
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
}) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
      <div className="flex items-center gap-3">
        <img src="/logo-af.gif" alt="AdOps Flightdeck" className="h-12 w-auto" />
        {/* Branding text removed to avoid redundancy with logo */}
        {isOffline && <span className="text-xs text-brand-blue/80 border border-brand-blue/40 rounded px-2 py-0.5">offline</span>}
        <button className="px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-brand-blue text-xs" onClick={onToggleOffline}>{isOffline?"Go live":"Go offline"}</button>
        <ProjectSwitcher onSelect={(p)=>onProjectSelect?.(p)} />
        <button className="px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-brand-blue text-xs" onClick={onOpenContext}>Context</button>
        <div className="ml-2 text-xs">
          <div className="text-neutral-400 mb-0.5">User Role</div>
          <select className="bg-neutral-950 border border-neutral-800 rounded p-1" value={role} onChange={e=>onRoleChange(e.target.value)}>
            <option>Ad Rep</option>
            <option>Executive</option>
            <option>Creative</option>
            <option>Compliance</option>
            <option>Media Buyer</option>
          </select>
        </div>
        {product && (
          <div className="ml-3 text-xs border border-neutral-800 rounded px-2 py-1 bg-neutral-900" title="Current context">
            <span className="text-neutral-400">Context:</span> <span className="text-white">{product}</span> {typeof budget==="number" && <span className="text-neutral-400 ml-1">• {new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(budget)}</span>}
          </div>
        )}
        <button className="px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-brand-blue text-xs" onClick={onOpenToday}>Today</button>
      </div>
      <div className="flex items-center gap-3">
        {(role === "Ad Rep" ? [
          { label: "ROAS", value: perf?.roas ? String(perf.roas) : "-" },
          { label: "CPA", value: perf?.cpa ? formatCurrency(perf.cpa) : "-" },
          { label: "Spend", value: formatCurrency(perf?.spend) },
          { label: "Conv", value: String(perf?.conversions ?? "-") },
        ] : [
          { label: "Spend", value: formatCurrency(perf?.spend) },
          { label: "Conv", value: String(perf?.conversions ?? "-") },
          { label: "ROAS", value: perf?.roas ? String(perf.roas) : "-" },
          { label: "CPA", value: perf?.cpa ? formatCurrency(perf.cpa) : "-" },
        ]).map(t => (
          <PerfTile key={t.label} label={t.label} value={String(t.value)} />
        ))}
        <div className="text-xs text-neutral-400 max-w-[260px] truncate" title={lastEvent || ""}>{lastEvent || "Waiting for activity..."}</div>
        <button className="px-3 py-2 rounded-lg bg-brand-purple/20 text-brand-blue hover:bg-brand-purple/30 transition" onClick={onOpenQueue}>Action Queue</button>
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


