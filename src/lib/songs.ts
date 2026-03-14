export type SongSection = {
  id: string;
  title: string;
  annotation?: string;
  lines: string[];
};

export type Song = {
  id: string;
  title: string;
  composer: string;
  style: string;
  keySignature: string;
  tempo: string;
  summary: string;
  sections: SongSection[];
};

export const songs: Song[] = [
  {
    id: "midnight-platform",
    title: "Midnight Platform",
    composer: "Copied Lead Sheet",
    style: "Ballad",
    keySignature: "E major",
    tempo: "72 BPM",
    summary: "A late-night ballad with long-held tones and a spacious chorus.",
    sections: [
      {
        id: "intro",
        title: "Intro",
        annotation: "Rubato pickup",
        lines: ["| Emaj7    | C#m7    | Aadd9    | Bsus4 B |"],
      },
      {
        id: "verse",
        title: "Verse",
        lines: [
          "| Emaj7        | G#m7         | C#m7        | Amaj7       |",
          "| On the last train home, the streetlights blur in time        |",
          "| F#m7         | B7           | Emaj7       | Emaj7       |",
          "| I keep the chorus low, and let the station sing             |",
        ],
      },
      {
        id: "chorus",
        title: "Chorus",
        annotation: "Open voicings",
        lines: [
          "| Amaj7        | B            | G#m7        | C#m7        |",
          "| Hold the line, hold the glow, keep the city in the reverb    |",
          "| F#m7         | B7           | Emaj7       | Emaj7       |",
          "| Let it ring, let it land, let the silence carry everything   |",
        ],
      },
    ],
  },
  {
    id: "glass-elevator",
    title: "Glass Elevator",
    composer: "Copied Chart",
    style: "Modern Groove",
    keySignature: "A minor",
    tempo: "98 BPM",
    summary: "A syncopated groove chart built around short phrases and quick lifts.",
    sections: [
      {
        id: "riff",
        title: "Main Riff",
        lines: [
          "| Am7   .   C/E   . | Fmaj7   .   Em7   . |",
          "| e|----------------|--------------------|",
          "| B|------5---5-----|------5---3---------|",
          "| G|----5---5---5---|----5---4---4-------|",
        ],
      },
      {
        id: "verse",
        title: "Verse",
        lines: [
          "| Am7         | C/E         | Fmaj7       | Em7         |",
          "| Quiet steel and mirrored doors, a heartbeat in the wires      |",
          "| Dm7         | G13         | Cmaj7       | E7#9        |",
          "| Every floor another pulse, another spark that rises          |",
        ],
      },
      {
        id: "bridge",
        title: "Bridge",
        annotation: "Build dynamics",
        lines: [
          "| Fmaj7       | G           | Em7         | Am7         |",
          "| Count the lights, then lose the ground                        |",
          "| Dm7         | G           | Cmaj7       | E7#9        |",
          "| Turn the key and spin the room around                        |",
        ],
      },
    ],
  },
  {
    id: "harbor-signal",
    title: "Harbor Signal",
    composer: "Copied Score",
    style: "Folk",
    keySignature: "D major",
    tempo: "84 BPM",
    summary: "A bright folk progression with a singable hook and simple harmonic motion.",
    sections: [
      {
        id: "verse",
        title: "Verse",
        lines: [
          "| D            | A/C#        | Bm7          | G           |",
          "| Wind in the flags and salt on the rail                       |",
          "| D            | A/C#        | G            | A           |",
          "| Morning drifts in soft and pale                              |",
        ],
      },
      {
        id: "chorus",
        title: "Chorus",
        annotation: "Full voice",
        lines: [
          "| G            | D/F#        | Em7          | A           |",
          "| Lift the signal high, let the harbor sing                   |",
          "| G            | D/F#        | Em7     A    | D           |",
          "| Call the tide back in, and let the whole town ring          |",
        ],
      },
      {
        id: "outro",
        title: "Outro",
        lines: ["| D            | A/C#        | Bm7          | G   A   D   |"],
      },
    ],
  },
];
