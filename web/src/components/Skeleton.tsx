export function Skeleton({ rows=3 }:{ rows?: number }) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: rows }).map((_,i)=> (
        <div key={i} className="h-3 bg-neutral-900 rounded" />
      ))}
    </div>
  );
}


