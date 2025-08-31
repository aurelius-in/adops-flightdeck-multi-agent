# AdOps Flightdeck

Production-grade multi-agent AdOps application that plans, launches, and optimizes paid media with audit-ready governance on AWS. It orchestrates specialized AI agents for targeting, offer design, creative generation and safety, pacing, anomaly response, attribution, LTV forecasting, root-cause analysis, and executive reporting. Built for speed to decision and repeatable outcomes, not slideware.

---

## Why this exists

Media teams lose time stitching tools, exporting CSVs, and arguing over attribution while performance drifts. AdOps Flightdeck gives you a single control room where agents do the busywork, document every decision, and surface only the choices a human should make. Teams ship tests faster, stabilize CPA and ROAS sooner, and walk into reviews with defensible, audit-ready evidence.

---

## What it does

- **Plans** multi-arm experiments and audience strategy, with offer ideas that respect margin and policy.
- **Generates** brand-safe creatives and evolves them using constraints and live signals.
- **Paces** budget across channels, routes around liquidity issues, and adapts to anomalies without drama.
- **Explains** performance with reconciled attribution and root-cause analysis you can act on.
- **Reports** with signed artifacts and traceable runs, ready for compliance and exec summaries.

---

## Screens and workflow

The application is organized into **5 screens** that represent **3 major steps** with **2 sub-steps** per step. The first three are the main tabs. Two additional screens open from buttons in the header.

### Main tabs

1) **Plan**
   - **1a. Target & Offer**
     - Agents: Audience DNA Mapper, Warm-Start Seeding, Offer Composer, Creative QA & Asset Librarian
     - Outcomes: privacy-safe cohorts, lookalike seeds, margin-aware offer matrix, best-fit assets
   - **1b. Creative & Guardrails**
     - Agents: Creative Generator, Creative Gene Splicer, Claims & Compliance Sentinel, Thumb-Stop Predictor
     - Outcomes: multiple copy/image variants, evolution lineage, redlines with one-click fixes, best first-frame

2) **Operate**
   - **2a. Pacing & Delivery**
     - Agents: Spend Pacer & Liquidity Router, Supply-Path Optimizer, Experiment Roadmap Planner
     - Outcomes: daily budget routing by channel/geo, SPO allow/deny lists, prioritized learning agenda
   - **2b. Watch & Respond**
     - Agents: Anomaly Watchdog, Anomaly Root-Cause Sleuth, Negative-Signal Miner
     - Outcomes: live metrics with auto-responses, explainable dips/spikes, exclusion lists with impact preview

3) **Audit & Learn**
   - **3a. Attribution & LTV**
     - Agents: Attribution Reconciler, LTV Forecaster
     - Outcomes: credit intervals by channel and creative, cohort LTV curves, recommended reallocations
   - **3b. Report & Next Actions**
     - Agents: Reporter
     - Outcomes: iROAS snapshot, action plan, signed JSON artifacts and CSVs

### Extra screens (header buttons)

- **Library**  (opens from “Assets & Offers” button)
  - Searchable asset library with auto-tags, brand palette checks, and “best match for Audience X.”
  - Offer catalog with predicted iROAS and margin floors. One-click push to Plan.

- **Investigate**  (opens from “Explain a Dip” button)
  - Root-cause explorer that pulls traces, shows factor importances, and proposes remedial playbooks with estimated lift.

---

## Notable agents

