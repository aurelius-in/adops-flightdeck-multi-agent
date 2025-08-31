import { config as app } from "./config";
let inited = false;

export function initTracing() {
  if (inited || !app.OTEL_ENABLED) return;
  // Defer heavy init; a real setup would import @opentelemetry/sdk-node and exporters
  try {
    // Placeholder for OTEL SDK init to CloudWatch/X-Ray via OTLP or AWS Distro
    inited = true;
    // eslint-disable-next-line no-console
    console.log("OpenTelemetry tracing enabled");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Failed to init tracing", e);
  }
}


