"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AlphaTabApi, SmuflMetadata } from "@coderline/alphatab";
import { songToAlphaTex } from "@/lib/song-alphatex";
import type { Song } from "@/lib/songs";
import styles from "./lead-sheet-renderer.module.css";

const CHORD_FONT_FAMILY = "Score Scheherazade New";
const COMPACT_CHORD_ATTRIBUTE = "data-compact-chord";
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const CHORD_SYMBOL_PATTERN =
  /^([A-G](?:#{1,2}|b{1,2})?)([^/]*)(\/[A-G](?:#{1,2}|b{1,2})?)?$/;
const RAISED_MODIFIER_PATTERN =
  /^(?:(?:[#b](?:5|9|11|13)|sus(?:2|4|9)?|add[#b]?(?:2|4|5|6|9|11|13)|no(?:3|5|7|9|11|13)|omit(?:3|5|7|9|11|13)|alt),?)+$/;

type ChordPartRole = "root" | "quality" | "modifier" | "bass";

type FormattedChordBody = {
  baseline: string;
  raised: string;
};

function typographicAccidentals(value: string) {
  return value.replaceAll("b", "♭").replaceAll("#", "♯");
}

function splitRaisedModifier(value: string) {
  const unwrapped =
    value.startsWith("(") && value.endsWith(")") ? value.slice(1, -1) : value;

  return RAISED_MODIFIER_PATTERN.test(unwrapped) ? unwrapped : null;
}

function formatChordBody(body: string): FormattedChordBody {
  let baseline = "";
  let remainder = body;

  const halfDiminished = remainder.match(/^m7(?:b5|\(b5\))/);
  const minorMajor = remainder.match(/^m(?:maj|Maj|M)(7|9|11|13)/);
  const major = remainder.match(/^(?:maj|M)(7|9|11|13)/);
  const diminished = remainder.match(/^dim(7)?/);
  const minorExtension = remainder.match(/^m(6|7|9|11|13)/);
  const plainExtension = remainder.match(/^(6|7|9|11|13)/);

  if (halfDiminished) {
    baseline = "ø7";
    remainder = remainder.slice(halfDiminished[0].length);
  } else if (minorMajor) {
    baseline = `−△${minorMajor[1]}`;
    remainder = remainder.slice(minorMajor[0].length);
  } else if (major) {
    baseline = `△${major[1]}`;
    remainder = remainder.slice(major[0].length);
  } else if (diminished) {
    baseline = `°${diminished[1] ?? ""}`;
    remainder = remainder.slice(diminished[0].length);
  } else if (remainder.startsWith("aug")) {
    baseline = "+";
    remainder = remainder.slice(3);
  } else if (minorExtension) {
    baseline = `−${minorExtension[1]}`;
    remainder = remainder.slice(minorExtension[0].length);
  } else if (
    remainder === "m" ||
    /^(?:m)(?=sus|add|no|omit|alt)/.test(remainder)
  ) {
    baseline = "−";
    remainder = remainder.slice(1);
  } else if (plainExtension) {
    baseline = plainExtension[1];
    remainder = remainder.slice(plainExtension[0].length);
  } else if (remainder === "maj" || remainder === "M") {
    baseline = "△";
    remainder = "";
  }

  const raised = splitRaisedModifier(remainder);
  if (raised !== null) {
    return { baseline, raised };
  }

  return {
    baseline: `${baseline}${remainder}`,
    raised: "",
  };
}

function appendChordPart(
  text: SVGTextElement,
  value: string,
  role: ChordPartRole,
) {
  const part = document.createElementNS(SVG_NAMESPACE, "tspan");
  part.textContent = typographicAccidentals(value);
  part.setAttribute("data-chord-role", role);

  if (role === "modifier") {
    part.setAttribute("font-size", "80%");
    part.setAttribute("baseline-shift", "38%");
  }

  text.append(part);
}

function formatChordNames(container: HTMLElement) {
  for (const text of container.querySelectorAll<SVGTextElement>("svg text")) {
    if (!text.getAttribute("style")?.includes(CHORD_FONT_FAMILY)) continue;

    text.setAttribute("text-anchor", "start");
    if (text.hasAttribute(COMPACT_CHORD_ATTRIBUTE)) continue;

    const chord = text.textContent ?? "";
    const match = chord.match(CHORD_SYMBOL_PATTERN);
    if (!match) continue;

    const [, root, suffix, bass = ""] = match;
    const { baseline, raised } = formatChordBody(suffix);
    text.setAttribute(COMPACT_CHORD_ATTRIBUTE, "true");
    text.setAttribute("data-source-chord", chord);
    text.replaceChildren();
    appendChordPart(text, root, "root");
    if (baseline) appendChordPart(text, baseline, "quality");
    if (raised) appendChordPart(text, raised, "modifier");
    if (bass) appendChordPart(text, bass, "bass");
  }
}

export function LeadSheetRenderer({ song }: { song: Song }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const alphaTabRef = useRef<AlphaTabApi | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const alphaTex = useMemo(() => songToAlphaTex(song), [song]);

  useEffect(() => {
    let disposed = false;
    let chordAlignmentObserver: MutationObserver | null = null;
    const abortController = new AbortController();

    async function renderScore() {
      if (!containerRef.current) return;

      setStatus("loading");
      containerRef.current.replaceChildren();
      chordAlignmentObserver = new MutationObserver(() => {
        if (containerRef.current) formatChordNames(containerRef.current);
      });
      chordAlignmentObserver.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });

      try {
        const [alphaTab, metadataResponse] = await Promise.all([
          import("@coderline/alphatab"),
          fetch("/alphatab/smufl/finale-maestro/metadata.json", {
            signal: abortController.signal,
          }),
          document.fonts.load(`700 19px "${CHORD_FONT_FAMILY}"`, "D A7 G Bm"),
        ]);
        if (!metadataResponse.ok) {
          throw new Error(`SMuFL metadata ${metadataResponse.status}`);
        }
        const metadata = (await metadataResponse.json()) as SmuflMetadata;
        if (disposed || !containerRef.current) return;

        const compact = containerRef.current.clientWidth <= 640;
        const settings = new alphaTab.Settings();
        settings.core.scriptFile = `${window.location.origin}/alphatab/alphaTab.min.js`;
        settings.core.useWorkers = true;
        settings.core.smuflFontSources = new Map([
          [
            alphaTab.FontFileFormat.OpenType,
            `${window.location.origin}/alphatab/smufl/finale-maestro/font.otf`,
          ],
        ]);
        settings.display.layoutMode = alphaTab.LayoutMode.Page;
        settings.display.scale = compact ? 0.72 : 0.9;
        settings.display.padding = [0, 35];
        settings.display.stretchForce = 0.8;
        settings.display.justifyLastSystem = true;
        settings.display.barsPerRow = compact ? 3 : 4;
        settings.display.effectBandPaddingBottom = 6;
        settings.display.resources.engravingSettings.fillFromSmufl(metadata);
        settings.display.resources.elementFonts.set(
          alphaTab.NotationElement.EffectChordNames,
          new alphaTab.model.Font(
            CHORD_FONT_FAMILY,
            19,
            alphaTab.model.FontStyle.Plain,
            alphaTab.model.FontWeight.Bold,
          ),
        );
        settings.notation.notationMode = alphaTab.NotationMode.GuitarPro;
        const api = new alphaTab.AlphaTabApi(containerRef.current, settings);

        api.scoreLoaded.on((score) => {
          score.stylesheet.singleTrackTrackNamePolicy =
            alphaTab.model.TrackNamePolicy.Hidden;
          score.stylesheet.multiTrackTrackNamePolicy =
            alphaTab.model.TrackNamePolicy.Hidden;
          score.stylesheet.barNumberDisplay =
            alphaTab.model.BarNumberDisplay.Hide;
          const transparent = alphaTab.model.Color.fromJson("#00000000");
          for (const track of score.tracks) {
            for (const staff of track.staves) {
              for (const bar of staff.bars) {
                for (const voice of bar.voices) {
                  for (const beat of voice.beats) {
                    beat.style = new alphaTab.model.BeatStyle();
                    beat.style.colors.set(
                      alphaTab.model.BeatSubElement.StandardNotationRests,
                      transparent,
                    );
                  }
                }
              }
            }
          }
        });
        api.renderFinished.on(() => {
          if (!disposed && containerRef.current) {
            formatChordNames(containerRef.current);
            setStatus("ready");
          }
        });
        api.error.on((error) => {
          console.error("alphaTab failed", error);
          if (!disposed) setStatus("error");
        });

        alphaTabRef.current = api;
        api.tex(alphaTex);
      } catch (error) {
        if (abortController.signal.aborted) return;
        console.error("alphaTab score rendering failed", error);
        if (!disposed) setStatus("error");
      }
    }

    void renderScore();
    return () => {
      disposed = true;
      chordAlignmentObserver?.disconnect();
      abortController.abort();
      alphaTabRef.current?.destroy();
      alphaTabRef.current = null;
    };
  }, [alphaTex]);

  return (
    <div
      className={`${styles.fontRegistry} overflow-hidden bg-white font-sans`}
    >
      <div className="relative min-h-64 overflow-x-hidden bg-white">
        {status === "loading" ? (
          <div className="absolute inset-x-0 top-0 z-10 grid min-h-64 place-items-center bg-white text-sm text-[#666]">
            악보를 조판하고 있습니다…
          </div>
        ) : null}
        {status === "error" ? (
          <div
            role="alert"
            className="grid min-h-64 place-items-center bg-[#f7f7f7] px-6 text-center text-sm text-[#555]"
          >
            악보를 렌더링하지 못했습니다. alphaTab 데이터를 확인해 주세요.
          </div>
        ) : null}
        <div
          ref={containerRef}
          data-score-engine="alphatab"
          data-music-font="finale-maestro"
          data-chord-font="scheherazade-new"
          className="min-w-0 bg-white [&_svg]:max-w-full"
          aria-label={`${song.title} 코드 악보`}
        />
      </div>
    </div>
  );
}
