import Link from "next/link";
import PitchDetectorView from "@/components/PitchDetector";

export const metadata = {
  title: "音域チェック | ボイスコーチ",
};

export default function PitchPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-pink-50 via-white to-orange-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
      <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/70 backdrop-blur flex items-center px-4 sm:px-6">
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
            href="/chat"
            className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            チャット
          </Link>
          <Link
            href="/"
            className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            トップ
          </Link>
        </nav>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            音域チェック
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            マイクであなたの最低音と最高音を測定します。
            <br className="hidden sm:block" />
            結果をチャットに渡せば、音域に合わせたアドバイスがもらえます。
          </p>
        </div>
        <PitchDetectorView />
      </main>
    </div>
  );
}
