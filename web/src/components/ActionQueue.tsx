type QueueItem = {
  id: string;
  agent: string;
  title: string;
  reason?: string;
  impact?: string;
};

export default function ActionQueue({ items, onApprove, onReject, onClose }:{
  items: QueueItem[];
  onApprove: (id:string)=>void;
  onReject: (id:string)=>void;
  onClose: ()=>void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end" onKeyDown={(e)=>{ if (e.key==='Escape') onClose(); }}>
      <div className="w-full sm:w-[420px] h-full bg-neutral-950 border-l border-neutral-800 p-4 overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium text-brand-blue">Action Queue</div>
          <button className="btn" onClick={onClose} aria-label="Close Action Queue">Close</button>
        </div>
        {items.length===0 ? (
          <div className="text-sm text-neutral-400">No pending actions.</div>
        ) : (
          <ul className="space-y-2 divide-y divide-neutral-800">
            {items.map(i=> (
              <li key={i.id} className="border border-neutral-800 rounded p-3 bg-neutral-950">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium">{i.title}</div>
                    {i.reason && <div className="text-xs text-neutral-400 mt-0.5">{i.reason}</div>}
                    {i.impact && <div className="text-[11px] text-neutral-500 mt-0.5">Impact: {i.impact}</div>}
                  </div>
                  <span className="text-[10px] text-neutral-500 whitespace-nowrap mt-0.5">{i.agent}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button className="btn-soft text-xs" onClick={()=>onApprove(i.id)} aria-label="Approve item">Approve</button>
                  <button className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-brand-blue text-xs" onClick={()=>onReject(i.id)} aria-label="Reject item">Reject</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


