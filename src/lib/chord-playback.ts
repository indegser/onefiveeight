import { Chord } from "@tonaljs/chord";
import * as Interval from "@tonaljs/interval";
import * as TonalNote from "@tonaljs/note";
import { Howl, Howler } from "howler";

const piano = (midi: number, volume = 0.5) => {
  const sprite: Record<string, [number, number]> = {};
  const lengthOfNote = 2000;
  let timeIndex = 0;
  for (let i = 24; i <= 96; i++) {
    sprite[i] = [timeIndex, lengthOfNote];
    timeIndex += lengthOfNote;
  }

  let sound = new Howl({
    src: ["/guitar.mp3"],
    sprite,
    rate: 1,
  });

  const id = sound.play(midi.toString());
  sound.volume(volume, id);
};

const playSequence = (notes: string[], bpm = 90) => {
  const midis = notes.map((note) => TonalNote.midi(note) || 24);
  midis.map((midi) => piano(midi));

  // const step = 60 / bpm / 2; // seconds (8th notes)
  // const t0 = Howler.ctx.currentTime + 0.5; // small lookahead

  // midis.slice(1).forEach((midi, index) => {
  //   const when = t0 + index * step;

  //   // Use a short lookahead timer that triggers right before 'when'
  //   const msUntil = Math.max(0, (when - Howler.ctx.currentTime - 0.01) * 700);

  //   setTimeout(() => {
  //     // Start sprite now; we tried to line it up near 'when'
  //     piano(midi, 0.1 * (3 - index) + 0.05);
  //   }, msUntil);
  // });
};

export const playChordNotes = (chord: Chord) => {
  const { intervals, tonic } = chord;

  let tonicWithOctave = tonic + "2";
  const useSixthString =
    TonalNote.midi(tonicWithOctave)! >= TonalNote.midi("F2")!;

  if (useSixthString) {
    tonicWithOctave = tonic + "1";
  }

  const [one, three, five, seven = "8P"] = intervals;

  const adjustedIntervals = useSixthString
    ? [one, seven, Interval.add(three, "8P")!, Interval.add(five, "8P")!]
    : [one, five, seven, Interval.add(three, "8P")!];

  const voicing = adjustedIntervals.map((interval) => {
    return TonalNote.transpose(tonicWithOctave, interval);
  });

  playSequence(voicing);
};
