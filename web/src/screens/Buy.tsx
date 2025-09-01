import { Bar, StackedBars } from "../lib/charts";

export default function Buy({ onQueue }:{ onQueue: (item:{id:string; agent:string; title:string; impact?:string})=>void }){
  return (
    <div className="space-y-4">
      <div className="card p-4" title="Media buying cockpit">
        <div className="font-medium mb-2 text-brand-blue">Channel allocation</div>
        <Bar data={[{label:"Meta", value: 100},{label:"Search", value: 70},{label:"TikTok", value: 30}]} />
        <div className="flex items-center gap-2 mt-3">
          <button className="px-3 py-2 rounded bg-white text-black" onClick={()=>onQueue({ id: rid(), agent:"pacing", title:"Apply reallocation", impact:"+2.5% ROAS" })}>Apply reallocation</button>
        </div>
      </div>
      <div className="card p-4" title="Supply path optimization">
        <div className="font-medium mb-2 text-brand-blue">SPO pruning</div>
        <StackedBars groups={[{label:"Paths", parts:[{label:"A>DSP1", value:62},{label:"B>DSP2", value:38}]}]} />
        <div className="flex items-center gap-2 mt-3">
          <button className="px-3 py-2 rounded bg-white text-black" onClick={()=>onQueue({ id: rid(), agent:"spo", title:"Prune B>DSP2", impact:"-1.1% IVT" })}>Prune path</button>
        </div>
      </div>
      <div className="card p-4" title="Buying approvals">
        <div className="font-medium mb-2 text-brand-blue">Approvals</div>
        <div className="text-sm text-neutral-300">Queue proposed changes for exec approval.</div>
        <div className="flex items-center gap-2 mt-3">
          <button className="px-3 py-2 rounded bg-neutral-900 border border-neutral-800 hover:border-brand-blue" onClick={()=>onQueue({ id: rid(), agent:"buy", title:"Request budget uplift +10%", impact:"More learning headroom" })}>Request budget uplift</button>
        </div>
      </div>
    </div>
  );
}

function rid(){ try { return Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b=>b.toString(16).padStart(2,"0")).join(""); } catch { return Math.random().toString(36).slice(2);} }


