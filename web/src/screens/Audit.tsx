import { useEffect, useState } from "react";
import { isOfflineMode, loadOfflineRun } from "../lib/offline";

export default function Audit({ runId }: { runId: string }) {
  const [data, setData] = useState<any>({});
  useEffect(() => {
    if (isOfflineMode()) { loadOfflineRun().then(setData); return; }
    if (!runId) return;
    fetch(`http://localhost:8787/api/runs/${runId}`).then(r=>r.json()).then(setData);
  }, [runId]);
  if (!runId && !isOfflineMode()) return <div className="text-neutral-400">Start a run in Plan.</div>;
  return (
    <div className="card p-4">
      <div className="font-medium mb-2 text-brand-blue">Audit & Learn</div>
      <pre className="text-xs whitespace-pre-wrap text-neutral-300">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}


