import { midi, fromMidiSharps } from "@tonaljs/note";
import { Chord } from "@tonaljs/chord";
import * as Interval from "@tonaljs/interval";

/* ---------------------------------------------------------------- *
 * 3)  개방현 → 음  /  5가지 CAGED 폼별 루트 현·프렛 오프셋
 * ---------------------------------------------------------------- */
type Str = 1 | 2 | 3 | 4 | 5 | 6;
const OPEN: Record<Str, string> = {
  6: "E2",
  5: "A2",
  4: "D3",
  3: "G3",
  2: "B3",
  1: "E4",
};

type CAGED = "C" | "A" | "G" | "E" | "D";
const ROOT_ANCHOR: Record<CAGED, { string: Str; dfret: number }> = {
  C: { string: 5, dfret: 0 }, // C‑form : 루트 = 5번 현
  A: { string: 5, dfret: 0 }, // A‑form
  G: { string: 6, dfret: 0 }, // G‑form
  E: { string: 6, dfret: 0 }, // E‑form
  D: { string: 4, dfret: 0 }, // D‑form
};

/* ---------------------------------------------------------------- *
 * 4)  문자열‑프렛 → 음 이름
 * ---------------------------------------------------------------- */
function noteAt(string: Str, fret: number): string {
  const value = midi(OPEN[string])! + fret;
  return fromMidiSharps(value);
}

/* ---------------------------------------------------------------- *
 * 5)  주어진 폼에서 “가장 가까운” 운지 탐색
 *     ─ 범위: 루트 프렛 ± 4프렛
 * ---------------------------------------------------------------- */
function voiceChordOnForm(root: string, intervals: string[], form: CAGED) {
  const wanted = new Set(intervals); // 연주할 인터벌
  const rootInfo = ROOT_ANCHOR[form];
  const rootMidi = midi(root + "3")!; // 옥타브는 대충 잡아도 OK
  const openMidi = midi(OPEN[rootInfo.string])!;
  const rootFret = (rootMidi - openMidi + 120) % 12; // 0‑11 범위 최소값

  // 찾을 프렛 범위
  const MIN = rootFret - 4;
  const MAX = rootFret + 4;

  const fingering: {
    string: Str;
    fret: number;
    note: string | null;
    interval: string | null;
  }[] = [];

  for (let s: Str = 6 as Str; s >= 1; s--) {
    let found = false;

    for (let f = MIN; f <= MAX; f++) {
      if (f < 0) continue;
      const n = noteAt(s, f);
      const iv = Interval.distance(root, n) || "1P";
      if (wanted.has(iv)) {
        fingering.push({ string: s, fret: f, note: n, interval: iv });
        found = true;
        break;
      }
    }

    if (!found) {
      fingering.push({ string: s, fret: 0, note: null, interval: null }); // mute
    }
  }
  return fingering;
}

export type Fingering = ReturnType<typeof voiceChordOnForm>;

/* ---------------------------------------------------------------- *
 * 6)  메인 함수
 *      ─ root = "C", quality = "minor seventh"  등
 * ---------------------------------------------------------------- */
export function getCAGEDChord(
  chord: Chord
): Record<CAGED, ReturnType<typeof voiceChordOnForm>> {
  const { tonic } = chord;

  // 중복 제거·정렬(1‑3‑5‑7‑9‑11‑13)
  const uniq = Array.from(new Set(chord.intervals)).sort(
    (a, b) => Interval.semitones(a) - Interval.semitones(b)
  );

  return {
    C: voiceChordOnForm(tonic!, uniq, "C"),
    A: voiceChordOnForm(tonic!, uniq, "A"),
    G: voiceChordOnForm(tonic!, uniq, "G"),
    E: voiceChordOnForm(tonic!, uniq, "E"),
    D: voiceChordOnForm(tonic!, uniq, "D"),
  };
}
