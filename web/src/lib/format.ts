export function humanizeKey(key: string): string {
  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^\s+|\s+$/g, "");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function formatCurrency(n?: number): string {
  if (typeof n !== "number" || Number.isNaN(n)) return "-";
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function summarize(agent: string, type: string | undefined, data: any): string {
  try {
    switch (agent) {
      case "experiment": {
        return `Design: ${data?.arms ?? "-"} arms, metric ${data?.metric ?? "-"}`;
      }
      case "pacing": {
        const total = Array.isArray(data) ? data.reduce((s: number, r: any) => s + (r.dailyBudget || 0), 0) : 0;
        return `Daily allocation: ${formatCurrency(total)} across ${Array.isArray(data) ? data.length : 0} arms`;
      }
      case "spo": {
        const allow = data?.allow?.length ?? 0;
        const deny = data?.deny?.length ?? 0;
        return `Routes — allow: ${allow}, deny: ${deny}`;
      }
      case "roadmap": {
        return `Backlog: ${(data?.length ?? 0)} items (top: ${data?.[0]?.name ?? "-"})`;
      }
      case "anomaly": {
        const ctrs = (data?.metrics ?? []).map((m: any) => m?.ctr).filter((x: any) => typeof x === "number");
        const avgCtr = ctrs.length ? (ctrs.reduce((a: number, b: number) => a + b, 0) / ctrs.length) : undefined;
        return `Tick t=${data?.t ?? 0} • avg CTR ${avgCtr ? (avgCtr * 100).toFixed(1) + "%" : "-"}`;
      }
      case "rootcause": {
        return `Top factor: ${data?.suspects?.[0]?.factor ?? "-"} (${Math.round((data?.suspects?.[0]?.weight ?? 0) * 100)}%)`;
      }
      case "negatives": {
        return `Exclusions: ${(data?.length ?? 0)} terms`;
      }
      case "fraud": {
        return `IVT ${data?.rate ? (data.rate * 100).toFixed(1) + "%" : "-"}`;
      }
      case "budget": {
        return `Daily cap: ${formatCurrency(data?.dailyMax)}`;
      }
      case "audit": {
        return `Recent change: ${data?.[0]?.change ?? "-"}`;
      }
      case "attrib": {
        return `Top credit: ${data?.credit?.[0]?.channel ?? "-"} (${Math.round((data?.credit?.[0]?.point ?? 0) * 100)}%)`;
      }
      case "ltv": {
        return `Cohorts: ${(data?.length ?? 0)}`;
      }
      case "report": {
        return `iROAS ${data?.iROAS ?? "-"} • ${data?.recommendation ?? ""}`;
      }
      default: {
        // Plan/creative blocks or unknown: provide a compact count/preview
        if (Array.isArray(data)) return `${data.length} items`;
        if (typeof data === "object" && data) return Object.keys(data).slice(0, 3).map(humanizeKey).join(", ");
        return String(data ?? "");
      }
    }
  } catch {
    return "";
  }
}