- **Audience DNA Mapper** builds cohorts using embeddings and RFM signals and outputs persona cards with angles.
- **Offer Composer** proposes incentives that respect margin floors and inventory constraints.
- **Creative Gene Splicer** evolves copy and image prompts under brand rules using a genetic algorithm.
- **Claims & Compliance Sentinel** catches regulated claims and rewrites with citations by region.
- **Thumb-Stop Predictor** ranks frames and suggests opening captions for attention.
- **Spend Pacer & Liquidity Router** shifts spend to hit CPA or ROAS targets given liquidity and learning phases.
- **Supply-Path Optimizer** prunes wasteful exchanges using auction logs and IVT scores.
- **Anomaly Watchdog** streams ticks, pauses losers, and boosts winners based on rules you control.
- **Attribution Reconciler** fuses MMM, MTA, and lift tests to produce credit intervals, not fantasy point estimates.
- **LTV Forecaster** shows which creatives and offers bias toward durable value, not short-term spikes.
- **Root-Cause Sleuth** explains what moved a metric and proposes fixes with expected impact.

---

## Architecture

AdOps Flightdeck runs as a typed monorepo with an orchestrator, tools, and a React front end. Production services are native to AWS.

```
Front End (React + TS + Tailwind)
   ↓ SSE/REST
Orchestrator (Fastify + LangGraphJS)
   ├─ Policy Engine and Prompt Registry
   ├─ Tooling layer (Ads APIs, Analytics, CRM, Catalog)
   ├─ Retrieval (OpenSearch kNN) and Object Store (S3)
   ├─ State (DynamoDB) and Queues (EventBridge/SQS)
   ├─ Models (AWS Bedrock: Claude, Llama, Titan, etc.)
   └─ Observability (OpenTelemetry → CloudWatch)
Data Lake: S3 + Glue + Athena for auction logs and reports
```

### AWS components

- **Bedrock** for model inference with Prompt Registry and model routing
- **S3** for assets, creative lineage, and signed artifacts
- **DynamoDB** for run state, agent memory, and idempotency
- **OpenSearch** for audience and asset retrieval using vector and metadata filters
- **EventBridge + SQS** for fan-out orchestration and durable retries
- **CloudWatch + OpenTelemetry** for traces, logs, and metrics
- **Glue + Athena** for exchange logs and large report queries
- **Secrets Manager** for API keys and policy documents

---

## Data connections

Adapters are modular. Enable only what you use.

- **Ads**: Meta Marketing API, Google Ads, TikTok Ads
- **Analytics**: GA4, Snowplow
- **CRM/CDP**: HubSpot, Salesforce
- **Catalog/Inventory**: your ERP or CSV via S3
- **Auction logs**: S3 + Glue tables

Each adapter implements a single interface for read and write, supports sandbox or production credentials, and emits OpenTelemetry spans for audit.

---

## Governance and safety

- **Policy-as-code** for claims and brand voice with region overrides
- **Prompt registry** with signed versions and change history
- **Pre-index redaction** for PII prior to embeddings
- **Tool allow/deny lists** and scoped credentials per agent
- **Idempotent writes** to ad platforms with replay protection
- **Full traceability** for every decision and mutation

---

## Performance and SLOs

Default targets you can tune:

- **Latency**: P50 orchestration under 2.5 s for single-tool requests, streaming tokens within 300 ms
- **Cost**: model tokens per successful task tracked and budgeted; autoswitch to distilled models for routine steps
- **Quality**: groundedness and citation coverage above threshold on golden sets before full rollout
- **Safety**: zero known policy violations in canary before general availability

---

## Developer guide

### Repo layout

```
adops-flightdeck-multi-agent/
  server/
    src/
      agents/                # Each agent is a small, testable module
      tools/                 # Ads, analytics, CRM adapters
      policies/              # Guardrails and prompt templates
      graph.ts               # LangGraphJS orchestration
      index.ts               # Fastify app (REST + SSE)
  web/
    src/
      screens/               # Plan, Operate, Audit, Library, Investigate
      components/            # Agent Cards, charts, diff views
```

### Environment

- Node 20, npm or pnpm
- AWS account with Bedrock access enabled in your region
- Permissions for S3, DynamoDB, OpenSearch, EventBridge, SQS, CloudWatch, Glue, Athena
- API credentials for any ad platforms you intend to control

