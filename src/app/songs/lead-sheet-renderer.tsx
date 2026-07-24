"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AlphaTabApi, SmuflMetadata } from "@coderline/alphatab";
import { songToAlphaTex } from "@/lib/song-alphatex";
import type { Song } from "@/lib/songs";
import styles from "./lead-sheet-renderer.module.css";

const CHORD_FONT_FAMILY = "Score Scheherazade New";

function leftAlignChordNames(container: HTMLElement) {
  for (const text of container.querySelectorAll<SVGTextElement>("svg text")) {
    if (text.getAttribute("style")?.includes(CHORD_FONT_FAMILY)) {
      text.setAttribute("text-anchor", "start");
    }
  }
}

export function LeadSheetRenderer({ song }: { song: Song }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const alphaTabRef = useRef<AlphaTabApi | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const isImportedScore = Boolean(song.scorePath);
  const alphaTex = useMemo(
    () => (song.scorePath ? null : songToAlphaTex(song)),
    [song],
  );

  useEffect(() => {
    let disposed = false;
    let chordAlignmentObserver: MutationObserver | null = null;
    const abortController = new AbortController();

    async function renderScore() {
      if (!containerRef.current) return;

      setStatus("loading");
      containerRef.current.replaceChildren();
      chordAlignmentObserver = new MutationObserver(() => {
        if (containerRef.current) leftAlignChordNames(containerRef.current);
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
          document.fonts.load(
            `700 19px "${CHORD_FONT_FAMILY}"`,
            "D A7 G Bm",
          ),
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
        settings.display.padding = isImportedScore ? [16, 60] : [0, 35];
        settings.display.stretchForce = 0.8;
        settings.display.justifyLastSystem = true;
        settings.display.barsPerRow = 4;
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
          score.stylesheet.barNumberDisplay =
            alphaTab.model.BarNumberDisplay.Hide;

          if (!isImportedScore) {
            score.stylesheet.singleTrackTrackNamePolicy =
              alphaTab.model.TrackNamePolicy.Hidden;
            score.stylesheet.multiTrackTrackNamePolicy =
              alphaTab.model.TrackNamePolicy.Hidden;
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
          }
        });
        api.renderFinished.on(() => {
          if (!disposed && containerRef.current) {
            leftAlignChordNames(containerRef.current);
            setStatus("ready");
          }
        });
        api.error.on((error) => {
          console.error("alphaTab failed", error);
          if (!disposed) setStatus("error");
        });

        alphaTabRef.current = api;
        if (song.scorePath) {
          api.load(song.scorePath, song.scoreTrackIndexes);
        } else if (alphaTex) {
          api.tex(alphaTex);
        }
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
  }, [alphaTex, isImportedScore, song.scorePath, song.scoreTrackIndexes]);

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
          aria-label={`${song.title} ${isImportedScore ? "멜로디와 피아노 악보" : "코드 악보"}`}
        />
      </div>
    </div>
  );
}
