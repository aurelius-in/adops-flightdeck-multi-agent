import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(8787),
  HOST: z.string().default("0.0.0.0"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),

  MODEL_PROVIDER: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  BEDROCK_REGION: z.string().optional(),
  BEDROCK_MODEL_ID: z.string().optional(),

  AWS_REGION: z.string().optional(),
  DYNAMO_RUNS_TABLE: z.string().optional(),
  DYNAMO_ACTIONS_TABLE: z.string().optional(),
  DYNAMO_IDEMPOTENCY_TABLE: z.string().optional(),
  S3_BUCKET: z.string().optional(),

  JWT_SECRET: z.string().optional(),
  RATE_LIMIT_MAX: z.coerce.number().default(300),
  RATE_LIMIT_TIME_WINDOW_MS: z.coerce.number().default(60_000),

  OTEL_ENABLED: z.string().transform(v => v === "1" || v === "true").optional(),
  OTEL_SERVICE_NAME: z.string().default("adops-flightdeck-server"),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
});

export type AppConfig = z.infer<typeof EnvSchema>;

export const config: AppConfig = EnvSchema.parse(process.env as any);

export function requireAws(): void {
  if (!config.AWS_REGION) throw new Error("AWS_REGION required for AWS integrations");
}


