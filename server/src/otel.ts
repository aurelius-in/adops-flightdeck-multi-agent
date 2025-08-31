import { config as app } from "./config";
let inited = false;

export async function initTracing() {
  if (inited || !app.OTEL_ENABLED) return;
  try {
    const { NodeSDK } = await import("@opentelemetry/sdk-node");
    const { getNodeAutoInstrumentations } = await import("@opentelemetry/auto-instrumentations-node");
    const { Resource } = await import("@opentelemetry/resources");
    const { SEMRESATTRS_SERVICE_NAME } = await import("@opentelemetry/semantic-conventions");
    const { OTLPTraceExporter } = await import("@opentelemetry/exporter-trace-otlp-http");

    const exporter = new OTLPTraceExporter({ url: app.OTEL_EXPORTER_OTLP_ENDPOINT });
    const sdk = new NodeSDK({
      resource: new Resource({ [SEMRESATTRS_SERVICE_NAME]: app.OTEL_SERVICE_NAME }),
      traceExporter: exporter,
      instrumentations: [getNodeAutoInstrumentations()]
    });
    await sdk.start();
    inited = true;
    console.log("OpenTelemetry tracing enabled");
  } catch (e) {
    console.warn("Failed to init tracing", e);
  }
}


