export default function Govern(){
  return (
    <div className="space-y-4">
      <div className="card p-4" title="Policy">
        <div className="font-medium mb-2 text-brand-blue">Policies</div>
        <div className="text-sm text-neutral-300">Claims, tone, and region overrides.</div>
        <div className="flex items-center gap-2 mt-2">
          <button className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-brand-blue text-xs">View policy set</button>
          <button className="btn-soft text-xs">Export pack</button>
        </div>
      </div>
      <div className="card p-4" title="Audit log">
        <div className="font-medium mb-2 text-brand-blue">Audit Log</div>
        <div className="text-sm text-neutral-300">Recent changes and approvals.</div>
      </div>
    </div>
  );
}


