export default function RoleToolbar({ role, onQueue }:{ role:string; onQueue:(item:{id:string; agent:string; title:string; reason?:string; impact?:string})=>void }) {
  const common = (
    <div className="flex items-center gap-2">
      <button className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-brand-blue text-xs font-semibold" onClick={()=>onQueue(makeItem("notes","Add note","Context updated"))}>Add note</button>
      <button className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-brand-blue text-xs font-semibold" onClick={()=>onQueue(makeItem("ticket","Create ticket","Assigned to ops"))}>Create ticket</button>
    </div>
  );
  switch (role) {
    case "Ad Rep":
      return (
        <BarWrap label="Ad Rep tools">
          <button className="btn-soft text-xs" onClick={()=>onQueue(makeItem("creative","Request new variant","+2 candidates"))}>Request variant</button>
          <button className="btn-soft text-xs" onClick={()=>onQueue(makeItem("pacing","Apply reallocation","+3% ROAS"))}>Apply reallocation</button>
          {common}
        </BarWrap>
      );
    case "Creative":
      return (
        <BarWrap label="Creative tools">
          <button className="btn-soft text-xs" onClick={()=>onQueue(makeItem("brief","Lock brief"))}>Lock brief</button>
          <button className="btn-soft text-xs" onClick={()=>onQueue(makeItem("creative","Approve for test"))}>Approve for test</button>
          {common}
        </BarWrap>
      );
    case "Compliance":
      return (
        <BarWrap label="Compliance tools">
          <button className="btn-soft text-xs" onClick={()=>onQueue(makeItem("compliance","Apply rewrite","All regions"))}>Apply rewrite</button>
          <button className="btn-soft text-xs" onClick={()=>onQueue(makeItem("audit","Export log"))}>Export log</button>
          {common}
        </BarWrap>
      );
    case "Media Buyer":
      return (
        <BarWrap label="Media buyer tools">
          <button className="btn-soft text-xs" onClick={()=>onQueue(makeItem("spo","Prune path","-1.2% IVT"))}>Prune SPO path</button>
          <button className="btn-soft text-xs" onClick={()=>onQueue(makeItem("budget","Save caps"))}>Save caps</button>
          {common}
        </BarWrap>
      );
    case "Executive":
      return (
        <BarWrap label="Executive tools">
          <button className="btn-soft text-xs" onClick={()=>onQueue(makeItem("report","Download pack"))}>Download pack</button>
          <button className="btn-soft text-xs" onClick={()=>onQueue(makeItem("attrib","Propose shift","Projected +0.1 iROAS"))}>Propose shift</button>
          {common}
        </BarWrap>
      );
    default:
      return null;
  }
}

function BarWrap({ label, children }:{ label:string; children:any }) {
  return (
    <div className="card p-3 flex items-center gap-2 fade-in" title={label}>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function makeItem(agent:string, title:string, impact?:string) {
  return { id: cryptoRandomId(), agent, title, impact };
}

function cryptoRandomId(): string {
  try { return Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b=>b.toString(16).padStart(2,"0")).join(""); } catch { return Math.random().toString(36).slice(2); }
}


