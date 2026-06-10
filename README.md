# ボイスコーチ

初心者向けのAIボイストレーナーWebアプリ。

- 悩み相談 → 原因分析 → 練習提案 → 宿題作成 までAIが一貫してサポート
- ブラウザだけで動く音域チェック機能(Web Audio API + pitchy)
- Next.js 16 + TypeScript + Tailwind v4 + OpenAI API

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数

`.env.example` をコピーして `.env.local` を作成し、OpenAI APIキーを設定する。

```bash
cp .env.example .env.local
```

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini   # 任意。省略時は gpt-4o-mini
```

API キーは [OpenAI Platform](https://platform.openai.com/api-keys) で発行する。

### 3. 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 を開く。

## ページ構成

| パス | 役割 |
|---|---|
| `/` | ランディング(機能紹介) |
| `/chat` | ボイスコーチAIとのチャット |
| `/pitch` | 音域チェック(マイク使用) |

## 主要ファイル

| ファイル | 役割 |
|---|---|
| `src/lib/system-prompt.ts` | AIの指示書(GPTsから移植) |
| `src/app/api/chat/route.ts` | OpenAIストリーミングAPI |
| `src/components/Chat.tsx` | チャットUI |
| `src/components/PitchDetector.tsx` | 音域検出(pitchy) |
| `src/lib/pitch.ts` | Hz → 音名変換 |

## デプロイ

Vercelが最も簡単。

```bash
npx vercel
```

環境変数 `OPENAI_API_KEY` (必須) と `OPENAI_MODEL` (任意) をVercelの設定画面で登録する。

## ライセンスと注意

- マイク機能はHTTPS環境必須(localhostは例外)。
- OpenAI APIの利用料金はOpenAIアカウントから請求される。
- 本アプリは医療・治療目的の音声トレーニング指導ではない。専門的な指導が必要な場合は専門家へ。

## 今後の拡張候補

- [ ] 認証(NextAuth)
- [ ] Stripeでサブスク課金
- [ ] 録音 → Whisperで文字起こし → AIがフィードバック
- [ ] 練習履歴の保存
- [ ] AI音声での返答(TTS)
