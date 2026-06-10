import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-dvh bg-gradient-to-br from-pink-50 via-white to-orange-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
      {/* ヘッダー */}
      <header className="px-4 sm:px-6 py-5 flex items-center max-w-5xl mx-auto">
        <Link
          href="/"
          className="font-bold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent"
        >
          ボイスコーチ
        </Link>
        <nav className="ml-auto flex items-center gap-4 text-sm">
          <a
            href="#features"
            className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300"
          >
            機能
          </a>
          <a
            href="#how"
            className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300"
          >
            使い方
          </a>
          <Link
            href="/trainer"
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium"
          >
            トレーナー育成
          </Link>
        </nav>
      </header>

      {/* ヒーロー */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-20 pb-16">
        <div className="text-center">
          <p className="inline-block text-xs sm:text-sm font-medium text-pink-600 bg-pink-100 dark:bg-pink-950 dark:text-pink-300 rounded-full px-3 py-1 mb-6">
            初心者向け / 24時間相談OK
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.15] text-neutral-900 dark:text-white">
            あなた専属の
            <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              AIボイストレーナー
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
            「高音が出ない」「音痴を直したい」「サビで裏返る」——
            悩みを聞いて、原因を一緒に分析して、今日から始められる練習メニューを作ります。
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/chat"
              className="inline-flex items-center justify-center rounded-full bg-pink-500 hover:bg-pink-600 text-white px-7 py-3.5 text-base font-medium shadow-lg shadow-pink-500/20 transition-all hover:scale-[1.02]"
            >
              無料で相談を始める
            </Link>
            <Link
              href="/pitch"
              className="inline-flex items-center justify-center rounded-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-pink-400 px-7 py-3.5 text-base font-medium transition-colors"
            >
              音域チェックを試す
            </Link>
          </div>
        </div>
      </section>

      {/* 特徴 */}
      <section id="features" className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-neutral-900 dark:text-white mb-12">
          ボイスコーチでできること
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          <FeatureCard
            emoji="🔍"
            title="原因分析"
            text="今の悩みから、喉締め・息漏れ・脱力不足など、考えられる原因を初心者にも分かる言葉で整理します。"
          />
          <FeatureCard
            emoji="📋"
            title="練習メニュー"
            text="やり方・口の形・成功例・失敗例まで超具体的に説明。「何を意識すればOKか」が明確になります。"
          />
          <FeatureCard
            emoji="🏠"
            title="毎日の宿題"
            text="1日5〜15分でできる現実的な宿題を作成。続けやすいプランで上達をサポートします。"
          />
        </div>
      </section>

      {/* トレーナー育成への導線 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 sm:p-12">
          <div className="grid sm:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <p className="inline-block text-xs font-medium bg-white/20 rounded-full px-3 py-1 mb-3">
                🎓 ボイストレーナーを目指す方へ
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
                「歌える」を「教えられる」へ
              </h2>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl">
                発声の仕組み・診断・練習設計・指導コミュニケーションを学べる、トレーナー育成コースを用意しました。完全初心者から現役指導者まで対応。
              </p>
            </div>
            <Link
              href="/trainer"
              className="inline-flex items-center justify-center rounded-full bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 text-sm sm:text-base font-medium shadow-lg transition-colors whitespace-nowrap"
            >
              コースを見る →
            </Link>
          </div>
        </div>
      </section>

      {/* 使い方 */}
      <section id="how" className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-neutral-900 dark:text-white mb-12">
          使い方は3ステップ
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          <StepCard n={1} title="悩みを話す" text="高音、音痴、自信のなさ。気軽に書いてください。" />
          <StepCard n={2} title="原因を一緒に整理" text="AIが質問を重ねながら、根本原因を探ります。" />
          <StepCard n={3} title="練習を続ける" text="あなた専用のメニューで、毎日少しずつ前進。" />
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/chat"
            className="inline-flex items-center justify-center rounded-full bg-pink-500 hover:bg-pink-600 text-white px-7 py-3.5 text-base font-medium shadow-lg shadow-pink-500/20 transition-all hover:scale-[1.02]"
          >
            今すぐ始める
          </Link>
        </div>
      </section>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} ボイスコーチ
      </footer>
    </main>
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
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-bold text-lg mb-2 text-neutral-900 dark:text-white">{title}</h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{text}</p>
    </div>
  );
}

function StepCard({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 text-white flex items-center justify-center font-bold mb-3">
        {n}
      </div>
      <h3 className="font-bold text-base mb-1.5 text-neutral-900 dark:text-white">{title}</h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{text}</p>
    </div>
  );
}
