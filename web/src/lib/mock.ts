export function isMockMode(): boolean {
  if (typeof window === "undefined") return false;
  const sp = new URLSearchParams(window.location.search);
  return sp.get("mock") === "1" || sp.get("demo") === "1";
}

export async function loadMockEvents(): Promise<any[]> {
  const res = await fetch("/demo/events.json");
  return res.json();
}

export async function loadMockRun(): Promise<any> {
  const res = await fetch("/demo/run.json");
  return res.json();
}


