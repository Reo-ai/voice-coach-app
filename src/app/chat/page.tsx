import Link from "next/link";
import Chat from "@/components/Chat";

export const metadata = {
  title: "チャット | ボイスコーチ",
};

export default function ChatPage() {
  return (
    <div className="flex flex-col h-dvh">
      <header className="h-16 shrink-0 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur flex items-center px-4 sm:px-6">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent"
        >
          ボイスコーチ
        </Link>
        <nav className="ml-auto flex items-center gap-3 text-sm">
          <Link
            href="/trainer"
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium"
          >
            トレーナー育成
          </Link>
          <Link
            href="/pitch"
            className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            音域チェック
          </Link>
          <Link
            href="/"
            className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            トップ
          </Link>
        </nav>
      </header>
      <main className="flex-1 min-h-0">
        <Chat />
      </main>
    </div>
  );
}
