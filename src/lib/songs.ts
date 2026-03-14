export type SongMeasure = {
  id: string;
  chord?: string;
  cue?: string;
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
];
