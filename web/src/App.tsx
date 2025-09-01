import { useEffect, useMemo, useState } from "react";
import Plan from "./screens/Plan";
import Operate from "./screens/Operate";
import Audit from "./screens/Audit";
import Library from "./screens/Library";
import Investigate from "./screens/Investigate";
import { isOfflineMode } from "./lib/offline";
import RunHeader from "./components/RunHeader";
import ActionQueue from "./components/ActionQueue";
import TodayDrawer from "./components/TodayDrawer";
import RoleToolbar from "./components/RoleToolbar";
import ContextDrawer from "./components/ContextDrawer";
import { Project, seedSampleProjectsIfEmpty, listProjects, getLastProjectId, upsertProject, addRun } from "./lib/projects";
import { allowedTabs } from "./lib/roles";
import Buy from "./screens/Buy";
import Studio from "./screens/Studio";
import Govern from "./screens/Govern";
import Dashboard from "./screens/Dashboard";
import ChatWidget from "./components/ChatWidget";

type Tab = "Plan"|"Operate"|"Audit"|"Buy"|"Studio"|"Govern"|"Dashboard";

export default function App() {
  const [runId, setRunId] = useState<string>("");
  const [tab, setTab] = useState<Tab>("Plan");
  const [showLib, setShowLib] = useState(false);
  const [showInvestigate, setShowInvestigate] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showToday, setShowToday] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [lastEvent, setLastEvent] = useState<string>("");
  const [queue, setQueue] = useState<{id:string; agent:string; title:string; reason?:string; impact?:string; projectId?:string}[]>([]);
  const offline = isOfflineMode();
  const perf = useMemo(()=>({ spend: 0, conversions: 0, roas: undefined as any, cpa: undefined as any }), []);
  const [role, setRole] = useState<string>("Ad Rep");
  const [context, setContext] = useState<{product?:string; audience?:string; budget?:number}>({});
  const [project, setProject] = useState<Project | null>(null);
  const [queueGlobal, setQueueGlobal] = useState(false);

  useEffect(() => {
    try { seedSampleProjectsIfEmpty(); } catch {}
    try {
      const list = listProjects();
      const last = getLastProjectId();
      const sel = list.find(p=>p.id===last) || list[0] || null;
      if (sel) { setProject(sel); setContext({ product: sel.product, audience: sel.audience, budget: sel.dailyBudget }); }
    } catch {}
    try {
      const savedRole = localStorage.getItem("af_role");
      if (savedRole) setRole(savedRole);
      const savedCtx = localStorage.getItem("af_ctx");
      if (savedCtx) setContext(JSON.parse(savedCtx));
    } catch {}
  }, []);

  return (
    <div className={`min-h-screen bg-neutral-950 text-white role-${role.replace(/\s+/g,'').toLowerCase()}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
        <RunHeader product={context.product} budget={context.budget} isOffline={offline} runId={runId} lastEvent={lastEvent} perf={perf} onToggleOffline={()=>{ window.location.search = offline?"":"?offline=1"; }} onOpenQueue={()=>setShowQueue(true)} role={role} onRoleChange={(r)=>{ setRole(r); try { localStorage.setItem("af_role", r);} catch {} }} onOpenToday={()=>setShowToday(true)} onOpenContext={()=>setShowContext(true)} onProjectSelect={(p)=>{ setProject(p); setContext({ product: p.product, audience: p.audience, budget: p.dailyBudget }); }} />
        <div className="flex items-center gap-2">
          {(["Ad Rep","Creative","Media Buyer","Executive","Compliance"].includes(role)) && (
            <button title="Browse asset library and offer ideas; push selections into Plan" className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-brand-blue transition" onClick={()=>setShowLib(true)}>Assets & Offers</button>
          )}
          {(["Ad Rep","Media Buyer","Executive"].includes(role)) && (
            <button title="Open root-cause explorer to understand performance dips and remedies" className="px-3 py-2 rounded-lg bg-brand-purple/20 text-brand-blue hover:bg-brand-purple/30 transition" onClick={()=>setShowInvestigate(true)}>Explain a Dip</button>
          )}
        </div>
        <RoleToolbar role={role} onQueue={(item)=>{ const it = project? { ...item, projectId: project.id } : item; setQueue(q=>[...q, it]); setLastEvent(`${item.agent} • queued action`); }} />
        <nav className="flex gap-2">
          {(allowedTabs(role) as Tab[]).map(t=> (
            <button title={t==="Plan"?"Define product, audience, budget and generate creatives":t==="Operate"?"Watch pacing, delivery and anomaly handling":"Review attribution, LTV and signed artifacts"} key={t} onClick={()=>setTab(t)} className={`px-3 py-2 rounded-lg border ${tab===t?"bg-white text-black border-white":"bg-neutral-900 border-neutral-800"}`}>{t}</button>
          ))}
        </nav>
        {/* Auto-select a valid tab if current tab is not permitted by role */}
        {!(allowedTabs(role) as Tab[]).includes(tab) && setTab((allowedTabs(role) as Tab[])[0])}
        {tab==="Plan" && <Plan role={role} project={project || undefined} onSaveProject={(updates)=>{ if (!project) return; const next = upsertProject({ ...project, product: updates.product, audience: updates.audience, dailyBudget: updates.dailyBudget, brandRules: updates.brandRules, updatedAt: Date.now() }); setProject(next); setContext({ product: next.product, audience: next.audience, budget: next.dailyBudget }); setLastEvent("Project saved"); }} onRun={(id)=>{ setRunId(id); if (project) addRun(project.id, { status: "running" }); setLastEvent("Run started"); }} runId={runId} onQueue={(item)=>{ const it = project? { ...item, projectId: project.id } : item; setQueue(q=>[...q, it]); setLastEvent(`${item.agent} • queued action`); }} />} 
        {tab==="Operate" && <Operate role={role} runId={runId} projectId={project?.id} onQueue={(item)=>{ const it = project? { ...item, projectId: project.id } : item; setQueue(q=>[...q, it]); }} onEvent={(msg)=>setLastEvent(msg)} onOpenRun={(id)=>{ setRunId(id); setTab("Audit"); }} />} 
        {tab==="Audit" && <Audit role={role} runId={runId} onQueue={(item)=>{ const it = project? { ...item, projectId: project.id } : item; setQueue(q=>[...q, it]); setLastEvent(`${item.agent} • proposed action`); }} />} 
        {tab==="Buy" && <Buy onQueue={(item)=>{ const it = project? { ...item, projectId: project.id } : item; setQueue(q=>[...q, it]); }} />}
        {tab==="Studio" && <Studio />}
        {tab==="Govern" && <Govern />}
        {tab==="Dashboard" && <Dashboard />}

        {showLib && <Library onClose={()=>setShowLib(false)} runId={runId} onQueue={(item)=>{ const it = project? { ...item, projectId: project.id } : item; setQueue(q=>[...q, it]); setLastEvent(`${item.agent} • added`); }} />} 
        {showInvestigate && <Investigate onClose={()=>setShowInvestigate(false)} runId={runId} onPropose={(item)=>{ const it = project? { ...item, projectId: project.id } : item; setQueue(q=>[...q, it]); setLastEvent(`${item.agent} • proposed action`); }} />} 
        {showQueue && <ActionQueue items={(queueGlobal||!project)? queue : queue.filter(i=> (i as any).projectId===project?.id)} onApprove={(id)=>setQueue(q=>q.filter(x=>x.id!==id))} onReject={(id)=>setQueue(q=>q.filter(x=>x.id!==id))} onClose={()=>setShowQueue(false)} />} 
        {showToday && <TodayDrawer role={role} onClose={()=>setShowToday(false)} onAction={(t)=>setLastEvent(`Today • ${t}`)} />}
        {showContext && <ContextDrawer initialProduct={project?.product || context.product} initialAudience={project?.audience || context.audience} onClose={()=>setShowContext(false)} onSave={(ctx)=>{ setShowContext(false); if (project){ const next = upsertProject({ ...project, product: ctx.product, audience: ctx.audience, dailyBudget: ctx.budget, updatedAt: Date.now()}); setProject(next); } setContext(ctx); try { localStorage.setItem("af_ctx", JSON.stringify(ctx)); } catch {}; setLastEvent(`Context set: ${ctx.product}`); }} />}
        <div className="flex items-center gap-2 text-xs text-neutral-400"><input type="checkbox" checked={queueGlobal} onChange={e=>setQueueGlobal(e.target.checked)} /> Global queue (exec)</div>
      </div>
      <ChatWidget role={role} projectId={project?.id} />
    </div>
  );
}


