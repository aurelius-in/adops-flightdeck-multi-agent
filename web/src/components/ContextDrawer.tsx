import { useState } from "react";

export default function ContextDrawer({ initialProduct, initialAudience, onClose, onSave }:{ initialProduct?:string; initialAudience?:string; onClose:()=>void; onSave:(ctx:{product:string; audience:string; budget:number})=>void }) {
  const [product, setProduct] = useState(initialProduct || "");
  const [audience, setAudience] = useState(initialAudience || "");
  const [budget, setBudget] = useState<number>(200);
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end">
      <div className="w-full sm:w-[420px] h-full bg-neutral-950 border-l border-neutral-800 p-4 overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium text-brand-blue">Run Context</div>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
        <div className="text-xs text-neutral-400 mb-2">Explain what we are working on. This will appear in the header and seed planning.</div>
        <div className="space-y-2">
          <div>
            <div className="text-xs text-neutral-400">Product</div>
            <input className="w-full bg-neutral-950 border border-neutral-800 p-2 rounded outline-none focus:border-brand-blue" value={product} onChange={e=>setProduct(e.target.value)} />
          </div>
          <div>
            <div className="text-xs text-neutral-400">Audience</div>
            <textarea className="w-full bg-neutral-950 border border-neutral-800 p-2 rounded outline-none focus:border-brand-blue" value={audience} onChange={e=>setAudience(e.target.value)} />
          </div>
          <div>
            <div className="text-xs text-neutral-400">Daily budget</div>
            <input type="number" className="w-full bg-neutral-950 border border-neutral-800 p-2 rounded outline-none focus:border-brand-blue" value={budget} onChange={e=>setBudget(parseInt(e.target.value||"0"))} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button className="px-3 py-2 rounded bg-white text-black" onClick={()=>onSave({ product, audience, budget})}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}


