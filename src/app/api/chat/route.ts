// OpenAI Chat Completions API へのストリーミングプロキシ
// クライアントから messages を受け取り、SSE で逐次返す

import OpenAI from "openai";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { TRAINER_SYSTEM_PROMPT } from "@/lib/trainer-prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

type ChatMode = "singer" | "trainer";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// モードに応じたシステムプロンプトを返す
function getSystemPrompt(mode: ChatMode): string {
  return mode === "trainer" ? TRAINER_SYSTEM_PROMPT : SYSTEM_PROMPT;
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OPENAI_API_KEY が設定されていません" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  let body: { messages?: ChatMessage[]; mode?: ChatMode };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "不正なリクエストです" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const mode: ChatMode = body.mode === "trainer" ? "trainer" : "singer";
  const messages = body.messages ?? [];
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages が空です" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 直近20メッセージに制限してトークン暴発を防ぐ
  const trimmed = messages.slice(-20).map((m) => ({
    role: m.role,
    content: String(m.content ?? "").slice(0, 4000),
  }));

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await openai.chat.completions.create({
          model: MODEL,
          stream: true,
          temperature: 0.7,
          messages: [
            { role: "system", content: getSystemPrompt(mode) },
            ...trimmed,
          ],
        });

        for await (const chunk of completion) {
          const token = chunk.choices?.[0]?.delta?.content;
          if (token) {
            controller.enqueue(encoder.encode(token));
          }
        }
        controller.close();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "OpenAI APIでエラーが発生しました";
        controller.enqueue(encoder.encode(`\n\n[エラー: ${message}]`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
