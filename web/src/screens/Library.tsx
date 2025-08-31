export default function Library({ onClose, runId }:{ onClose:()=>void; runId:string}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="card max-w-4xl w-full p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium text-brand-blue">Assets & Offers</div>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950">
            <div className="text-sm font-medium mb-1">Asset Librarian</div>
            <div className="text-xs text-neutral-400">Search and tag assets; brand palette checks.</div>
          </div>
          <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950">
            <div className="text-sm font-medium mb-1">Offer Catalog</div>
            <div className="text-xs text-neutral-400">Predicted iROAS, margins, one-click push to Plan.</div>
          </div>
        </div>
      </div>
    </div>
  );
}


