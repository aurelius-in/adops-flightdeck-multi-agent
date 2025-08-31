export function isOfflineMode(): boolean {
  if (typeof window === "undefined") return false;
  const sp = new URLSearchParams(window.location.search);
  return sp.get("offline") === "1" || sp.get("live") === "0" || sp.get("demo") === "1";
}

export async function loadOfflineEvents(): Promise<any[]> {
  const res = await fetch("/demo/events.json");
  return res.json();
}

export async function loadOfflineRun(): Promise<any> {
  const res = await fetch("/demo/run.json");
  return res.json();
}


