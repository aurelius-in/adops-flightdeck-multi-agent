import { z } from "zod";
import OpenAI from "openai";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const provider = process.env.MODEL_PROVIDER ?? "bedrock";

const oai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const bedrock = new BedrockRuntimeClient({ region: process.env.BEDROCK_REGION });

export async function generate(prompt: string, schema?: z.ZodTypeAny) {
  // Toggle to stub outputs for offline/dev
  if (!process.env.OPENAI_API_KEY && provider !== "bedrock") {
    return schema ? schema.parse({}) : "{}";
  }
  if (provider === "bedrock") {
    const body = { anthropic_version: "bedrock-2023-05-31", max_tokens: 800, messages: [{ role: "user", content: prompt }] };
    const res = await bedrock.send(new InvokeModelCommand({
      modelId: process.env.BEDROCK_MODEL_ID!,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(body)
    }));
    const txt = JSON.parse(new TextDecoder().decode(res.body as any)).content?.[0]?.text ?? "";
    return schema ? schema.parse(JSON.parse(extractJson(txt))) : txt;
  } else {
    const res = await oai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });
    const txt = res.choices[0].message.content ?? "";
    return schema ? schema.parse(JSON.parse(extractJson(txt))) : txt;
  }
}

function extractJson(s: string) {
  const m = s.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!m) throw new Error("No JSON payload in model output");
  return m[0];
}


