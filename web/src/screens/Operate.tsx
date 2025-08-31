import { useEffect, useMemo, useState } from "react";
import { isOfflineMode, loadOfflineEvents } from "../lib/offline";
import { summarize, timeAgo } from "../lib/format";
import { Sparkline, Bar, Donut, StackedBars } from "../lib/charts";
type Event = { ts:number; agent:string; type:string; data:any };

export default function Operate({ runId, onQueue, onEvent }:{ runId: string; onQueue: (item:{id:string; agent:string; title:string; reason?:string; impact?:string})=>void; onEvent: (msg:string)=>void; }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [speed, setSpeed] = useState<number>(1);
  const offline = isOfflineMode();

  useEffect(() => {
    if (!runId && !offline) return;
    if (offline) {
      let cancelled = false;
      (async () => {
        const e = await loadOfflineEvents();
        setEvents([]);
        for (let i = 0; i < e.length; i++) {
          if (cancelled) break;
          setEvents((prev) => [...prev, e[i]]);
          onEvent(`${e[i].agent} • ${e[i].type}`);
          await new Promise((r) => setTimeout(r, Math.max(100, 700 / Math.max(0.25, speed))));
        }
      })();
      return () => { cancelled = true; };
    }
    const es = new EventSource(`http://localhost:8787/api/stream/${runId}`);
    es.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      setEvents((prev) => [...prev, msg]);
      onEvent(`${msg.agent} • ${msg.type}`);
    };
    return () => es.close();
  }, [runId, offline, speed]);

  const get = (agent:string, type?:string) => {
    const filtered = events.filter(e => e.agent===agent && (!type || e.type===type));
    return filtered.length ? filtered[filtered.length-1].data : null;
  };

  const ctrSpark = useMemo(()=>{
    const ctrs:number[] = [];
    events.filter(e=>e.agent==="anomaly" && e.data?.metrics).forEach(e=>{
      const m = e.data.metrics?.[0]?.ctr; if (typeof m === "number") ctrs.push(m*100);
    });
    return ctrs.slice(-20);
  }, [events]);

  return (
    <div className="space-y-4">
      {offline && (
        <div className="card p-3 flex items-center gap-3" title="Offline replay controls">
          <div className="text-xs text-neutral-400">Replay speed</div>
          <input type="range" min={0.25} max={3} step={0.25} value={speed} onChange={e=>setSpeed(parseFloat(e.target.value))} />
          <div className="text-xs">{speed}x</div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="⏱ Experiment planner">
          <div className="text-sm mb-2">{summarize("experiment","design", get("experiment","design"))}</div>
          <button className="px-3 py-2 rounded bg-white text-black">Start experiment</button>
        </Card>
        <Card title="⏱ Budget pacer">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-neutral-400 mb-1">Per-channel allocation</div>
              <Bar data={[{label:"Meta", value: 100},{label:"Search", value: 70},{label:"TikTok", value: 30}]} />
              <div className="text-xs text-neutral-400 mt-2">KPIs</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <KPI label="CPA" value="$36" />
                <KPI label="ROAS" value="2.3" />
                <KPI label="Spend" value="$200" />
              </div>
            </div>
            <div className="space-y-2">
              {["Meta","Search","TikTok"].map(ch=> (
                <div key={ch} className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">{ch}</span>
                    <span className="text-neutral-500">{ch==="Meta"?100:ch==="Search"?70:30}</span>
                  </div>
                  <input type="range" min={0} max={200} defaultValue={ch==="Meta"?100:ch==="Search"?70:30} />
                </div>
              ))}
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 rounded bg-white text-black" onClick={()=>onQueue({ id: cryptoRandomId(), agent: "pacing", title: "Apply reallocation", impact: "+3% ROAS" })}>Apply reallocation</button>
                <button className="px-3 py-2 rounded bg-neutral-900 border border-neutral-800 hover:border-brand-blue">Re-route</button>
              </div>
            </div>
          </div>
        </Card>
        <Card title="⏱ Supply-path optimizer">
          <StackedBars groups={[{label:"Exchange paths", parts:[{label:"A>DSP1", value: 62},{label:"B>DSP2", value: 38}]}]} />
          <div className="flex items-center gap-2 mt-2">
            <button className="px-3 py-2 rounded bg-white text-black" onClick={()=>onQueue({ id: cryptoRandomId(), agent: "spo", title: "Prune B>DSP2", impact: "-1.2% IVT" })}>Prune path</button>
          </div>
        </Card>
        <Card title="⏱ Roadmap">
          <div className="grid grid-cols-4 gap-2 text-xs">
            {(["Backlog","Next","Running","Done"]).map(col=> (
              <div key={col} className="border border-neutral-800 rounded p-2">
                <div className="text-[11px] text-neutral-400 mb-1">{col}</div>
                <div className="bg-neutral-900 rounded p-1 mb-1">Frame test</div>
                {col==="Backlog" && <div className="bg-neutral-900 rounded p-1">Copy tone pass</div>}
              </div>
            ))}
          </div>
        </Card>
        <Card title="⚠ Anomaly watchdog">
          <div className="flex items-center justify-between">
            <Sparkline points={ctrSpark} />
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-brand-blue" onClick={()=>onQueue({ id: cryptoRandomId(), agent:"anomaly", title:"Pause variant 2", reason:"CTR < 1.5%" })}>Pause</button>
              <button className="px-2 py-1 rounded bg-white text-black" onClick={()=>onQueue({ id: cryptoRandomId(), agent:"anomaly", title:"Boost variant 1", reason:"High CTR" })}>Boost</button>
            </div>
          </div>
        </Card>
        <Card title="⚠ Root-cause sleuth">
          <Bar data={[{label:"Creative fatigue", value:34},{label:"Audience shift", value:22},{label:"Bid pressure", value:18}]} />
          <button className="mt-2 px-3 py-2 rounded bg-white text-black" onClick={()=>onQueue({ id: cryptoRandomId(), agent: "rootcause", title: "Apply proposed fixes", impact: "+5% CTR" })}>Propose fixes</button>
        </Card>
        <Card title="⚠ Negative-signal miner">
          <div className="text-xs space-y-1">
            {["free download","kids","DIY hack"].map(term=> (
              <div key={term} className="flex items-center justify-between border border-neutral-800 rounded p-1">
                <span>{term}</span>
                <button className="px-2 py-1 rounded bg-white text-black" onClick={()=>onQueue({ id: cryptoRandomId(), agent: "negatives", title: `Exclude term: ${term}`, impact: "Reduce wasted spend" })}>Approve</button>
              </div>
            ))}
          </div>
        </Card>
        <Card title="⚠ Fraud sentinel">
          <div className="flex items-center gap-3">
            <Donut value={1.2} total={100} />
            <div className="text-xs text-neutral-400">IVT rate ~1.2%</div>
          </div>
          <button className="mt-2 px-3 py-2 rounded bg-white text-black" onClick={()=>onQueue({ id: cryptoRandomId(), agent: "fraud", title: "Exclude suspect segment", impact: "-1% IVT" })}>Exclude segment</button>
        </Card>
        <Card title="⏱ Budget officer">
          <div className="grid grid-cols-3 gap-2 text-xs">
            {["Meta","Search","TikTok"].map(ch=> (
              <div key={ch}>
                <div className="text-[11px] text-neutral-400 mb-0.5">{ch}</div>
                <input className="w-full bg-neutral-950 border border-neutral-800 p-1 rounded outline-none focus:border-brand-blue" defaultValue={ch==="Meta"?100:ch==="Search"?70:30} />
              </div>
            ))}
          </div>
          <button className="mt-2 px-3 py-2 rounded bg-white text-black" onClick={()=>onQueue({ id: cryptoRandomId(), agent: "budget", title: "Save caps", impact: "Hold daily max" })}>Save caps</button>
        </Card>
        <Card title="✔ Change auditor" className="md:col-span-2">
          <ul className="text-xs text-neutral-300 space-y-1 max-h-48 overflow-auto">
            {events.filter(e=>e.agent==="audit").slice(-10).reverse().map((e,i)=> (
              <li key={i} className="flex items-center justify-between gap-2">
                <span className="truncate">{e.data?.[0]?.change || summarize("audit","changes", e.data)}</span>
                <span className="text-[10px] text-neutral-500 whitespace-nowrap">{timeAgo(e.ts)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children, className }: any) {
  return <div className={`card p-4 hover-card fade-in ${className||""}`} title="Live operations block">
    <div className="font-medium mb-2 text-brand-blue">{title}</div>
    <div>{children}</div>
  </div>;
}

function cryptoRandomId(): string {
  try {
    // Browser crypto
    return Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b=>b.toString(16).padStart(2,"0")).join("");
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

function KPI({ label, value }:{ label:string; value:string }) {
  return (
    <div className="border border-neutral-800 rounded p-2 bg-neutral-950 text-center fade-in">
      <div className="text-[10px] text-neutral-400">{label}</div>
      <div className="text-xs">{value}</div>
    </div>
  );
}


