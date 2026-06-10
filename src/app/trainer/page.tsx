import Link from "next/link";
import { CURRICULUM } from "@/lib/trainer-prompt";

export const metadata = {
  title: "ボイストレーナー育成 | ボイスコーチ",
};

// トレーナー育成のトップページ
// カリキュラム一覧 + AI講師チャットへの導線
export default function TrainerPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
      <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/70 backdrop-blur flex items-center px-4 sm:px-6">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent"
        >
          ボイスコーチ
        </Link>
        <nav className="ml-auto flex items-center gap-3 text-sm">
          <Link
            href="/chat"
            className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            悩み相談
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* ヒーロー */}
        <section className="text-center mb-14">
          <p className="inline-block text-xs sm:text-sm font-medium text-indigo-600 bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 rounded-full px-3 py-1 mb-6">
            ボイストレーナー養成コース
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.15]">
            「歌える」を
            <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              「教えられる」
            </span>
            へ
          </h1>
          <p className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            ボイストレーナーを目指す方のための学習コース。
            発声の仕組み・診断・練習設計・指導コミュニケーションを、
            AI講師が現在地に合わせて一緒に学んでいきます。
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/trainer/chat"
              className="inline-flex items-center justify-center rounded-full bg-indigo-500 hover:bg-indigo-600 text-white px-7 py-3.5 text-base font-medium shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
            >
              AI講師と学習を始める
            </Link>
            <a
              href="#curriculum"
              className="inline-flex items-center justify-center rounded-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-indigo-400 px-7 py-3.5 text-base font-medium transition-colors"
            >
              カリキュラムを見る
            </a>
          </div>
        </section>

        {/* このコースの特徴 */}
        <section className="grid sm:grid-cols-3 gap-5 mb-16">
          <FeatureCard
            emoji="🧠"
            title="知識を体系化"
            text="解剖学・声区・共鳴など、ばらばらに学んだ知識を実用できる形に整理。"
          />
          <FeatureCard
            emoji="🔍"
            title="診断力を養う"
            text="生徒の悩みから原因仮説を立てて、観察ポイントを言語化する訓練。"
          />
          <FeatureCard
            emoji="💬"
            title="伝え方を学ぶ"
            text="技術と同じくらい大事な「指導コミュニケーション」を体系的に。"
          />
        </section>

        {/* カリキュラム */}
        <section id="curriculum" className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-3 text-center">
            カリキュラム
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mb-10">
            全6章。あなたのレベルに合わせて、AI講師が順番をカスタマイズします。
          </p>
          <div className="space-y-4">
            {CURRICULUM.map((c, i) => (
              <ChapterCard key={c.id} index={i + 1} chapter={c} />
            ))}
          </div>
        </section>

        {/* このコースが向いている人 */}
        <section className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-7 sm:p-10 mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-5">
            こんな人におすすめ
          </h2>
          <ul className="space-y-3 text-sm sm:text-base text-neutral-700 dark:text-neutral-300">
            <li className="flex gap-3">
              <span className="text-indigo-500 shrink-0">●</span>
              <span>歌えるけど、教えるとなると言葉に詰まってしまう</span>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-500 shrink-0">●</span>
              <span>副業や本業でボイトレ指導を始めたい</span>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-500 shrink-0">●</span>
              <span>すでに指導しているけど、感覚に頼っていて体系化したい</span>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-500 shrink-0">●</span>
              <span>発声の理論を一度ちゃんと学んでみたい(完全初心者OK)</span>
            </li>
          </ul>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-3">
            まずは現在地のヒアリングから
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
            知識ゼロでも、現役指導者でも、あなたのレベルに合わせてカリキュラムを組み立てます。
          </p>
          <Link
            href="/trainer/chat"
            className="inline-flex items-center justify-center rounded-full bg-indigo-500 hover:bg-indigo-600 text-white px-7 py-3.5 text-base font-medium shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
          >
            AI講師に相談してみる
          </Link>
        </section>
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} ボイスコーチ
      </footer>
    </div>
  );
}

function FeatureCard({
  emoji,
  title,
  text,
}: {
  emoji: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-bold text-lg mb-2 text-neutral-900 dark:text-white">{title}</h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{text}</p>
    </div>
  );
}

function ChapterCard({
  index,
  chapter,
}: {
  index: number;
  chapter: { id: string; title: string; summary: string; topics: string[] };
}) {
  return (
    <Link
      href={`/trainer/curriculum/${chapter.id}`}
      className="block rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 hover:border-indigo-400 hover:shadow-md transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold">
          {index}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white flex items-center gap-2">
            <span>{chapter.title}</span>
            <span className="text-indigo-500 text-sm transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
            {chapter.summary}
          </p>
          <ul className="mt-3 grid sm:grid-cols-2 gap-1.5">
            {chapter.topics.map((t) => (
              <li
                key={t}
                className="text-xs text-neutral-500 dark:text-neutral-400 flex gap-1.5"
              >
                <span className="text-indigo-400">▸</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-xs font-medium text-indigo-600 dark:text-indigo-400">
            内容を読む →
          </div>
        </div>
      </div>
    </Link>
  );
}
