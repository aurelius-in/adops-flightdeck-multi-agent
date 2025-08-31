import { useEffect, useState } from "react";
import { isOfflineMode, loadOfflineEvents } from "../lib/offline";
import { summarize, timeAgo } from "../lib/format";
type Event = { ts:number; agent:string; type:string; data:any };

export default function Operate({ runId }: { runId: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    if (!runId && !isOfflineMode()) return;
    if (isOfflineMode()) {
      let cancelled = false;
      (async () => {
        const e = await loadOfflineEvents();
        setEvents([]);
        for (let i = 0; i < e.length; i++) {
          if (cancelled) break;
          setEvents((prev) => [...prev, e[i]]);
          await new Promise((r) => setTimeout(r, 700));
        }
      })();
      return () => { cancelled = true; };
    }
    const es = new EventSource(`http://localhost:8787/api/stream/${runId}`);
    es.onmessage = (ev) => setEvents((prev) => [...prev, JSON.parse(ev.data)]);
    return () => es.close();
  }, [runId]);

  const get = (agent:string, type?:string) => {
    const filtered = events.filter(e => e.agent===agent && (!type || e.type===type));
    return filtered.length ? filtered[filtered.length-1].data : null;
  };

  const blocks = [
    ["experiment","design"],["pacing","plan"],["spo","routes"],["roadmap","queue"],
    ["anomaly","tick"],["rootcause","analysis"],["negatives","list"],["fraud","ivtrate"],["budget","caps"],["audit","changes"]
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {blocks.map(([agent,type]) => {
        const last = events.filter(e => e.agent===agent && (!type || e.type===type)).slice(-1)[0];
        return (
          <Card key={agent} title={`${agent} • ${type}`}>
            <div className="text-sm text-neutral-200 flex items-center justify-between">
              <span>{summarize(agent as string, type as string, get(agent as string, type as string))}</span>
              {last && <span className="text-[10px] text-neutral-400">{timeAgo(last.ts)}</span>}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function Card({ title, children }: any) {
  return <div className="card p-4" title="Live operations block showing current plan, pacing or signals">
    <div className="font-medium mb-2 text-brand-blue">{title}</div>
    <div>{children}</div>
  </div>;
}


