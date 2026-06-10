"use client";

import { useEffect, useRef, useState } from "react";
import { PitchDetector as PitchyDetector } from "pitchy";
import { hzToNote, type NoteInfo } from "@/lib/pitch";

type Stats = {
  lowestHz: number;
  highestHz: number;
  lowestNote: NoteInfo | null;
  highestNote: NoteInfo | null;
};

const INITIAL_STATS: Stats = {
  lowestHz: Infinity,
  highestHz: 0,
  lowestNote: null,
  highestNote: null,
};

export default function PitchDetectorView() {
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentNote, setCurrentNote] = useState<NoteInfo | null>(null);
  const [clarity, setClarity] = useState(0);
  const [volume, setVolume] = useState(0);
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const detectorRef = useRef<ReturnType<typeof PitchyDetector.forFloat32Array> | null>(null);
  const bufferRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function start() {
    setError(null);
    setStats(INITIAL_STATS);
    setCurrentNote(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;

      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new Ctx();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      const detector = PitchyDetector.forFloat32Array(analyser.fftSize);
      detectorRef.current = detector;
      bufferRef.current = new Float32Array(new ArrayBuffer(analyser.fftSize * 4));

      setRunning(true);
      tick();
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "マイクへのアクセスが許可されませんでした";
      setError(msg);
    }
  }

  function stop() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    analyserRef.current?.disconnect();
    analyserRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close().catch(() => {});
    }
    audioCtxRef.current = null;
    setRunning(false);
  }

  function tick() {
    const analyser = analyserRef.current;
    const audioCtx = audioCtxRef.current;
    const detector = detectorRef.current;
    const buf = bufferRef.current;
    if (!analyser || !audioCtx || !detector || !buf) return;

    analyser.getFloatTimeDomainData(buf);

    // 音量(RMS)
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    const rms = Math.sqrt(sum / buf.length);
    setVolume(rms);

    const [pitch, clarityVal] = detector.findPitch(buf, audioCtx.sampleRate);

    // 信頼できる値だけを採用(明瞭度高く、音量も最小限ある)
    if (clarityVal > 0.92 && pitch > 60 && pitch < 1200 && rms > 0.01) {
      const note = hzToNote(pitch);
      setCurrentNote(note);
      setClarity(clarityVal);
      setStats((prev) => {
        const lowestHz = Math.min(prev.lowestHz, pitch);
        const highestHz = Math.max(prev.highestHz, pitch);
        return {
          lowestHz,
          highestHz,
          lowestNote: hzToNote(lowestHz),
          highestNote: hzToNote(highestHz),
        };
      });
    } else {
      setCurrentNote(null);
    }

    rafRef.current = requestAnimationFrame(tick);
  }

  function reset() {
    setStats(INITIAL_STATS);
    setCurrentNote(null);
  }

  function copyForChat() {
    const lo = stats.lowestNote?.note ?? "—";
    const hi = stats.highestNote?.note ?? "—";
    const text = `音域チェック結果:\n- 最低音: ${lo} (${Math.round(stats.lowestHz)}Hz)\n- 最高音: ${hi} (${Math.round(stats.highestHz)}Hz)\n\nこの音域から、私に合った練習メニューを提案してください。`;
    navigator.clipboard.writeText(text).catch(() => {});
    alert("結果をコピーしました。チャット画面に貼り付けてください。");
  }

  const volumeBar = Math.min(100, Math.round(volume * 600));

  return (
    <div className="space-y-6">
      {/* 現在のピッチ */}
      <div className="rounded-3xl bg-gradient-to-br from-pink-50 to-orange-50 dark:from-neutral-900 dark:to-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 text-center">
        <p className="text-xs text-neutral-500 mb-3">いまの音</p>
        <div className="text-6xl sm:text-7xl font-bold tabular-nums tracking-tight text-neutral-900 dark:text-white min-h-[80px] flex items-center justify-center">
          {currentNote ? currentNote.note : <span className="text-neutral-300 dark:text-neutral-700">—</span>}
        </div>
        <div className="mt-3 text-sm text-neutral-500 min-h-[20px]">
          {currentNote
            ? `${Math.round(currentNote.freq)} Hz / ${currentNote.cents >= 0 ? "+" : ""}${currentNote.cents}¢`
            : running
              ? "声を出してみてください"
              : "下のボタンで開始"}
        </div>
        {running && (
          <div className="mt-5 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-orange-500 transition-[width] duration-75"
              style={{ width: `${volumeBar}%` }}
            />
          </div>
        )}
        {running && currentNote && (
          <p className="mt-2 text-[11px] text-neutral-400">
            精度 {Math.round(clarity * 100)}%
          </p>
        )}
      </div>

      {/* 操作ボタン */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {!running ? (
          <button
            onClick={start}
            className="rounded-full bg-pink-500 hover:bg-pink-600 text-white px-7 py-3.5 font-medium shadow-lg shadow-pink-500/20 transition-all hover:scale-[1.02]"
          >
            🎤 マイクで開始
          </button>
        ) : (
          <button
            onClick={stop}
            className="rounded-full bg-neutral-800 hover:bg-neutral-900 text-white px-7 py-3.5 font-medium transition-colors"
          >
            停止
          </button>
        )}
        <button
          onClick={reset}
          disabled={stats.highestHz === 0}
          className="rounded-full border border-neutral-300 dark:border-neutral-700 px-7 py-3.5 font-medium hover:border-pink-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          記録をリセット
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-200 p-4 text-sm">
          {error}
        </div>
      )}

      {/* 統計 */}
      <div className="grid sm:grid-cols-2 gap-4">
        <StatCard label="最低音" note={stats.lowestNote} hz={stats.lowestHz === Infinity ? 0 : stats.lowestHz} />
        <StatCard label="最高音" note={stats.highestNote} hz={stats.highestHz} />
      </div>

      {stats.highestHz > 0 && (
        <div className="text-center">
          <button
            onClick={copyForChat}
            className="text-sm text-pink-600 hover:text-pink-700 underline underline-offset-4"
          >
            この結果をコピーしてチャットでアドバイスを受ける
          </button>
        </div>
      )}

      {/* 注意書き */}
      <div className="text-xs text-neutral-500 leading-relaxed bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800">
        <p className="font-medium mb-1">使い方のコツ</p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>静かな場所で行うと精度が上がります</li>
          <li>「あー」と一定の音を伸ばして声を出してみてください</li>
          <li>低い音から少しずつ高い音へ。歌で出る音域を試しましょう</li>
          <li>裏声・地声・両方記録すると、全体の音域が分かります</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({
  label,
  note,
  hz,
}: {
  label: string;
  note: NoteInfo | null;
  hz: number;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
      <p className="text-xs text-neutral-500 mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tabular-nums text-neutral-900 dark:text-white">
          {note ? note.note : "—"}
        </span>
        <span className="text-sm text-neutral-500 tabular-nums">
          {hz > 0 ? `${Math.round(hz)} Hz` : ""}
        </span>
      </div>
    </div>
  );
}
