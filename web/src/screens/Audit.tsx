import { useEffect, useMemo, useState } from "react";
import { summarize } from "../lib/format";
import { isOfflineMode, loadOfflineRun } from "../lib/offline";
import { auditPreferences } from "../lib/roles";

export default function Audit({ role, runId, onQueue }: { role?: string; runId: string; onQueue?: (item:{id:string; agent:string; title:string; reason?:string; impact?:string})=>void }) {
  const [data, setData] = useState<any>({});
  useEffect(() => {
    if (isOfflineMode()) { loadOfflineRun().then(setData); return; }
    if (!runId) return;
    fetch(`http://localhost:8787/api/runs/${runId}`).then(r=>r.json()).then(setData);
  }, [runId]);
  if (!runId && !isOfflineMode()) return <div className="text-neutral-400">Start a run in Plan.</div>;
  const prefs = auditPreferences(role).audit;
  return (
    <div className="card p-4" title="Final artifacts, attribution, LTV and executive summary">
      <div className="font-medium mb-2 text-brand-blue">Audit & Learn</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {prefs.showAttribution && <AttributionPanel attrib={data?.artifacts?.attribution} onQueue={onQueue} compact={prefs.compactAttribution} whatIf={prefs.attributionWhatIf} />}
        {prefs.showLTV && <LTVPanel ltv={data?.artifacts?.ltv} />}
        {prefs.showReport && <SummaryCard title="Report" value={summarize("report","summary", data?.artifacts?.report)} />} 
        {prefs.showExec && <ExecNarrativePanel initial={String(data?.artifacts?.execNarrative ?? "")} onQueue={onQueue} />}
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-2 rounded-lg bg-white text-black">Download report pack</button>
        <button className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-brand-blue">Share read-only link</button>
      </div>
      {/* Raw snapshot intentionally hidden for end users */}
    </div>
  );
}

function SummaryCard({ title, value }:{ title:string; value:string }) {
  return (
    <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950">
      <div className="text-xs text-neutral-400 mb-1">{title}</div>
      <div className="text-sm">{value || ""}</div>
    </div>
  );
}

function ExecNarrativePanel({ initial, onQueue }:{ initial:string; onQueue?: (item:any)=>void }) {
  const [text, setText] = useState<string>(initial);
  return (
    <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950">
      <div className="text-xs text-neutral-400 mb-1">Executive narrative</div>
      <textarea className="w-full bg-neutral-950 border border-neutral-800 p-2 rounded outline-none focus:border-brand-blue text-sm" rows={4} value={text} onChange={e=>setText(e.target.value)} placeholder="Add a crisp executive summary..." />
      <div className="mt-2 flex items-center gap-2">
        <button className="px-2 py-1 rounded bg-white text-black text-xs" onClick={()=> onQueue && onQueue({ id: cryptoRandomId(), agent: "exec", title: "Save executive narrative", reason: text.slice(0,120) })}>Save narrative</button>
      </div>
    </div>
  );
}

function AttributionPanel({ attrib, onQueue, compact, whatIf }:{ attrib:any; onQueue?: (item:any)=>void; compact?: boolean; whatIf?: boolean }) {
  const credit = attrib?.credit ?? [];
  const channels = credit.map((c:any)=>c.channel);
  const [from, setFrom] = useState<string>(channels?.[0] || "");
  const [to, setTo] = useState<string>(channels?.[1] || "");
  const [pct, setPct] = useState<number>(10);
  const currentIROAS =  attrib?.projected?.iROAS ?? 2.4; // fallback to example
  const projectedIROAS = useMemo(()=> (currentIROAS + (pct/100)*0.2).toFixed(2), [pct, currentIROAS]);
  return (
    <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950">
      <div className="text-xs text-neutral-400 mb-1">Attribution</div>
      <div className="space-y-2">
        {credit.map((c:any)=> (
          <AttributionBar key={c.channel} label={c.channel} low={c.low ?? Math.max(0,c.point-0.07)} point={c.point ?? 0} high={c.high ?? Math.min(1,c.point+0.07)} />
        ))}
      </div>
      {channels.length>=2 && whatIf && !compact && (
        <div className="mt-3 border-t border-neutral-800 pt-2">
          <div className="text-xs text-neutral-400 mb-1">What‑if reallocation</div>
          <div className="flex items-center gap-2 text-xs mb-1">
            <select className="bg-neutral-950 border border-neutral-800 rounded p-1" value={from} onChange={e=>setFrom(e.target.value)}>
              {channels.map((c:string)=> <option key={c}>{c}</option>)}
            </select>
            <span>→</span>
            <select className="bg-neutral-950 border border-neutral-800 rounded p-1" value={to} onChange={e=>setTo(e.target.value)}>
              {channels.filter((c:string)=>c!==from).map((c:string)=> <option key={c}>{c}</option>)}
            </select>
            <input type="range" min={1} max={25} step={1} value={pct} onChange={e=>setPct(parseInt(e.target.value))} />
            <span>{pct}%</span>
          </div>
          <div className="text-[11px] text-neutral-400 mb-2">Projected iROAS {projectedIROAS}</div>
          <button className="px-2 py-1 rounded bg-white text-black text-xs" onClick={()=> onQueue && onQueue({ id: cryptoRandomId(), agent: "attrib", title: `Propose shift ${pct}% ${from} → ${to}`, impact: `Projected iROAS ${projectedIROAS}` })}>Propose shift</button>
        </div>
      )}
    </div>
  );
}

function AttributionBar({ label, low, point, high }:{ label:string; low:number; point:number; high:number }) {
  const lowPct = Math.max(0, Math.min(100, Math.round(low*100)));
  const highPct = Math.max(lowPct, Math.min(100, Math.round(high*100)));
  const pointPct = Math.max(0, Math.min(100, Math.round(point*100)));
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="w-20 text-neutral-400 truncate">{label}</div>
      <div className="flex-1">
        <div className="h-2 bg-neutral-900 rounded relative">
          <div className="absolute top-0 left-0 h-2 bg-brand-blue/40 rounded" style={{ width: `${highPct}%`, marginLeft: `${lowPct}%` as any }} />
          <div className="absolute top-[-2px] h-3 w-[2px] bg-white" style={{ left: `${pointPct}%` as any }} />
        </div>
        <div className="flex items-center justify-between text-[10px] text-neutral-500">
          <span>{lowPct}%</span>
          <span>{pointPct}%</span>
          <span>{highPct}%</span>
        </div>
      </div>
    </div>
  );
}

function LTVPanel({ ltv }:{ ltv:any[] }) {
  const items = Array.isArray(ltv)? ltv : [];
  return (
    <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950">
      <div className="text-xs text-neutral-400 mb-1">LTV by cohort</div>
      <div className="space-y-1">
        {items.slice(0,4).map((c:any)=> (
          <div key={c.cohort} className="flex items-center gap-2 text-xs">
            <div className="w-28 text-neutral-400 truncate">{c.cohort}</div>
            <div className="flex-1 h-2 bg-neutral-900 rounded">
              <div className="h-2 bg-brand-blue rounded" style={{ width: `${Math.min(100, (c.ltv/300)*100)}%` }} />
            </div>
            <div className="w-16 text-right">${c.ltv}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function cryptoRandomId(): string {
  try { return Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b=>b.toString(16).padStart(2,"0")).join(""); } catch { return Math.random().toString(36).slice(2); }
}


