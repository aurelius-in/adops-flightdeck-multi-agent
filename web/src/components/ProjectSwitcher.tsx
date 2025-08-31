import { useEffect, useMemo, useState } from "react";
import { Project, listProjects, createProject, duplicateProject, archiveProject, setLastProjectId, getLastProjectId } from "../lib/projects";

export default function ProjectSwitcher({ onSelect }:{ onSelect:(p:Project)=>void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Project[]>([]);
  const [active, setActive] = useState<string | null>(null);
  useEffect(()=>{
    const list = listProjects();
    setItems(list);
    const last = getLastProjectId() || list[0]?.id || null;
    if (last) { setActive(last); const found = list.find(p=>p.id===last); if (found) onSelect(found); }
  }, []);

  const filtered = useMemo(()=> items.filter(p=>!q || p.name.toLowerCase().includes(q.toLowerCase())), [items,q]);
  const activeName = items.find(p=>p.id===active)?.name || "";

  function handleSelect(id:string){
    const p = items.find(x=>x.id===id); if (!p) return; setActive(id); setLastProjectId(id); onSelect(p); setOpen(false);
  }

  function handleNew(){
    const name = prompt("Project name?") || "Untitled";
    const p = createProject({ name });
    setItems(listProjects());
    handleSelect(p.id);
  }

  function handleDuplicate(){ if (!active) return; const p = duplicateProject(active); if (p) { setItems(listProjects()); handleSelect(p.id);} }
  function handleArchive(){ if (!active) return; archiveProject(active); setItems(listProjects()); const next = listProjects()[0]; if (next) handleSelect(next.id); }

  return (
    <div className="relative">
      <button className="px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-brand-blue text-xs flex items-center gap-1" onClick={()=>setOpen(o=>!o)}>
        <span>Project</span>
        <span className="text-[10px]">▾</span>
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-80 bg-neutral-950 border border-neutral-800 rounded shadow-lg p-2">
          <div className="flex items-center gap-2 mb-2">
            <input placeholder="Search projects" className="w-full bg-neutral-950 border border-neutral-800 p-2 rounded outline-none focus:border-brand-blue text-xs" value={q} onChange={e=>setQ(e.target.value)} />
            <button className="px-2 py-1 rounded bg-white text-black text-xs" onClick={handleNew}>New</button>
          </div>
          <div className="max-h-64 overflow-auto space-y-1">
            {filtered.length===0 && <div className="text-xs text-neutral-500 p-2">No projects. Create one.</div>}
            {filtered.map(p=> (
              <div key={p.id} className={`flex items-center justify-between p-2 rounded cursor-pointer ${p.id===active?"bg-neutral-900 border border-brand-blue/40":"hover:bg-neutral-900"}`} onClick={()=>handleSelect(p.id)}>
                <div className="truncate">
                  <div className="text-xs">{p.name}</div>
                  <div className="text-[11px] text-neutral-500 truncate">{p.product || "(no product)"}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="text-[11px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 hover:border-brand-blue" onClick={(e)=>{e.stopPropagation(); setActive(p.id); handleDuplicate();}}>Duplicate</button>
                  <button className="text-[11px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 hover:border-brand-blue" onClick={(e)=>{e.stopPropagation(); setActive(p.id); handleArchive();}}>Archive</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


