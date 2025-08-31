import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config as app } from "./config";

type RunRecord = { runId: string; artifacts: Record<string, any>; createdAt: number };
type ActionRecord = { runId: string; actionId: string; approved: boolean; approvedBy?: string; at: number; payload: any };

const ddb = app.DYNAMO_RUNS_TABLE ? new DynamoDBDocumentClient(new DynamoDBClient({})) : null;
const s3 = app.S3_BUCKET ? new S3Client({}) : null;

const memRuns = new Map<string, RunRecord>();
const memActions: ActionRecord[] = [];

export async function getRun(runId: string): Promise<RunRecord | undefined> {
  if (ddb && app.DYNAMO_RUNS_TABLE) {
    const res = await ddb.send(new GetCommand({ TableName: app.DYNAMO_RUNS_TABLE, Key: { runId } }));
    return res.Item as RunRecord | undefined;
  }
  return memRuns.get(runId);
}

export async function createRun(runId: string): Promise<void> {
  const rec: RunRecord = { runId, artifacts: {}, createdAt: Date.now() };
  if (ddb && app.DYNAMO_RUNS_TABLE) {
    await ddb.send(new PutCommand({ TableName: app.DYNAMO_RUNS_TABLE, Item: rec, ConditionExpression: "attribute_not_exists(runId)" }));
  } else {
    memRuns.set(runId, rec);
  }
}

export async function putArtifact(runId: string, key: string, data: any): Promise<void> {
  if (s3 && app.S3_BUCKET) {
    await s3.send(new PutObjectCommand({ Bucket: app.S3_BUCKET, Key: `${runId}/${key}.json`, Body: JSON.stringify(data), ContentType: "application/json" }));
  }
  if (ddb && app.DYNAMO_RUNS_TABLE) {
    await ddb.send(new UpdateCommand({ TableName: app.DYNAMO_RUNS_TABLE, Key: { runId }, UpdateExpression: "SET artifacts.#k = :v", ExpressionAttributeNames: { "#k": key }, ExpressionAttributeValues: { ":v": data } }));
  } else {
    const rec = memRuns.get(runId);
    if (rec) rec.artifacts[key] = data;
  }
}

export async function listArtifacts(runId: string): Promise<Record<string, any>> {
  const rec = await getRun(runId);
  return rec?.artifacts ?? {};
}

export async function getArtifactSignedUrl(runId: string, key: string): Promise<string | undefined> {
  if (!s3 || !app.S3_BUCKET) return undefined;
  const cmd = new GetObjectCommand({ Bucket: app.S3_BUCKET, Key: `${runId}/${key}.json` });
  return getSignedUrl(s3, cmd, { expiresIn: 300 });
}

export async function recordAction(a: ActionRecord): Promise<void> {
  if (ddb && app.DYNAMO_ACTIONS_TABLE) {
    await ddb.send(new PutCommand({ TableName: app.DYNAMO_ACTIONS_TABLE, Item: a }));
  } else {
    memActions.push(a);
  }
}


