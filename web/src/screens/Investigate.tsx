export default function Investigate({ onClose, runId }:{ onClose:()=>void; runId:string}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="card max-w-3xl w-full p-4" title="Root-cause explorer for dips and spikes">
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium text-brand-blue">Explain a Dip</div>
          <button className="btn" title="Close this panel" onClick={onClose}>Close</button>
        </div>
        <div className="text-sm text-neutral-300">
          Root-cause explorer shows factor importances and proposed remediation playbooks with expected lift.
        </div>
      </div>
    </div>
  );
}


