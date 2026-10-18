import assert from "node:assert/strict";
import test from "node:test";
import {
  PRACTICE_BPM,
  PRACTICE_CHORDS,
  PRACTICE_DURATION,
  practiceChordAtTime,
  // @ts-expect-error Node's strip-types test runner requires the .ts extension.
} from "./practice-track.ts";

test("every chord switches exactly at its audio-clock boundary", () => {
  for (let index = 1; index < PRACTICE_CHORDS.length; index++) {
    const boundary = PRACTICE_CHORDS[index].beat * 60 / PRACTICE_BPM;
    assert.equal(practiceChordAtTime(boundary - 0.001), index - 1);
    assert.equal(practiceChordAtTime(boundary), index);
    assert.equal(practiceChordAtTime(boundary + 0.001), index);
  }
});

test("bars 6 and 8 divide equally at beats 22 and 30", () => {
  for (const beat of [22, 30]) {
    const index = practiceChordAtTime(beat * 60 / PRACTICE_BPM);
    assert.equal(PRACTICE_CHORDS[index].beat, beat);
    assert.equal(PRACTICE_CHORDS[index - 1].measure, PRACTICE_CHORDS[index].measure);
  }
});

test("loop wrap returns to Fmaj7 with no accumulated drift", () => {
  assert.equal(practiceChordAtTime(PRACTICE_DURATION - 0.001), 9);
  assert.equal(practiceChordAtTime(PRACTICE_DURATION), 0);
  assert.equal(practiceChordAtTime(PRACTICE_DURATION + 0.001), 0);
  assert.equal(practiceChordAtTime(100 * PRACTICE_DURATION + 0.001), 0);
});
