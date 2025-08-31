import { useState } from "react";

export default function InfoTooltip({ text }:{ text:string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block">
      <button className="text-xs text-neutral-400 hover:text-white" onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)} aria-label="Info">ⓘ</button>
      {open && (
        <div className="absolute z-20 mt-1 w-64 p-2 text-xs bg-neutral-900 border border-neutral-800 rounded shadow-lg">
          {text}
        </div>
      )}
    </span>
  );
}


