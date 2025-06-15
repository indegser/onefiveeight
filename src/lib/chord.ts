import * as Chord from "@tonaljs/chord";
import * as Scale from "@tonaljs/scale";

export function getDiatonicChords(scaleName: string) {
  const { notes } = Scale.get(scaleName);

  if (notes.length < 7) {
    return [];
  }

  const result = [];

  for (let i = 0; i < notes.length; i++) {
    const triad = [notes[i % 7], notes[(i + 2) % 7], notes[(i + 4) % 7]];
    const seventh = [...triad, notes[(i + 6) % 7]];

    const triadName = Chord.detect(triad)[0];
    const seventhName = Chord.detect(seventh)[0];

    result.push({
      degree: i + 1,
      tonic: notes[i],
      triad: Chord.get(triadName),
      seventh: Chord.get(seventhName),
    });
  }

  return result;
}
