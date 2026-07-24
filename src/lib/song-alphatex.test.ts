import assert from "node:assert/strict";
import test from "node:test";
import type { Song } from "./songs";
import {
  SONG_BARS_PER_SYSTEM,
  songToAlphaTex,
  // @ts-expect-error Node's strip-types test runner requires the .ts extension.
} from "./song-alphatex.ts";

function alphaTexBars(alphaTex: string) {
  return alphaTex
    .split("\n")
    .filter((line) => line.trim().endsWith("|"));
}

test("pads the final alphaTab system to four measures", () => {
  const song = {
    id: "padding-sample",
    sections: [
      {
        id: "a",
        title: "A",
        systems: [
          {
            id: "a-1",
            measures: [
              { id: "m1", chord: "C" },
              { id: "m2", chord: "F" },
              { id: "m3", chord: "G" },
              { id: "m4", chord: "C" },
              { id: "m5", chord: "Am" },
            ],
          },
        ],
      },
    ],
  } as Song;

  const alphaTex = songToAlphaTex(song);
  const bars = alphaTexBars(alphaTex);

  assert.doesNotMatch(alphaTex, /\\tempo/);
  assert.equal(bars.length, 8);
  assert.equal(bars.length % SONG_BARS_PER_SYSTEM, 0);
  assert.match(bars[4], /Am/);
  assert.ok(bars.slice(5).every((bar) => !bar.includes('{ch "')));
});
