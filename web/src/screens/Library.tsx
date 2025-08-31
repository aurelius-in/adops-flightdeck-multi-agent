export default function Library({ onClose, runId }:{ onClose:()=>void; runId:string}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="card max-w-5xl w-full p-4" title="Assets and offers you can push into Plan">
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium text-brand-blue">Assets & Offers</div>
          <button className="btn" title="Close this panel" onClick={onClose}>Close</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950" title="Search, filter and tag assets">
            <div className="text-sm font-medium mb-2">Asset Librarian</div>
            <div className="flex items-center gap-2 mb-2">
              <input placeholder="Search assets..." className="w-full bg-neutral-950 border border-neutral-800 p-2 rounded outline-none focus:border-brand-blue" />
              <button className="px-2 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-brand-blue">Search</button>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] mb-2">
              {['blue','outdoor','bottle','gym','closeup','sweat'].map(t=> <span key={t} className="px-2 py-0.5 border border-neutral-800 rounded bg-neutral-900">{t}</span>)}
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              {['img01','img02','img03','img04','img05','img06'].map(id=> (
                <div key={id} className="border border-neutral-800 rounded p-2 bg-neutral-950 flex items-center justify-between">
                  <span>{id}</span>
                  <button className="px-2 py-1 rounded bg-white text-black">Push to Plan</button>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950" title="Review offers with predicted iROAS and push to Plan">
            <div className="text-sm font-medium mb-2">Offer Catalog</div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {[
                {label:'Bundle x2', iroas:2.1, margin:0.35},
                {label:'25% Off 1st', iroas:1.8, margin:0.25},
                {label:'BOGO Half', iroas:1.9, margin:0.3}
              ].map(o=> (
                <div key={o.label} className="border border-neutral-800 rounded p-2 bg-neutral-950 flex items-center justify-between">
                  <div>
                    <div>{o.label}</div>
                    <div className="text-[11px] text-neutral-500">iROAS {o.iroas} • margin floor {Math.round(o.margin*100)}%</div>
                  </div>
                  <button className="px-2 py-1 rounded bg-white text-black">Push to Plan</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


