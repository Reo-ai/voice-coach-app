"use client";

import { useEffect, useRef, useState } from "react";
import { renderMarkdown } from "@/lib/markdown";
import { GREETING_MESSAGE } from "@/lib/system-prompt";
import { TRAINER_GREETING } from "@/lib/trainer-prompt";

type Msg = { role: "user" | "assistant"; content: string };

export type ChatMode = "singer" | "trainer";

type ChatProps = {
  mode?: ChatMode;
};

// モードごとの設定(挨拶文・ストレージキー・UI文言)
const MODE_CONFIG: Record<ChatMode, {
  greeting: string;
  storageKey: string;
  avatar: string;
  placeholder: string;
  accent: string; // tailwindの色トークン用 prefix
}> = {
  singer: {
    greeting: GREETING_MESSAGE,
    storageKey: "voice-coach-chat-v1",
    avatar: "🎤",
    placeholder: "悩みや質問を書いてください…",
    accent: "pink",
  },
  trainer: {
    greeting: TRAINER_GREETING,
    storageKey: "voice-coach-trainer-chat-v1",
    avatar: "🎓",
    placeholder: "学びたいテーマや、生徒の悩みを書いてください…",
    accent: "indigo",
  },
};

export default function Chat({ mode = "singer" }: ChatProps) {
  const config = MODE_CONFIG[mode];
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: config.greeting },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ローカルストレージから復元(モード切り替えで別キーが使われる)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(config.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // 無視
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.storageKey]);

  // 保存
  useEffect(() => {
    try {
      localStorage.setItem(config.storageKey, JSON.stringify(messages));
    } catch {
      // 無視
    }
  }, [messages, config.storageKey]);

  // 自動スクロール
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    // assistantの空メッセージを追加してストリーミングで埋めていく
    setMessages([...next, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, mode }),
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || "応答に失敗しました");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "エラーが発生しました";
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: `すみません、エラーが起きました: ${msg}`,
        };
        return copy;
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter で送信、Shift+Enter で改行
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  }

  function reset() {
    if (!confirm("会話をリセットしますか?")) return;
    setMessages([{ role: "assistant", content: config.greeting }]);
  }

  // アクセント色のクラス名(モードで切り替え)
  const isTrainer = mode === "trainer";
  const sendBtnClass = isTrainer
    ? "bg-indigo-500 hover:bg-indigo-600"
    : "bg-pink-500 hover:bg-pink-600";
  const userBubbleClass = isTrainer ? "bg-indigo-500" : "bg-pink-500";
  const avatarBgClass = isTrainer
    ? "from-indigo-400 to-purple-400"
    : "from-pink-400 to-orange-400";
  const focusBorderClass = isTrainer
    ? "focus-within:border-indigo-400"
    : "focus-within:border-pink-400";

  return (
    <div className="flex flex-col h-[calc(100dvh-64px)]">
      {/* メッセージ */}
      <div
        ref={scrollerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6"
      >
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((m, i) => (
            <Bubble
              key={i}
              role={m.role}
              content={m.content}
              avatar={config.avatar}
              userBubbleClass={userBubbleClass}
              avatarBgClass={avatarBgClass}
            />
          ))}
          {loading && messages[messages.length - 1]?.content === "" && (
            <div className="flex gap-2 text-neutral-400 text-sm pl-2">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse [animation-delay:120ms]">●</span>
              <span className="animate-pulse [animation-delay:240ms]">●</span>
            </div>
          )}
        </div>
      </div>

      {/* 入力欄 */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur">
        <div className="max-w-2xl mx-auto p-3 sm:p-4">
          <div className={`flex items-end gap-2 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 shadow-sm ${focusBorderClass} transition-colors`}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={config.placeholder}
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-sm sm:text-base py-1.5 max-h-40"
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className={`shrink-0 rounded-full ${sendBtnClass} disabled:bg-neutral-300 dark:disabled:bg-neutral-700 text-white px-4 py-2 text-sm font-medium transition-colors`}
            >
              送信
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500">
            <span>Enter送信 / Shift+Enter改行</span>
            <button
              onClick={reset}
              className="hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              会話をリセット
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({
  role,
  content,
  avatar,
  userBubbleClass,
  avatarBgClass,
}: {
  role: "user" | "assistant";
  content: string;
  avatar: string;
  userBubbleClass: string;
  avatarBgClass: string;
}) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className={`max-w-[85%] rounded-2xl rounded-tr-sm ${userBubbleClass} text-white px-4 py-2.5 text-sm sm:text-[15px] whitespace-pre-wrap`}>
          {content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start gap-2">
      <div className={`shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${avatarBgClass} flex items-center justify-center text-white text-sm`}>
        {avatar}
      </div>
      <div
        className="max-w-[85%] rounded-2xl rounded-tl-sm bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 px-4 py-2.5 text-sm sm:text-[15px] prose-sm"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
      />
    </div>
  );
}
