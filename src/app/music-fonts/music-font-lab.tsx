"use client";

import { useEffect, useRef, useState } from "react";
import type { AlphaTabApi, SmuflMetadata } from "@coderline/alphatab";
import { MUSIC_FONT_DEMO_ALPHATEX } from "@/lib/music-font-demo";
import {
  CHORD_FONTS,
  getChordFont,
  getMusicFont,
  MUSIC_FONTS,
  type ChordFontId,
  type MusicFontId,
} from "@/lib/music-fonts";
import styles from "./music-font-lab.module.css";

export function MusicFontLab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<AlphaTabApi | null>(null);
  const [fontId, setFontId] = useState<MusicFontId>("finale-maestro");
  const [chordFontId, setChordFontId] = useState<ChordFontId>("edwin");
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const selectedFont = getMusicFont(fontId);
  const selectedChordFont = getChordFont(chordFontId);

  useEffect(() => {
    let disposed = false;
    const abortController = new AbortController();

    async function render() {
      if (!containerRef.current) return;

      setStatus("loading");
      apiRef.current?.destroy();
      apiRef.current = null;
      containerRef.current.replaceChildren();

      try {
        const [alphaTab, metadataResponse] = await Promise.all([
          import("@coderline/alphatab"),
          fetch(`/alphatab/smufl/${fontId}/metadata.json`, {
            signal: abortController.signal,
          }),
        ]);
        if (!metadataResponse.ok) {
          throw new Error(`SMuFL metadata ${metadataResponse.status}`);
        }

        const metadata = (await metadataResponse.json()) as SmuflMetadata;
        if (disposed || !containerRef.current) return;

        await document.fonts.load(selectedChordFont.font, "D A7 G Bm");
        if (disposed || !containerRef.current) return;

        const settings = new alphaTab.Settings();
        settings.core.scriptFile = `${window.location.origin}/alphatab/alphaTab.min.js`;
        settings.core.useWorkers = true;
        settings.core.smuflFontSources = new Map([
          [
            alphaTab.FontFileFormat.OpenType,
            `${window.location.origin}/alphatab/smufl/${fontId}/font.otf`,
          ],
        ]);
        settings.display.layoutMode = alphaTab.LayoutMode.Page;
        settings.display.scale =
          containerRef.current.clientWidth <= 640 ? 0.78 : 0.95;
        settings.display.stretchForce = 0.85;
        settings.display.barsPerRow =
          containerRef.current.clientWidth <= 640 ? 2 : 4;
        settings.display.resources.engravingSettings.fillFromSmufl(metadata);
        settings.display.resources.elementFonts.set(
          alphaTab.NotationElement.EffectChordNames,
          new alphaTab.model.Font(
            selectedChordFont.family,
            selectedChordFont.id === "jazzcord" ? 15 : 13,
            alphaTab.model.FontStyle.Plain,
            selectedChordFont.id === "edwin"
              ? alphaTab.model.FontWeight.Bold
              : alphaTab.model.FontWeight.Regular,
          ),
        );
        settings.notation.notationMode = alphaTab.NotationMode.GuitarPro;

        const api = new alphaTab.AlphaTabApi(containerRef.current, settings);
        api.renderFinished.on(() => {
          if (!disposed) setStatus("ready");
        });
        api.error.on((error) => {
          console.error("Music font lab rendering failed", error);
          if (!disposed) setStatus("error");
        });
        apiRef.current = api;
        api.tex(MUSIC_FONT_DEMO_ALPHATEX);
      } catch (error) {
        if (abortController.signal.aborted) return;
        console.error("Music font lab setup failed", error);
        if (!disposed) setStatus("error");
      }
    }

    void render();
    return () => {
      disposed = true;
      abortController.abort();
      apiRef.current?.destroy();
      apiRef.current = null;
    };
  }, [fontId, selectedChordFont]);

  return (
    <section
      className={`${styles.fontRegistry} overflow-hidden border border-gray-300 bg-gray-100 shadow-sm`}
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-black/40 bg-[#2b2d30] px-3 py-2 text-white">
        <div className="mr-auto">
          <p className="text-xs font-semibold">Music Font Lab</p>
          <p className="mt-0.5 text-[11px] text-white/60">
            동일한 SMuFL 악보로 조판 비교
          </p>
        </div>
        <label htmlFor="music-font" className="text-xs text-white/65">
          악보 폰트
        </label>
        <select
          id="music-font"
          value={fontId}
          onChange={(event) => setFontId(event.target.value as MusicFontId)}
          className="min-h-9 rounded-[3px] border border-white/25 bg-[#3a3c40] px-3 text-sm font-medium text-white focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
        >
          {MUSIC_FONTS.map((font) => (
            <option key={font.id} value={font.id}>
              {font.name}
            </option>
          ))}
        </select>
        <label htmlFor="chord-font" className="text-xs text-white/65">
          코드 폰트
        </label>
        <select
          id="chord-font"
          value={chordFontId}
          onChange={(event) =>
            setChordFontId(event.target.value as ChordFontId)
          }
          className="min-h-9 rounded-[3px] border border-white/25 bg-[#3a3c40] px-3 text-sm font-medium text-white focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
        >
          {CHORD_FONTS.map((font) => (
            <option key={font.id} value={font.id}>
              {font.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-300 bg-gray-200 px-3 py-2 text-xs text-gray-700">
        <p className="font-semibold">{selectedFont.name}</p>
        <p>
          코드: {selectedChordFont.name} · {selectedFont.description}
        </p>
      </div>

      <div className="relative min-h-96 overflow-x-hidden bg-white">
        {status === "loading" ? (
          <div className="absolute inset-x-0 top-0 z-10 grid min-h-96 place-items-center bg-white/95 text-sm text-gray-500">
            {selectedFont.name} 폰트로 다시 조판하고 있습니다…
          </div>
        ) : null}
        {status === "error" ? (
          <div
            role="alert"
            className="grid min-h-96 place-items-center px-6 text-center text-sm text-gray-600"
          >
            이 폰트로 악보를 렌더링하지 못했습니다. 다른 폰트를 선택해
            주세요.
          </div>
        ) : null}
        <div
          ref={containerRef}
          data-music-font={fontId}
          data-chord-font={chordFontId}
          data-score-engine="alphatab"
          className="min-w-0 bg-white py-3 [&_svg]:max-w-full"
          aria-label={`${selectedFont.name}로 렌더링한 악보 스타일 테스트`}
        />
      </div>
    </section>
  );
}
