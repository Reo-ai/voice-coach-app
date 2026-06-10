import Link from "next/link";
import { notFound } from "next/navigation";
import { CURRICULUM } from "@/lib/trainer-prompt";
import { renderMarkdown } from "@/lib/markdown";

// 章詳細ページ(カリキュラム本文を全部見せる)
// /trainer/curriculum/[id]

export function generateStaticParams() {
  return CURRICULUM.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chapter = CURRICULUM.find((c) => c.id === id);
  if (!chapter) return { title: "カリキュラム | ボイストレーナー育成" };
  return {
    title: `${chapter.title} | ボイストレーナー育成`,
    description: chapter.summary,
  };
}

export default async function CurriculumChapterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chapter = CURRICULUM.find((c) => c.id === id);
  if (!chapter) notFound();

  const currentIndex = CURRICULUM.findIndex((c) => c.id === id);
  const prev = currentIndex > 0 ? CURRICULUM[currentIndex - 1] : null;
  const next =
    currentIndex < CURRICULUM.length - 1 ? CURRICULUM[currentIndex + 1] : null;

  return (
    <div className="min-h-dvh bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
      <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/70 backdrop-blur flex items-center px-4 sm:px-6 sticky top-0 z-10">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent"
        >
          ボイスコーチ
        </Link>
        <span className="ml-3 text-xs text-indigo-600 bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 rounded-full px-2.5 py-1 font-medium hidden sm:inline">
          🎓 トレーナー育成
        </span>
        <nav className="ml-auto flex items-center gap-3 text-sm">
          <Link
            href="/trainer"
            className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            カリキュラム一覧
          </Link>
          <Link
            href="/trainer/chat"
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium"
          >
            AI講師に相談
          </Link>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* パンくず */}
        <div className="text-xs text-neutral-500 mb-4 flex items-center gap-1.5 flex-wrap">
          <Link href="/trainer" className="hover:text-indigo-600">
            トレーナー育成
          </Link>
          <span>›</span>
          <Link href="/trainer#curriculum" className="hover:text-indigo-600">
            カリキュラム
          </Link>
          <span>›</span>
          <span className="text-neutral-700 dark:text-neutral-300">
            {chapter.title}
          </span>
        </div>

        {/* タイトル */}
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
          {chapter.title}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {chapter.summary}
        </p>

        {/* 目次 */}
        <div className="mt-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
            この章の内容
          </h2>
          <ul className="space-y-1.5">
            {chapter.lessons.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {l.title}
                </a>
              </li>
            ))}
          </ul>
          <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mt-5 mb-3">
            キートピック
          </h2>
          <ul className="grid sm:grid-cols-2 gap-1.5">
            {chapter.topics.map((t) => (
              <li
                key={t}
                className="text-xs text-neutral-600 dark:text-neutral-400 flex gap-1.5"
              >
                <span className="text-indigo-400 shrink-0">▸</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* レッスン本文 */}
        <article className="mt-10 space-y-10">
          {chapter.lessons.map((lesson) => (
            <section
              key={lesson.id}
              id={lesson.id}
              className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 scroll-mt-20"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-5">
                {lesson.title}
              </h2>
              <div
                className="lesson-body text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(lesson.body),
                }}
              />
            </section>
          ))}
        </article>

        {/* AI講師CTA */}
        <div className="mt-12 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-7 sm:p-9 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            この章について深掘りしたい?
          </h2>
          <p className="text-sm sm:text-base text-white/90 mb-6">
            AI講師に質問すれば、あなたのレベルに合わせて具体例や演習を提案します。
          </p>
          <Link
            href="/trainer/chat"
            className="inline-flex items-center justify-center rounded-full bg-white text-indigo-600 hover:bg-indigo-50 px-7 py-3 text-sm sm:text-base font-medium shadow-lg transition-colors"
          >
            AI講師に相談する →
          </Link>
        </div>

        {/* 前後ナビ */}
        <div className="mt-10 grid grid-cols-2 gap-3">
          {prev ? (
            <Link
              href={`/trainer/curriculum/${prev.id}`}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 hover:border-indigo-300 transition-colors"
            >
              <div className="text-xs text-neutral-500 mb-1">← 前の章</div>
              <div className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-2">
                {prev.title}
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/trainer/curriculum/${next.id}`}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 hover:border-indigo-300 transition-colors text-right"
            >
              <div className="text-xs text-neutral-500 mb-1">次の章 →</div>
              <div className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-2">
                {next.title}
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/trainer#curriculum"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← カリキュラム一覧へ戻る
          </Link>
        </div>
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 text-center text-xs text-neutral-500 mt-10">
        © {new Date().getFullYear()} ボイスコーチ
      </footer>
    </div>
  );
}
