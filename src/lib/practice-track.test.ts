import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  PRACTICE_TRACKS,
  practiceChordAtTime,
  practiceTrackById,
  // @ts-expect-error Node's strip-types test runner requires the .ts extension.
} from "./practice-track.ts";

test("each catalogue timeline covers its measures and measured audio loop", () => {
  assert.equal(new Set(PRACTICE_TRACKS.map((track) => track.id)).size, PRACTICE_TRACKS.length);
  for (const track of PRACTICE_TRACKS) {
    let beat = 0;
    for (const event of track.chords) {
      assert.equal(event.beat, beat);
      assert.ok(event.duration > 0);
      assert.equal(event.measure, Math.floor(beat / track.beatsPerMeasure) + 1);
      beat += event.duration;
    }
    assert.equal(beat, track.measureCount * track.beatsPerMeasure);
    assert.ok(Math.abs(track.loopEnd - track.loopStart - beat * 60 / track.bpm) < 1 / 48000);
    let scaleBeat = 0;
    for (const scale of track.scales) {
      assert.equal(scale.beat, scaleBeat);
      scaleBeat += scale.duration;
    }
    assert.equal(scaleBeat, beat);
    assert.ok(fs.statSync(`public${track.audio}`).size > 44);
  }
});

test("media-clock highlighting changes at full and subdivided chord boundaries and loop wrap", () => {
  for (const track of PRACTICE_TRACKS) {
    for (let index = 1; index < track.chords.length; index++) {
      const boundary = track.chords[index].beat * 60 / track.bpm;
      assert.equal(practiceChordAtTime(track, boundary - 0.0001), index - 1);
      assert.equal(practiceChordAtTime(track, boundary), index);
      assert.equal(practiceChordAtTime(track, boundary + 0.0001), index);
    }
    assert.equal(practiceChordAtTime(track, track.loopEnd - 0.0001), track.chords.length - 1);
    assert.equal(practiceChordAtTime(track, track.loopEnd), 0);
    assert.equal(practiceChordAtTime(track, track.loopEnd * 100 + 0.001), 0);
    assert.equal(practiceChordAtTime(track, Number.NaN), 0);
  }
  assert.equal(practiceTrackById("not-a-track"), undefined);
});
