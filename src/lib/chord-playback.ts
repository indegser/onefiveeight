import * as TonalNote from "@tonaljs/note";

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

/**
 * Plays a single plucked-string note using a simple Karplus-Strong style model:
 * - Seed with a short burst of noise (simulates pick attack).
 * - Feed the noise into a short delay line tuned to the target frequency.
 * - Feed back the delay with a lowpass filter to mimic string damping.
 * - Apply a decay envelope for a natural fade-out.
 */
const playPluckedString = (
  context: AudioContext,
  frequency: number,
  startTime: number,
) => {
  const noiseDuration = 0.08;
  const bufferSize = Math.floor(context.sampleRate * noiseDuration);
  const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseSource = context.createBufferSource();
  noiseSource.buffer = noiseBuffer;

  const delay = context.createDelay();
  delay.delayTime.value = 1 / frequency;

  const feedbackGain = context.createGain();
  feedbackGain.gain.value = 0.4;

  const feedbackFilter = context.createBiquadFilter();
  feedbackFilter.type = "lowpass";
  feedbackFilter.frequency.value = 2200;

  const bodyFilter = context.createBiquadFilter();
  bodyFilter.type = "lowpass";
  bodyFilter.frequency.value = 4800;

  const outputGain = context.createGain();
  outputGain.gain.setValueAtTime(0.9, startTime);
  outputGain.gain.exponentialRampToValueAtTime(0.001, startTime + 2.2);

  noiseSource.connect(delay);
  delay.connect(bodyFilter);
  bodyFilter.connect(outputGain);
  outputGain.connect(context.destination);

  delay.connect(feedbackGain);
  feedbackGain.connect(feedbackFilter);
  feedbackFilter.connect(delay);

  noiseSource.start(startTime);
  noiseSource.stop(startTime + noiseDuration);
};

/**
 * Plays an array of chord tones with a slight strum and acoustic-guitar-like tone.
 * Notes are staggered for a gentle strum and octave assignment keeps the chord warm.
 */
export const playChordNotes = async (notes: string[]) => {
  const context = getAudioContext();
  if (!context) return;
  if (context.state === "suspended") {
    await context.resume();
  }

  notes.forEach((note, index) => {
    const octave = index === 0 ? 3 : 4;
    const noteWithOctave = ensureOctave(note, octave);
    const frequency = TonalNote.freq(noteWithOctave);
    if (!frequency) return;
    const startTime = context.currentTime + index * 0.04;
    playPluckedString(context, frequency, startTime);
  });
};
