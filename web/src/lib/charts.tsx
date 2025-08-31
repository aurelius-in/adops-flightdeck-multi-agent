export function Sparkline({ points }:{ points:number[] }) {
  if (!Array.isArray(points) || points.length===0) return <div className="h-8 bg-neutral-900 rounded"/>;
  const max = Math.max(...points);
  const path = points.map((p, i) => `${i===0?"M":"L"} ${i*8} ${20 - (max? (p/max)*20 : 0)}`).join(" ");
  const w = Math.max(points.length*8, 40);
  return (
    <svg width={w} height={20} className="block">
      <path d={path} stroke="#60a5fa" fill="none" strokeWidth={1.5} />
    </svg>
  );
}

export function Bar({ data }:{ data:{label:string; value:number}[] }) {
  const max = Math.max(1, ...data.map(d=>d.value));
  return (
    <div className="space-y-1">
      {data.map(d=> (
        <div key={d.label} className="flex items-center gap-2">
          <div className="w-24 text-[11px] text-neutral-400 truncate">{d.label}</div>
          <div className="flex-1 h-2 bg-neutral-900 rounded">
            <div className="h-2 bg-brand-blue rounded" style={{ width: `${(d.value/max)*100}%` }} />
          </div>
          <div className="w-10 text-right text-[11px]">{Math.round(d.value)}</div>
        </div>
      ))}
    </div>
  );
}

export function Donut({ value, total }:{ value:number; total:number }) {
  const pct = total? Math.min(100, Math.round((value/total)*100)) : 0;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="40" height="40" viewBox="0 0 36 36">
        <path className="text-neutral-800" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
        <path className="text-brand-blue" strokeWidth="4" strokeDasharray={`${pct}, 100`} stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
      </svg>
      <span className="absolute text-[10px]">{pct}%</span>
    </div>
  );
}

export function StackedBars({ groups }:{ groups:{label:string; parts:{label:string; value:number}[]}[] }) {
  return (
    <div className="space-y-2">
      {groups.map(g=>{
        const total = g.parts.reduce((s,p)=>s+p.value,0);
        return (
          <div key={g.label}>
            <div className="text-[11px] text-neutral-400 mb-0.5">{g.label}</div>
            <div className="h-3 bg-neutral-900 rounded flex overflow-hidden">
              {g.parts.map(p=> (
                <div key={p.label} className="h-3" style={{ width: `${total? (p.value/total)*100 : 0}%`, backgroundColor: "#60a5fa" }} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}


