import { useEffect, useState } from "react";
import { isOfflineMode, loadOfflineEvents } from "../lib/offline";
import { summarize } from "../lib/format";
type Event = { ts:number; agent:string; type:string; data:any };

export default function Operate({ runId }: { runId: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    if (!runId && !isOfflineMode()) return;
    if (isOfflineMode()) {
      loadOfflineEvents().then((e) => setEvents(e));
      return;
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
      {blocks.map(([agent,type]) => (
        <Card key={agent} title={`${agent} • ${type}`}>
          <div className="text-sm text-neutral-200 mb-2">
            {summarize(agent as string, type as string, get(agent as string, type as string))}
          </div>
          <details>
            <summary className="text-xs underline text-neutral-400 cursor-pointer">View raw</summary>
            <pre className="text-xs whitespace-pre-wrap text-neutral-300 mt-2">{JSON.stringify(get(agent as string, type as string) ?? {}, null, 2)}</pre>
          </details>
        </Card>
      ))}
    </div>
  );
}

function Card({ title, children }: any) {
  return <div className="card p-4" title="Live operations block showing current plan, pacing or signals">
    <div className="font-medium mb-2 text-brand-blue">{title}</div>
    <div>{children}</div>
  </div>;
}


