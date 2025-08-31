export default function TodayDrawer({ role, onClose, onAction }:{ role:string; onClose:()=>void; onAction:(title:string)=>void }) {
  const tasks = getTasks(role);
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end">
      <div className="w-full sm:w-[420px] h-full bg-neutral-950 border-l border-neutral-800 p-4 overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium text-brand-blue">Today — {role}</div>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
        <ul className="space-y-2 text-sm">
          {tasks.map(t=> (
            <li key={t} className="border border-neutral-800 rounded p-2 bg-neutral-950 flex items-center justify-between">
              <span>{t}</span>
              <button className="px-2 py-1 rounded bg-white text-black text-xs" onClick={()=>onAction(t)}>Start</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function getTasks(role:string): string[] {
  switch (role) {
    case "Ad Rep": return ["Select cohorts","Approve creative variants","Set thumbnail","Queue reallocation"];
    case "Executive": return ["Review iROAS","Approve budget shift","Share report link"];
    case "Creative": return ["Lock brief","Attach assets","Apply tone pass"];
    case "Compliance": return ["Review compliance flags","Apply rewrites"];
    case "Media Buyer": return ["Tune channel budgets","Prune SPO path","Approve exclusions"];
    default: return ["Review run status","Check Action Queue"];
  }
}


