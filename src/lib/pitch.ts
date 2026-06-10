// 周波数(Hz) → 音名変換ユーティリティ
// A4 = 440Hz を基準に半音単位で計算

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export type NoteInfo = {
  note: string; // "C4", "G#3" など
  octave: number;
  cents: number; // 基準音からのズレ(セント)
  freq: number;
};

export function hzToNote(freq: number): NoteInfo | null {
  if (!isFinite(freq) || freq <= 0) return null;
  // MIDIノート番号(A4=69)
  const midi = 69 + 12 * Math.log2(freq / 440);
  const rounded = Math.round(midi);
  const cents = Math.round((midi - rounded) * 100);
  const noteName = NOTE_NAMES[((rounded % 12) + 12) % 12];
  const octave = Math.floor(rounded / 12) - 1;
  return {
    note: `${noteName}${octave}`,
    octave,
    cents,
    freq,
  };
}

// MIDI番号 → 周波数
export function midiToHz(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// "C4" のような音名 → MIDI番号
export function noteToMidi(noteName: string, octave: number): number {
  const idx = NOTE_NAMES.indexOf(noteName);
  if (idx === -1) return 0;
  return (octave + 1) * 12 + idx;
}
