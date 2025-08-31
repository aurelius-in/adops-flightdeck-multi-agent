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
      {data?.signed && (
        <div className="mb-3">
          <div className="text-sm mb-1">Artifacts</div>
          <div className="flex flex-wrap gap-2 text-xs">
            {Object.entries<any>(data.signed).map(([k, url]) => (
              <a key={k} href={String(url)} target="_blank" rel="noreferrer" className="underline text-brand-blue">{k}</a>
            ))}
          </div>
        </div>
      )}
      <pre className="text-xs whitespace-pre-wrap text-neutral-300">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}


