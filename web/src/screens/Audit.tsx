import { useEffect, useState } from "react";
import { summarize } from "../lib/format";
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
    <div className="card p-4" title="Final artifacts, attribution, LTV and executive summary">
      <div className="font-medium mb-2 text-brand-blue">Audit & Learn</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <SummaryCard title="Attribution" value={summarize("attrib","credit", data?.artifacts?.attribution)} />
        <SummaryCard title="LTV" value={summarize("ltv","curves", data?.artifacts?.ltv)} />
        <SummaryCard title="Report" value={summarize("report","summary", data?.artifacts?.report)} />
        <SummaryCard title="Executive narrative" value={String(data?.artifacts?.execNarrative ?? "")} />
      </div>
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
      {/* Raw snapshot intentionally hidden for end users */}
    </div>
  );
}

function SummaryCard({ title, value }:{ title:string; value:string }) {
  return (
    <div className="border border-neutral-800 rounded-xl p-3 bg-neutral-950">
      <div className="text-xs text-neutral-400 mb-1">{title}</div>
      <div className="text-sm">{value || ""}</div>
    </div>
  );
}


