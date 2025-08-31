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
    <div className="fixed inset-0 bg-black/40 flex justify-end">
      <div className="w-full sm:w-[420px] h-full bg-neutral-950 border-l border-neutral-800 p-4 overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium text-brand-blue">Action Queue</div>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
        {items.length===0 ? (
          <div className="text-sm text-neutral-400">No pending actions.</div>
        ) : (
          <ul className="space-y-2">
            {items.map(i=> (
              <li key={i.id} className="border border-neutral-800 rounded p-3 bg-neutral-950">
                <div className="text-sm font-medium flex items-center justify-between">
                  <span>{i.title}</span>
                  <span className="text-[10px] text-neutral-500">{i.agent}</span>
                </div>
                {i.reason && <div className="text-xs text-neutral-400 mt-1">{i.reason}</div>}
                {i.impact && <div className="text-[11px] text-neutral-500 mt-0.5">Impact: {i.impact}</div>}
                <div className="flex items-center gap-2 mt-2">
                  <button className="px-2 py-1 rounded bg-white text-black" onClick={()=>onApprove(i.id)}>Approve</button>
                  <button className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-brand-blue" onClick={()=>onReject(i.id)}>Reject</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


