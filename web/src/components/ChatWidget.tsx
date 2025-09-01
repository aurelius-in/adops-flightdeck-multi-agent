import { useEffect, useRef, useState } from "react";

type Msg = { id:string; role:"user"|"assistant"; text:string; ts:number };

export default function ChatWidget({ projectId, role }:{ projectId?:string; role:string }){
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const key = `af_chat_${projectId||"global"}_${role}`;
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    try { const raw = localStorage.getItem(key); if (raw) setMsgs(JSON.parse(raw)); } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, open]);

  useEffect(()=>{
    try { localStorage.setItem(key, JSON.stringify(msgs)); } catch {}
    listRef.current?.scrollTo({ top: 99999 });
  }, [msgs, key]);

  function send(){
    if (!q.trim()) return;
    const user: Msg = { id: rid(), role: "user", text: q.trim(), ts: Date.now() };
    setMsgs(m=>[...m, user]);
    setQ("");
    // Simple offline assistant stub
    setTimeout(()=>{
      const a: Msg = { id: rid(), role: "assistant", text: "Got it. I queued that for you in Action Queue and will surface any impacts in the header ticker.", ts: Date.now() };
      setMsgs(m=>[...m, a]);
    }, 600);
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open && (
        <div className="w-80 h-96 bg-neutral-950 border border-neutral-800 rounded-xl shadow-lg flex flex-col">
          <div className="p-2 border-b border-neutral-800 flex items-center justify-between">
            <div className="text-xs text-neutral-400">Chat — {role}</div>
            <button className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-brand-blue text-xs" onClick={()=>setOpen(false)}>Close</button>
          </div>
          <div ref={listRef} className="flex-1 overflow-auto p-2 space-y-2">
            {msgs.map(m=> (
              <div key={m.id} className={`text-xs p-2 rounded ${m.role==="user"?"bg-neutral-900 text-white ml-8":"bg-neutral-800 text-neutral-200 mr-8"}`}>{m.text}</div>
            ))}
          </div>
          <div className="p-2 border-t border-neutral-800 flex items-center gap-2">
            <input className="flex-1 bg-neutral-950 border border-neutral-800 p-2 rounded outline-none focus:border-brand-blue text-xs" placeholder="Ask or instruct…" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') send(); }} />
            <button className="btn-soft text-xs" onClick={send}>Send</button>
          </div>
        </div>
      )}
      <button className="mt-2 px-3 py-2 rounded-lg bg-brand-purple/20 text-brand-blue hover:bg-brand-purple/30 transition text-xs" onClick={()=>setOpen(o=>!o)}>{open?"Hide chat":"Chat"}</button>
    </div>
  );
}

function rid(){ try { return Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b=>b.toString(16).padStart(2,"0")).join(""); } catch { return Math.random().toString(36).slice(2);} }


