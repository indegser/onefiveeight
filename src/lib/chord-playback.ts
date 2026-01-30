import { Chord } from "@tonaljs/chord";
import * as TonalNote from "@tonaljs/note";
import { Howl, Howler } from "howler";

/**
 * Module-level AudioContext singleton to avoid creating multiple contexts.
 * Browsers limit the number of concurrent AudioContexts, so reuse is important.
 */
let audioContext: AudioContext | null = null;

/**
 * Lazily creates (or returns) an AudioContext in the browser.
 * On the server, returns null to avoid SSR/Node crashes.
 */
const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};

/**
 * Ensures a note includes an octave. If the note already has one, it is returned.
 * When the note is a pitch class (e.g. "C#"), we append the provided octave.
 */
const ensureOctave = (note: string, octave: number) => {
  const existingOctave = TonalNote.octave(note);
  if (existingOctave !== null) return note;
  const pitchClass = TonalNote.pitchClass(note);
  if (!pitchClass) return note;
  return `${pitchClass}${octave}`;
};

function playString({
  context,
  frequency,
  t,
  volume = 0.35,
  duration = 2.2,
}: {
  context: AudioContext;
  frequency: number;
  t: number;
  volume?: number;
  duration?: number;
}) {
  // Oscillator = string vibration
  const osc = context.createOscillator();
  osc.type = "triangle"; // warmer than sine/saw
  osc.frequency.setValueAtTime(frequency, t); // low E (E2)

  // Filter = tone shaping
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1800, t);
  filter.frequency.exponentialRampToValueAtTime(1200, t + 0.4);

  // Gain envelope (soft pluck)
  const gain = context.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.015); // gentle attack
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

  // Wiring
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  osc.start(t);
  osc.stop(t + duration + 0.05);
}

const piano = (midi: number, volume = 1) => {
  const sprite: Record<string, [number, number]> = {};
  const lengthOfNote = 2400;
  let timeIndex = 0;
  for (let i = 24; i <= 96; i++) {
    sprite[i] = [timeIndex, lengthOfNote];
    timeIndex += lengthOfNote;
  }

  let sound = new Howl({
    src: ["/pianosprite.mp3"],
    sprite,
    rate: 1,
  });

  const id = sound.play(midi.toString());
  sound.volume(volume, id);
};

const playSequence = (notes: string[], bpm = 90) => {
  console.log(notes);
  const midis = notes.map((note) => TonalNote.midi(note) || 24);
  midis.map((midi) => piano(midi));

  const step = 60 / bpm / 2; // seconds (8th notes)
  const t0 = Howler.ctx.currentTime + 0.05; // small lookahead

  midis.slice(1).forEach((midi, index) => {
    const when = t0 + index * step;

    // Use a short lookahead timer that triggers right before 'when'
    const msUntil = Math.max(0, (when - Howler.ctx.currentTime - 0.01) * 1000);

    setTimeout(() => {
      // Start sprite now; we tried to line it up near 'when'
      piano(midi, 0.2);
    }, msUntil);
  });
};

export const playChordNotes = async (chord: Chord) => {
  const { intervals, tonic } = chord;
  const tonicWithOctave = tonic + "2";
  const notes = intervals.map((interval) =>
    TonalNote.transpose(tonicWithOctave, interval),
  );

  playSequence([
    tonic + "1",
    ...notes.slice(0, -1),
    notes[notes.length - 1].replace("3", "4"),
  ]);
};
