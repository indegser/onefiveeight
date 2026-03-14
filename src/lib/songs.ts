export type SongMeasure = {
  id: string;
  chord?: string;
  cue?: string;
  analysis?: string;
  span?: number;
};

export type SongSystem = {
  id: string;
  label?: string;
  annotation?: string;
  repeat?: string;
  jump?: string;
  ending?: string;
  timeSignature?: string;
  footer?: string;
  measures: SongMeasure[];
};

export type SongSection = {
  id: string;
  title: string;
  annotation?: string;
  systems: SongSystem[];
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  source: string;
  keyCenter: string;
  feel: string;
  meter: string;
  summary: string;
  chartNotes: string[];
  sections: SongSection[];
};

export function getSongSystemCount(song: Song) {
  return song.sections.reduce(
    (count, section) => count + section.systems.length,
    0,
  );
}

export const songs: Song[] = [
  {
    id: "gieog-ui-seupjak",
    title: "기억의 습작",
    artist: "전람회",
    source: "Lead-sheet draft from photographed chart",
    keyCenter: "Ambiguous / review pending",
    feel: "Ballad",
    meter: "Not explicitly marked",
    summary:
      "Provisional chart seeded from the photographed lead sheet and kept intentionally conservative where the handwriting or jump cues remain unresolved.",
    chartNotes: [
      "This entry is a draft seeded from the current lead-sheet extraction run.",
      "Some bars contain multiple visible chord symbols but the exact beat split is not yet verified.",
      "Ending jump text and one lower-system chord remain ambiguous in the source image.",
    ],
    sections: [
      {
        id: "verse",
        title: "Verse",
        systems: [
          {
            id: "verse-a",
            label: "Verse",
            jump: "Coda",
            measures: [
              { id: "v1", chord: "Cadd9" },
              { id: "v2", chord: "Em7/Bb" },
              { id: "v3", chord: "Absus4" },
              { id: "v4", chord: "A7" },
            ],
          },
          {
            id: "verse-b",
            measures: [
              { id: "v5", chord: "Em/Ab" },
              { id: "v6", chord: "C/G" },
              { id: "v7", chord: "D/F#" },
              { id: "v8", chord: "Gsus4" },
            ],
          },
        ],
      },
      {
        id: "section-1",
        title: "Section 1",
        systems: [
          {
            id: "section-1-a",
            measures: [
              { id: "s1", chord: "Cmaj7" },
              { id: "s2", chord: "Fmaj7" },
              { id: "s3", chord: "Cmaj7" },
              { id: "s4", chord: "Fmaj7" },
            ],
          },
        ],
      },
      {
        id: "section-2",
        title: "Section 2",
        annotation: "Last two bars need review",
        systems: [
          {
            id: "section-2-a",
            measures: [
              { id: "s5", chord: "Cmaj7" },
              { id: "s6", chord: "Bbsus4" },
              { id: "s7", chord: "Ebmaj7" },
              { id: "s8", chord: "Db -> Ebsus4" },
            ],
          },
        ],
      },
      {
        id: "chorus-a",
        title: "Chorus",
        annotation:
          "Combined chord strings reflect unresolved intra-bar splits",
        systems: [
          {
            id: "chorus-a1",
            jump: "Segno",
            measures: [
              { id: "c1", chord: "Abmaj7 Gm7" },
              { id: "c2", chord: "Fm7 Bb7" },
              { id: "c3", chord: "Gm7" },
              { id: "c4", chord: "Cm7 Em7/Bb" },
            ],
          },
          {
            id: "chorus-a2",
            measures: [
              { id: "c5", chord: "F/A" },
              { id: "c6", chord: "Fm7" },
              { id: "c7", chord: "Bbsus4" },
              { id: "c8", chord: "Bb9" },
            ],
          },
          {
            id: "chorus-a3",
            measures: [
              { id: "c9", chord: "Ebmaj7 Abmaj7" },
              { id: "c10", chord: "Gm7 C7(b9)" },
              { id: "c11", chord: "Fm7 Bb7" },
              { id: "c12", chord: "Gm7 Cm7/Bb" },
            ],
          },
          {
            id: "chorus-a4",
            ending: "Fade out",
            measures: [
              { id: "c13", chord: "F/A" },
              { id: "c14", chord: "Abm6" },
              { id: "c15", chord: "Eb/G" },
              { id: "c16", chord: "Fm7 Bb7" },
            ],
          },
        ],
      },
      {
        id: "interlude",
        title: "Interlude",
        systems: [
          {
            id: "interlude-a",
            measures: [
              { id: "i1", chord: "G" },
              { id: "i2", chord: "D/F#" },
              { id: "i3", chord: "Em7" },
              { id: "i4", chord: "G/D" },
            ],
          },
        ],
      },
      {
        id: "ending-turn",
        title: "Ending Turn",
        annotation: "Ending cadence remains partially provisional",
        systems: [
          {
            id: "ending-turn-a",
            measures: [
              { id: "e1", chord: "Cmaj7" },
              { id: "e2", chord: "G/B" },
              { id: "e3", chord: "Am7" },
              { id: "e4", chord: "D Bbsus4" },
            ],
          },
          {
            id: "ending-turn-b",
            jump: "D.S.",
            measures: [
              { id: "e5", chord: "Ebmaj7" },
              { id: "e6", chord: "Db -> Ebsus4" },
              { id: "e7", chord: "Bbsus4" },
              { id: "e8", chord: "G7" },
            ],
          },
        ],
      },
      {
        id: "chorus-b",
        title: "Chorus Reprise",
        annotation: "Lower ending system remains provisional",
        systems: [
          {
            id: "chorus-b1",
            measures: [
              { id: "r1", chord: "Cmaj7 Emaj7" },
              { id: "r2", chord: "Em7 A7" },
              { id: "r3", chord: "Dm7 G" },
              { id: "r4", chord: "Em7 Am7/G" },
            ],
          },
          {
            id: "chorus-b2",
            jump: "D.S.",
            measures: [
              { id: "r5", chord: "D/F#" },
              { id: "r6", chord: "Fmb" },
              { id: "r7", chord: "C/E" },
              { id: "r8", chord: "Dm7 Bbsus4" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "dont-want-to-miss-a-thing",
    title: "I Don't Want to Miss a Thing",
    artist: "Aerosmith",
    source: "Handwritten copy",
    keyCenter: "D major / E intro pedal",
    feel: "Power ballad",
    meter: "4/4 with 2/4 tag",
    summary:
      "Digitized from the photographed handwritten chart, preserving section labels, slash chords, repeats, D.S. cue, and fade-out ending.",
    chartNotes: [
      "Intro begins on the E-side vamp before settling into the D-major body.",
      "The late verse tag uses a 2/4 bar before the D.S. return.",
      "Ending moves into a two-pass cue and then a fade-out vamp.",
    ],
    sections: [
      {
        id: "intro",
        title: "Intro",
        systems: [
          {
            id: "intro-a",
            label: "Intro",
            measures: [
              { id: "i1", chord: "Bsus4" },
              { id: "i2", chord: "C#m7" },
              { id: "i3", chord: "E", span: 2, cue: "hold" },
              { id: "i4", chord: "Bsus4" },
              { id: "i5", chord: "C#m7" },
              { id: "i6", chord: "E" },
            ],
          },
        ],
      },
      {
        id: "verse",
        title: "Verse",
        annotation: "Two identical passes",
        systems: [
          {
            id: "verse-a",
            label: "Verse",
            measures: [
              { id: "v1", chord: "D" },
              { id: "v2", chord: "A/C#" },
              { id: "v3", chord: "Bm7" },
              { id: "v4", chord: "G" },
              { id: "v5", chord: "D/F#" },
              { id: "v6", chord: "Em7" },
            ],
          },
          {
            id: "verse-b",
            measures: [
              { id: "v7", chord: "D" },
              { id: "v8", chord: "A/C#" },
              { id: "v9", chord: "Bm7" },
              { id: "v10", chord: "G" },
              { id: "v11", chord: "D/F#" },
              { id: "v12", chord: "Em7" },
            ],
          },
        ],
      },
      {
        id: "lift",
        title: "Lift",
        annotation: "Turnaround into the down chorus",
        systems: [
          {
            id: "lift-a",
            measures: [
              { id: "l1", chord: "F#m7" },
              { id: "l2", chord: "G" },
              { id: "l3", chord: "A9sus4", span: 2, cue: "let ring" },
            ],
          },
        ],
      },
      {
        id: "chorus",
        title: "Down Chorus",
        annotation: "Broad sustained voicings",
        systems: [
          {
            id: "chorus-a",
            label: "Down",
            measures: [
              { id: "c1", chord: "D" },
              { id: "c2", chord: "A/C#" },
              { id: "c3", chord: "Em7" },
              { id: "c4", chord: "G" },
              { id: "c5", chord: "A7 D", cue: "push" },
              { id: "c6", chord: "A/C#" },
            ],
          },
          {
            id: "chorus-b",
            measures: [
              { id: "c7", chord: "Em7" },
              { id: "c8", chord: "G" },
              { id: "c9", chord: "A7 D", cue: "hit" },
              { id: "c10", chord: "A/C#" },
              { id: "c11", chord: "Em7" },
            ],
          },
        ],
      },
      {
        id: "verse-reprise",
        title: "Verse Reprise",
        systems: [
          {
            id: "verse-c",
            label: "Verse",
            measures: [
              { id: "vr1", chord: "D" },
              { id: "vr2", chord: "A/C#" },
              { id: "vr3", chord: "Bm7" },
              { id: "vr4", chord: "G" },
              { id: "vr5", chord: "D/F#" },
              { id: "vr6", chord: "Em7" },
            ],
          },
          {
            id: "verse-tag",
            measures: [
              { id: "vt1", chord: "D" },
              { id: "vt2", chord: "A/C#" },
              { id: "vt3", chord: "Bm7" },
              { id: "vt4", chord: "D", cue: "2/4 tag" },
            ],
            timeSignature: "2/4",
            jump: "D.S.",
            footer: "Short tag before returning with the sign cue.",
          },
        ],
      },
      {
        id: "bridge",
        title: "Bridge",
        systems: [
          {
            id: "bridge-a",
            label: "Bridge",
            measures: [
              { id: "b1", chord: "C" },
              { id: "b2", chord: "G/B" },
              { id: "b3", chord: "Bb" },
              { id: "b4", chord: "F/A" },
            ],
          },
          {
            id: "bridge-b",
            measures: [
              { id: "b5", chord: "C" },
              { id: "b6", chord: "G/B" },
              { id: "b7", chord: "Dm" },
              { id: "b8", chord: "A7sus4" },
              { id: "b9", chord: "A7" },
            ],
          },
        ],
      },
      {
        id: "ending",
        title: "Ending",
        systems: [
          {
            id: "ending-a",
            label: "Ending",
            repeat: "2x only",
            measures: [
              { id: "e1", chord: "D" },
              { id: "e2", chord: "A/C#" },
              { id: "e3", chord: "Em7" },
              { id: "e4", chord: "G" },
              { id: "e5", chord: "A7 D", cue: "downbeat" },
              { id: "e6", chord: "A/C#", cue: "(Bm7)" },
            ],
          },
          {
            id: "ending-b",
            ending: "Fade out",
            repeat: "4x",
            measures: [
              { id: "e7", chord: "Em7" },
              { id: "e8", chord: "G" },
              { id: "e9", chord: "A7", cue: "vamp" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "harbor-signal",
    title: "Harbor Signal",
    artist: "Copied study",
    source: "Lead-sheet mock",
    keyCenter: "D major",
    feel: "Folk lift",
    meter: "4/4",
    summary:
      "Compact acoustic chart focused on slash-chord motion and a straight verse-to-chorus form.",
    chartNotes: [
      "Verse and chorus stay compact for quick acoustic reading.",
      "Outro collapses the final cadence into one closing system.",
    ],
    sections: [
      {
        id: "verse",
        title: "Verse",
        systems: [
          {
            id: "hs-v1",
            label: "Verse",
            measures: [
              { id: "hs-v1-1", chord: "D" },
              { id: "hs-v1-2", chord: "A/C#" },
              { id: "hs-v1-3", chord: "Bm7" },
              { id: "hs-v1-4", chord: "G" },
            ],
          },
          {
            id: "hs-v2",
            measures: [
              { id: "hs-v2-1", chord: "D" },
              { id: "hs-v2-2", chord: "A/C#" },
              { id: "hs-v2-3", chord: "G" },
              { id: "hs-v2-4", chord: "A" },
            ],
          },
        ],
      },
      {
        id: "chorus",
        title: "Chorus",
        annotation: "Open voice on the last bar",
        systems: [
          {
            id: "hs-c1",
            label: "Chorus",
            measures: [
              { id: "hs-c1-1", chord: "G" },
              { id: "hs-c1-2", chord: "D/F#" },
              { id: "hs-c1-3", chord: "Em7" },
              { id: "hs-c1-4", chord: "A" },
            ],
          },
          {
            id: "hs-c2",
            measures: [
              { id: "hs-c2-1", chord: "G" },
              { id: "hs-c2-2", chord: "D/F#" },
              { id: "hs-c2-3", chord: "Em7 A", cue: "split bar" },
              { id: "hs-c2-4", chord: "D" },
            ],
          },
        ],
      },
      {
        id: "outro",
        title: "Outro",
        systems: [
          {
            id: "hs-o1",
            label: "Outro",
            ending: "Let ring",
            measures: [
              { id: "hs-o1-1", chord: "D" },
              { id: "hs-o1-2", chord: "A/C#" },
              { id: "hs-o1-3", chord: "Bm7" },
              { id: "hs-o1-4", chord: "G A D", cue: "walk out" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "goodbye",
    title: "굿바이",
    artist: "에어 서플라이",
    source:
      "사용자가 전달한 MP3 전체 트랙과 기존 외부 코드 차트를 함께 대조해 정리한 디지털 차트.",
    keyCenter: "내림마장조를 중심으로 후반부에 올림바장조와 바장조로 전조",
    feel: "파워 발라드",
    meter: "4/4 (full-track audio hint)",
    summary:
      "외부 차트 시드를 MP3 전체 트랙 분석으로 다시 대조한 실용 차트로, 벌스-프리코러스-코러스 구분과 후반 전조 클라이맥스는 유지하되 오디오 추정 특유의 불확실성은 차트 노트에 남겼다.",
    chartNotes: [
      "곡 제목: 굿바이",
      "조성: 내림마장조를 중심으로 진행하다가 후반부에 올림바장조 성격의 상승을 거쳐 마지막에는 바장조 코다로 정리된다.",
      "오디오 분석: Demucs + librosa 전체 트랙 분석에서 약 65 bars, 57 chord spans, meter hint 4/4, tempo 약 66 BPM으로 집계됐다.",
      "대조 결과: 오디오 드래프트는 Eb 출발, F# 리프트, 마지막 F 코다를 전반적으로 지지했지만, 중간의 sus/secondary dominant 계열은 확률적 결과라 기존 실용 차트를 우선 유지했다.",
      "비교 메모: lead-sheets/goodbye.md에는 같은 진행을 바탕으로 한 7th 후보 버전 비교표를 함께 남겼다.",
      "코드 진행 특성: 기본적으로 안정적인 발라드 어법을 따르며, 프리코러스와 코러스에서 긴장을 키우고 마지막 전조로 클라이맥스를 만든다.",
    ],
    sections: [
      {
        id: "verse-1",
        title: "Verse 1",
        systems: [
          {
            id: "gb-v1",
            label: "Verse 1",
            measures: [
              {
                id: "gb-v1-1",
                chord: "Eb",
                analysis: "토닉으로 차분하게 출발한다.",
              },
              {
                id: "gb-v1-2",
                chord: "Gm",
                analysis: "3도 화음으로 옮겨 서정성을 만든다.",
              },
              {
                id: "gb-v1-3",
                chord: "Cm",
                analysis: "6도 단조로 내려가 감정을 가라앉힌다.",
              },
              {
                id: "gb-v1-4",
                chord: "Fm Bb",
                cue: "split bar",
                analysis: "ii-V 진행으로 다음 구절을 자연스럽게 준비한다.",
              },
            ],
          },
          {
            id: "gb-v2",
            measures: [
              {
                id: "gb-v2-1",
                chord: "Eb",
                analysis: "첫 마디를 반복해 안정감을 유지한다.",
              },
              {
                id: "gb-v2-2",
                chord: "Gm",
                analysis: "같은 상행 연결로 보컬 선율을 받쳐준다.",
              },
              {
                id: "gb-v2-3",
                chord: "Cm",
                analysis: "벌스의 회상적인 정서를 계속 끌고 간다.",
              },
              {
                id: "gb-v2-4",
                chord: "Fm Bb",
                cue: "split bar",
                analysis: "다시 ii-V로 종지를 미루며 긴장을 쌓는다.",
              },
            ],
          },
        ],
      },
      {
        id: "pre-chorus-1",
        title: "Pre-Chorus",
        systems: [
          {
            id: "gb-p1",
            label: "Pre-Chorus",
            measures: [
              {
                id: "gb-p1-1",
                chord: "Eb",
                analysis: "토닉을 다시 확인하며 후렴 진입을 예고한다.",
              },
              {
                id: "gb-p1-2",
                chord: "Cm",
                analysis: "6도 단조가 감정 밀도를 한 단계 높인다.",
              },
              {
                id: "gb-p1-3",
                chord: "Ab",
                analysis: "IV로 넓어지며 후렴 직전의 개방감을 만든다.",
              },
              {
                id: "gb-p1-4",
                chord: "Bb",
                analysis: "도미넌트가 후렴으로 강하게 끌어당긴다.",
              },
            ],
          },
          {
            id: "gb-p2",
            measures: [
              { id: "gb-p2-1", chord: "Eb", analysis: "같은 기능 반복으로 기대감을 유지한다." },
              { id: "gb-p2-2", chord: "Cm", analysis: "여전히 vi에 머물며 감정을 눌러 둔다." },
              { id: "gb-p2-3", chord: "Ab", analysis: "후렴 직전의 공간감을 다시 넓힌다." },
              { id: "gb-p2-4", chord: "Bb", analysis: "V에서 멈추며 후렴 직전 긴장을 최대로 만든다." },
            ],
          },
        ],
      },
      {
        id: "chorus-1",
        title: "Chorus",
        systems: [
          {
            id: "gb-c1",
            label: "Chorus",
            measures: [
              {
                id: "gb-c1-1",
                chord: "Eb",
                analysis: "후렴도 토닉에서 시작해 메시지를 분명히 세운다.",
              },
              {
                id: "gb-c1-2",
                chord: "Ab",
                analysis: "IV가 시야를 넓히며 감정을 펼친다.",
              },
              {
                id: "gb-c1-3",
                chord: "Fm",
                analysis: "ii로 이동해 다음 전개를 준비한다.",
              },
              {
                id: "gb-c1-4",
                chord: "C Fm Bb",
                cue: "turnaround",
                analysis:
                  "비다이아토닉 C가 Fm을 강하게 밀어주며 후렴의 감정을 끌어올린다.",
              },
            ],
          },
          {
            id: "gb-c2",
            measures: [
              { id: "gb-c2-1", chord: "Eb", analysis: "토닉 복귀로 후렴 첫 문장을 정리한다." },
              { id: "gb-c2-2", chord: "Ab", analysis: "여운을 넓게 유지한다." },
              { id: "gb-c2-3", chord: "Fm", analysis: "종지 전의 완충 지점으로 작동한다." },
              {
                id: "gb-c2-4",
                chord: "C Fm Bb Eb",
                cue: "resolve",
                analysis: "순간적인 긴장 뒤 정식 종지로 떨어지며 후렴을 완결한다.",
              },
            ],
          },
        ],
      },
      {
        id: "verse-2",
        title: "Verse 2 Lift",
        annotation: "Whole-step and a half lift from the opening key",
        systems: [
          {
            id: "gb-v3",
            label: "Verse 2",
            measures: [
              {
                id: "gb-v3-1",
                chord: "F#",
                analysis: "전조 직후 새 토닉이 등장하며 분위기를 환기한다.",
              },
              {
                id: "gb-v3-2",
                chord: "Bbm",
                analysis: "새 키 안에서도 3도 단조 연결을 유지한다.",
              },
              {
                id: "gb-v3-3",
                chord: "Ebm",
                analysis: "이전 벌스의 vi 기능을 평행 이동한 자리다.",
              },
              {
                id: "gb-v3-4",
                chord: "Abm C#",
                cue: "split bar",
                analysis: "전조된 키에서도 ii-V로 같은 문법을 반복한다.",
              },
            ],
          },
          {
            id: "gb-v4",
            measures: [
              { id: "gb-v4-1", chord: "F#", analysis: "새 토닉을 한 번 더 각인한다." },
              { id: "gb-v4-2", chord: "Ebm", analysis: "감정을 눌러 주며 후렴 재진입을 준비한다." },
              { id: "gb-v4-3", chord: "B", analysis: "IV로 열리며 시야를 다시 넓힌다." },
              { id: "gb-v4-4", chord: "C#", analysis: "도미넌트 기능으로 재진입 힘을 만든다." },
            ],
          },
        ],
      },
      {
        id: "chorus-2",
        title: "Chorus Return",
        annotation: "Returns to the earlier chorus shape before the final lift",
        systems: [
          {
            id: "gb-c3",
            label: "Chorus",
            measures: [
              { id: "gb-c3-1", chord: "Eb", analysis: "익숙한 후렴 복귀로 청자를 다시 붙잡는다." },
              { id: "gb-c3-2", chord: "Ab", analysis: "후렴의 넓은 호흡을 유지한다." },
              { id: "gb-c3-3", chord: "Fm", analysis: "다음 긴장을 받치기 위한 준비 지점이다." },
              {
                id: "gb-c3-4",
                chord: "C Fm Bb",
                cue: "turnaround",
                analysis: "후반 클라이맥스를 위해 긴장을 다시 끌어올린다.",
              },
            ],
          },
          {
            id: "gb-c4",
            measures: [
              { id: "gb-c4-1", chord: "Eb", analysis: "종지 대신 다음 전조를 위한 발판으로 쓴다." },
              { id: "gb-c4-2", chord: "Ab", analysis: "감정을 넓게 유지한 채 멈춘다." },
              { id: "gb-c4-3", chord: "Fm", analysis: "전조 직전 숨을 고르는 위치다." },
              {
                id: "gb-c4-4",
                chord: "C Fm Bb",
                cue: "hold for lift",
                analysis: "완전 종지 대신 긴장을 남겨 마지막 상승을 준비한다.",
              },
            ],
          },
        ],
      },
      {
        id: "final-chorus",
        title: "Final Chorus",
        annotation: "Last coda in F",
        systems: [
          {
            id: "gb-f1",
            label: "Final Chorus",
            measures: [
              {
                id: "gb-f1-1",
                chord: "F",
                analysis: "마지막 전조 뒤의 새 토닉이 클라이맥스를 만든다.",
              },
              {
                id: "gb-f1-2",
                chord: "Bb",
                analysis: "IV가 후렴을 더 크게 열어 준다.",
              },
              {
                id: "gb-f1-3",
                chord: "Gm",
                analysis: "같은 후렴 문법을 새 키에서 반복한다.",
              },
              {
                id: "gb-f1-4",
                chord: "D Gm C",
                cue: "turnaround",
                analysis: "새 키에서도 긴장-해소 문법을 유지해 절정을 고정한다.",
              },
            ],
          },
          {
            id: "gb-f2",
            ending: "Goodbye",
            measures: [
              { id: "gb-f2-1", chord: "F", analysis: "마지막 진술을 토닉에서 안정시킨다." },
              { id: "gb-f2-2", chord: "Bb", analysis: "여운을 넓게 남긴다." },
              { id: "gb-f2-3", chord: "Gm", analysis: "완전 종지 직전 감정을 한 번 더 모은다." },
              {
                id: "gb-f2-4",
                chord: "D Gm C F",
                cue: "final resolve",
                analysis: "모든 긴장을 토닉으로 해소하며 곡을 마무리한다.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "glass-elevator",
    title: "Glass Elevator",
    artist: "Copied study",
    source: "Lead-sheet mock",
    keyCenter: "A minor",
    feel: "Modern groove",
    meter: "4/4",
    summary:
      "Short-form groove chart with riff notation cues and a stronger bridge lift.",
    chartNotes: [
      "Main riff stays clipped and repetitive for quick loop reading.",
      "Bridge adds more harmonic motion before returning to the riff.",
    ],
    sections: [
      {
        id: "riff",
        title: "Main Riff",
        systems: [
          {
            id: "ge-r1",
            label: "Riff",
            repeat: "2x",
            measures: [
              { id: "ge-r1-1", chord: "Am7" },
              { id: "ge-r1-2", chord: "C/E" },
              { id: "ge-r1-3", chord: "Fmaj7" },
              { id: "ge-r1-4", chord: "Em7" },
            ],
            footer: "Keep the rhythm clipped and percussive.",
          },
        ],
      },
      {
        id: "verse",
        title: "Verse",
        systems: [
          {
            id: "ge-v1",
            label: "Verse",
            measures: [
              { id: "ge-v1-1", chord: "Am7" },
              { id: "ge-v1-2", chord: "C/E" },
              { id: "ge-v1-3", chord: "Fmaj7" },
              { id: "ge-v1-4", chord: "Em7" },
            ],
          },
          {
            id: "ge-v2",
            measures: [
              { id: "ge-v2-1", chord: "Dm7" },
              { id: "ge-v2-2", chord: "G13" },
              { id: "ge-v2-3", chord: "Cmaj7" },
              { id: "ge-v2-4", chord: "E7#9" },
            ],
          },
        ],
      },
      {
        id: "bridge",
        title: "Bridge",
        annotation: "Build the dynamic ceiling",
        systems: [
          {
            id: "ge-b1",
            label: "Bridge",
            measures: [
              { id: "ge-b1-1", chord: "Fmaj7" },
              { id: "ge-b1-2", chord: "G" },
              { id: "ge-b1-3", chord: "Em7" },
              { id: "ge-b1-4", chord: "Am7" },
            ],
          },
          {
            id: "ge-b2",
            measures: [
              { id: "ge-b2-1", chord: "Dm7" },
              { id: "ge-b2-2", chord: "G" },
              { id: "ge-b2-3", chord: "Cmaj7" },
              { id: "ge-b2-4", chord: "E7#9" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "die-with-a-smile",
    title: "Die With a Smile",
    artist: "Lady Gaga, Bruno Mars",
    source: "Musically cleaned chart derived from the full-track Demucs draft",
    keyCenter: "A major with strong F# minor pull",
    feel: "Ballad duet",
    meter: "4/4 ballad feel",
    summary:
      "Cleaned into a human-readable pop ballad chart from the full-track audio draft, preserving the overall A-major center and the recurring iii-vi-ii-V motion.",
    chartNotes: [
      "This version is musically cleaned from the audio-derived draft rather than copied from a published lead sheet.",
      "The chart treats A as the home key while keeping the strong C#m and F#m pull that colors the song.",
      "Questionable chromatic MIR labels were normalized into a more playable functional chart.",
      "Use this as a practical working chart, not as an engraved reference edition.",
    ],
    sections: [
      {
        id: "dws-intro",
        title: "Intro",
        annotation: "Sets up the A-major center through a longer turnaround",
        systems: [
          {
            id: "dws-intro-a",
            label: "Intro",
            measures: [
              { id: "dws-i-1", chord: "D", analysis: "IV opens the chart with a suspended, spacious color." },
              { id: "dws-i-2", chord: "A", analysis: "I answers quickly to establish the home center." },
              { id: "dws-i-3", chord: "C#m", analysis: "iii begins the relative-minor pull." },
              { id: "dws-i-4", chord: "F#7", analysis: "VI7 pushes forward like a secondary dominant." },
            ],
          },
          {
            id: "dws-intro-b",
            measures: [
              { id: "dws-i-5", chord: "Bm", analysis: "ii softens the dominant setup into the body of the song." },
              { id: "dws-i-6", chord: "E7", analysis: "V7 points back to A without rushing the resolution." },
              { id: "dws-i-7", chord: "C#m", analysis: "iii keeps the bittersweet color in front." },
              { id: "dws-i-8", chord: "F#m", analysis: "vi lands the intro in the relative-minor shade." },
            ],
          },
        ],
      },
      {
        id: "dws-verse-1",
        title: "Verse 1",
        annotation: "Main ballad cycle: ii-V and iii-vi trade off repeatedly",
        systems: [
          {
            id: "dws-v1-a",
            label: "Verse",
            measures: [
              { id: "dws-v1-1", chord: "Bm", analysis: "ii" },
              { id: "dws-v1-2", chord: "E7", analysis: "V7" },
              { id: "dws-v1-3", chord: "C#m", analysis: "iii" },
              { id: "dws-v1-4", chord: "F#m", analysis: "vi" },
            ],
          },
          {
            id: "dws-v1-b",
            measures: [
              { id: "dws-v1-5", chord: "Bm", analysis: "ii" },
              { id: "dws-v1-6", chord: "E7", analysis: "V7" },
              { id: "dws-v1-7", chord: "A", analysis: "I" },
              { id: "dws-v1-8", chord: "A", analysis: "I" },
            ],
          },
          {
            id: "dws-v1-c",
            measures: [
              { id: "dws-v1-9", chord: "A", analysis: "I" },
              { id: "dws-v1-10", chord: "A", analysis: "I" },
              { id: "dws-v1-11", chord: "D", analysis: "IV" },
              { id: "dws-v1-12", chord: "A", analysis: "I" },
            ],
          },
          {
            id: "dws-v1-d",
            measures: [
              { id: "dws-v1-13", chord: "A", analysis: "I" },
              { id: "dws-v1-14", chord: "D", analysis: "IV" },
              { id: "dws-v1-15", chord: "A", analysis: "I" },
              { id: "dws-v1-16", chord: "A", analysis: "I" },
            ],
          },
        ],
      },
      {
        id: "dws-pre-1",
        title: "Pre-Chorus",
        annotation: "The song leans back into iii-vi-ii-V before opening out",
        systems: [
          {
            id: "dws-p1-a",
            label: "Pre",
            measures: [
              { id: "dws-p1-1", chord: "A", analysis: "I stabilizes the center before the lift." },
              { id: "dws-p1-2", chord: "C#m", analysis: "iii" },
              { id: "dws-p1-3", chord: "F#m", analysis: "vi" },
              { id: "dws-p1-4", chord: "Bm", analysis: "ii" },
            ],
          },
          {
            id: "dws-p1-b",
            measures: [
              { id: "dws-p1-5", chord: "E7", analysis: "V7" },
              { id: "dws-p1-6", chord: "C#m", analysis: "iii" },
              { id: "dws-p1-7", chord: "F#m", analysis: "vi" },
              { id: "dws-p1-8", chord: "Bm E7", cue: "turnaround", analysis: "ii-V pushes into the chorus." },
            ],
          },
        ],
      },
      {
        id: "dws-chorus-1",
        title: "Chorus",
        annotation: "Keeps the relative-minor color inside a pop-functional frame",
        systems: [
          {
            id: "dws-c1-a",
            label: "Chorus",
            measures: [
              { id: "dws-c1-1", chord: "C#m", analysis: "iii" },
              { id: "dws-c1-2", chord: "F#m", analysis: "vi" },
              { id: "dws-c1-3", chord: "Bm", analysis: "ii" },
              { id: "dws-c1-4", chord: "E7", analysis: "V7" },
            ],
          },
          {
            id: "dws-c1-b",
            measures: [
              { id: "dws-c1-5", chord: "A", analysis: "I" },
              { id: "dws-c1-6", chord: "F#m", analysis: "vi" },
              { id: "dws-c1-7", chord: "Bm", analysis: "ii" },
              { id: "dws-c1-8", chord: "E7", analysis: "V7" },
            ],
          },
          {
            id: "dws-c1-c",
            measures: [
              { id: "dws-c1-9", chord: "C#m", analysis: "iii" },
              { id: "dws-c1-10", chord: "F#m", analysis: "vi" },
              { id: "dws-c1-11", chord: "Bm", analysis: "ii" },
              { id: "dws-c1-12", chord: "E7", analysis: "V7" },
            ],
          },
        ],
      },
      {
        id: "dws-turn",
        title: "Turnaround",
        annotation: "Short return that resets the next verse",
        systems: [
          {
            id: "dws-t-a",
            label: "Turn",
            measures: [
              { id: "dws-t-1", chord: "A", analysis: "I" },
              { id: "dws-t-2", chord: "A", analysis: "I" },
              { id: "dws-t-3", chord: "D", analysis: "IV" },
              { id: "dws-t-4", chord: "A", analysis: "I" },
            ],
          },
        ],
      },
      {
        id: "dws-verse-2",
        title: "Verse 2",
        annotation: "Returns to the same functional loop with a little more lift",
        systems: [
          {
            id: "dws-v2-a",
            label: "Verse",
            measures: [
              { id: "dws-v2-1", chord: "C#m", analysis: "iii" },
              { id: "dws-v2-2", chord: "F#m", analysis: "vi" },
              { id: "dws-v2-3", chord: "Bm", analysis: "ii" },
              { id: "dws-v2-4", chord: "E7", analysis: "V7" },
            ],
          },
          {
            id: "dws-v2-b",
            measures: [
              { id: "dws-v2-5", chord: "A", analysis: "I" },
              { id: "dws-v2-6", chord: "F#m", analysis: "vi" },
              { id: "dws-v2-7", chord: "Bm", analysis: "ii" },
              { id: "dws-v2-8", chord: "E7", analysis: "V7" },
            ],
          },
          {
            id: "dws-v2-c",
            measures: [
              { id: "dws-v2-9", chord: "C#m", analysis: "iii" },
              { id: "dws-v2-10", chord: "F#m", analysis: "vi" },
              { id: "dws-v2-11", chord: "Bm", analysis: "ii" },
              { id: "dws-v2-12", chord: "E7", analysis: "V7" },
            ],
          },
        ],
      },
      {
        id: "dws-pre-2",
        title: "Pre-Chorus Lift",
        annotation: "A held dominant and a brighter rise into the bridge",
        systems: [
          {
            id: "dws-p2-a",
            label: "Pre",
            measures: [
              { id: "dws-p2-1", chord: "Bm", analysis: "ii" },
              { id: "dws-p2-2", chord: "E7", analysis: "V7" },
              { id: "dws-p2-3", chord: "E7", analysis: "V7 held for emphasis." },
              { id: "dws-p2-4", chord: "F#m", analysis: "vi" },
            ],
          },
          {
            id: "dws-p2-b",
            measures: [
              { id: "dws-p2-5", chord: "Bm", analysis: "ii" },
              { id: "dws-p2-6", chord: "C#7", analysis: "III7 acts like a lift into vi." },
              { id: "dws-p2-7", chord: "F#m", analysis: "vi" },
              { id: "dws-p2-8", chord: "E7", analysis: "V7" },
            ],
          },
        ],
      },
      {
        id: "dws-bridge",
        title: "Bridge",
        annotation: "Dominant chain intensifies the last section",
        systems: [
          {
            id: "dws-b-a",
            label: "Bridge",
            measures: [
              { id: "dws-b-1", chord: "F#m", analysis: "vi" },
              { id: "dws-b-2", chord: "B7", analysis: "II7" },
              { id: "dws-b-3", chord: "E7", analysis: "V7" },
              { id: "dws-b-4", chord: "A", analysis: "I" },
            ],
          },
          {
            id: "dws-b-b",
            measures: [
              { id: "dws-b-5", chord: "C#m", analysis: "iii" },
              { id: "dws-b-6", chord: "F#m", analysis: "vi" },
              { id: "dws-b-7", chord: "Bm", analysis: "ii" },
              { id: "dws-b-8", chord: "E7", analysis: "V7" },
            ],
          },
        ],
      },
      {
        id: "dws-final",
        title: "Final Chorus / Outro",
        annotation: "Last statements resolve back to A without the rough chromatic tags",
        systems: [
          {
            id: "dws-f-a",
            label: "Final",
            measures: [
              { id: "dws-f-1", chord: "A", analysis: "I" },
              { id: "dws-f-2", chord: "C#m", analysis: "iii" },
              { id: "dws-f-3", chord: "F#m", analysis: "vi" },
              { id: "dws-f-4", chord: "B7", analysis: "II7" },
            ],
          },
          {
            id: "dws-f-b",
            measures: [
              { id: "dws-f-5", chord: "C#7", analysis: "III7" },
              { id: "dws-f-6", chord: "F#m", analysis: "vi" },
              { id: "dws-f-7", chord: "B7", analysis: "II7" },
              { id: "dws-f-8", chord: "E7", analysis: "V7" },
            ],
          },
          {
            id: "dws-f-c",
            ending: "Outro",
            measures: [
              { id: "dws-f-9", chord: "A", analysis: "I" },
              { id: "dws-f-10", chord: "C#m", analysis: "iii" },
              { id: "dws-f-11", chord: "A", analysis: "I" },
              { id: "dws-f-12", chord: "A", analysis: "I" },
            ],
            footer: "Ending chart is intentionally normalized to a playable A-major cadence rather than the rough chromatic MIR tail.",
          },
        ],
      },
    ],
  },
];
