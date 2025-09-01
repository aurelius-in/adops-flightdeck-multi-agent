export default function Studio(){
  return (
    <div className="space-y-4">
      <div className="card p-4" title="Brief">
        <div className="font-medium mb-2 text-brand-blue">Brief</div>
        <div className="text-sm text-neutral-300">Promise, tone, angles, CTAs. Compare v1 vs v2 and lock.</div>
        <div className="flex items-center gap-2 mt-2">
          <select className="bg-neutral-950 border border-neutral-800 rounded p-1 text-xs"><option>v1</option><option>v2</option></select>
          <button className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-brand-blue text-xs">Diff</button>
          <button className="px-2 py-1 rounded bg-white text-black text-xs">Lock brief</button>
        </div>
      </div>
      <div className="card p-4" title="Variants">
        <div className="font-medium mb-2 text-brand-blue">Variants</div>
        <div className="text-sm text-neutral-300">Approve 2–3 variants for test; regenerate if needed.</div>
        <div className="flex items-center gap-2 mt-2">
          <button className="px-2 py-1 rounded bg-white text-black text-xs">Approve for test</button>
          <button className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-brand-blue text-xs">Regenerate</button>
        </div>
      </div>
      <div className="card p-4" title="Quality">
        <div className="font-medium mb-2 text-brand-blue">Tone & Compliance</div>
        <div className="text-sm text-neutral-300">Apply tone pass; fix redlines; a11y & localization.
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button className="px-2 py-1 rounded bg-white text-black text-xs">Apply tone pass</button>
          <button className="px-2 py-1 rounded bg-white text-black text-xs">Apply compliant rewrite</button>
        </div>
      </div>
    </div>
  );
}


