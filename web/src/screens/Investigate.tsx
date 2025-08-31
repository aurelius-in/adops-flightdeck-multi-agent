import { Bar } from "../lib/charts";

export default function Investigate({ onClose, runId, onPropose }:{ onClose:()=>void; runId:string; onPropose:(item:{id:string; agent:string; title:string; reason?:string; impact?:string})=>void }) {
  const bars = [{label:"Creative fatigue", value:34},{label:"Audience shift", value:22},{label:"Bid pressure", value:18}];
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="card max-w-3xl w-full p-4" title="Root-cause explorer for dips and spikes">
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium text-brand-blue">Explain a Dip</div>
          <button className="btn" title="Close this panel" onClick={onClose}>Close</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm mb-1">Factor importance</div>
            <Bar data={bars} />
          </div>
          <div>
            <div className="text-sm mb-1">Top hypotheses</div>
            <ul className="text-xs text-neutral-300 space-y-1">
              {bars.slice(0,3).map(b=> <li key={b.label}>{b.label} — likely</li>)}
            </ul>
            <div className="flex items-center gap-2 mt-2">
              <button className="px-3 py-2 rounded bg-white text-black" onClick={()=>onPropose({ id: cryptoRandomId(), agent: "rootcause", title: "Apply proposed fixes", impact: "+5% CTR" })}>Propose actions</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cryptoRandomId(): string {
  try {
    return Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b=>b.toString(16).padStart(2,"0")).join("");
  } catch {
    return Math.random().toString(36).slice(2);
  }
}