`.env` (example):
```
MODEL_PROVIDER=bedrock
BEDROCK_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
AWS_REGION=us-east-1
OPENSEARCH_HOST=https://your-domain.us-east-1.es.amazonaws.com
DYNAMO_TABLE=adops_flightdeck_runs
S3_BUCKET=adops-flightdeck-artifacts
GA4_KEY_JSON=...
META_ACCESS_TOKEN=...
GOOGLE_ADS_REFRESH_TOKEN=...
TIKTOK_ACCESS_TOKEN=...
```

### Run local with AWS services

1. Export AWS credentials with permissions listed above.
2. `npm install` at repo root.
3. `npm run dev` starts `server` and `web`.
4. Open `http://localhost:5173`.
5. Use Plan to define product, audience, budget, and rules. Launch a run and watch agents collaborate in Operate. Move to Audit & Learn for attribution and reporting.

### Deploy to AWS

- Containerize server and web.
- Run the orchestrator on ECS Fargate or EKS.
- Serve web on CloudFront + S3 or behind ALB with your API.
- Use DynamoDB on-demand tables for state and S3 for artifacts.
- Enable OpenTelemetry collector sidecar to ship traces to CloudWatch or X-Ray.
- Optionally schedule nightly batch agents through EventBridge.

---

## API surface

- `POST /api/run`  create a new run with `{ product, audience, budget, brandRules, connectors }`
- `GET  /api/stream/:runId`  Server-Sent Events feed of agent events `{ ts, agent, type, data }`
- `GET  /api/runs/:runId`  snapshot of artifacts and signed report links
- `POST /api/actions/:runId`  accept human-in-the-loop approvals for proposed actions
- `GET  /api/policies`  current policy set with signatures

All endpoints emit OpenTelemetry traces with run and user correlation IDs.

---

## Observability and evals

- **Tracing**: every tool call and model message is traced with input, output hash, and token usage.
- **Dashboards**: latency histograms, token cost per task, policy violations, cache hit rates.
- **Offline evals**: golden sets per intent and per audience slice with exact-match and rubric scoring.
- **Canary**: traffic splitting with auto-rollback when quality or safety dips below thresholds.

---

## Extending agents

1. Start from `server/src/agents/templateAgent.ts`.
2. Declare inputs and contracts in `types.ts`.
3. Register in `graph.ts` with guard conditions and backoff.
4. Add a minimal Agent Card in `web/src/components/` with a status badge and JSON preview.
5. Instrument with OpenTelemetry.

Suggested additions:
- Pricing elasticity explorer
- Creative fatigue forecaster
- Geo-compliance translator for regulated sectors

---

## Security model

- Principle of least privilege on all IAM roles
- Platform writes require explicit human approval unless a runbook is signed for autonomous execution
- Signed artifact packs stored in S3 with SHA checksums
- All secrets in AWS Secrets Manager

---

## Data model highlights

- **Run**: id, tenant, inputs, agent states, actions, artifacts, signatures
- **Artifact**: name, content hash, signed URL, mime type, retention policy
- **Policy**: id, region, constraints, version, signer

---

## Roadmap

- Drag-and-drop creative composer integrated with brand palette detection
- Live SPO from exchange logs via Kinesis
- Automated lift test setup and measurement with cleanroom integrations
- One-click migration wizard for existing campaigns

---

## License

MIT for code. Vendor APIs and model usage subject to their terms.

---

## Quick start checklist

- Create repo: `adops-flightdeck-multi-agent`
- Use description:  
  **Production-grade AdOps Flightdeck that orchestrates AI agents for planning, creative, brand safety, pacing, anomaly response, attribution, and auditable reporting on AWS.**
- Configure `.env` with Bedrock and platform credentials
- Launch locally, then deploy to ECS with DynamoDB, S3, OpenSearch, EventBridge, SQS, CloudWatch enabled
- Invite your team, run a canary, and move work from “discussed” to “shipped” faster

If you want, I can now align the Cursor scaffolding to this README structure so the five screens and agents map one-to-one.
