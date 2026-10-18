"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  PRACTICE_AUDIO,
  PRACTICE_CHORDS,
  PRACTICE_ROWS,
  practiceChordAtTime,
} from "@/lib/practice-track";

type Status = "ready" | "loading" | "playing" | "buffering" | "paused" | "error";

export function PracticePlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const intentRef = useRef(false);
  const startedRef = useRef(false);
  const mountedRef = useRef(false);
  const requestRef = useRef(0);
  const savedTimeRef = useRef(0);
  const pendingSeekRef = useRef<number | null>(null);
  const [status, setStatus] = useState<Status>("ready");
  const [playIntent, setPlayIntent] = useState(false);
  const [activeChord, setActiveChord] = useState<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    mountedRef.current = true;
    let frame = 0;
    const sync = () => {
      if (startedRef.current) {
        savedTimeRef.current = audio.currentTime;
        setActiveChord(practiceChordAtTime(audio.currentTime));
      }
    };
    const stopFrame = () => cancelAnimationFrame(frame);
    const tick = () => {
      sync();
      if (!audio.paused && !audio.ended) frame = requestAnimationFrame(tick);
    };
    const playing = () => {
      startedRef.current = true;
      setStatus("playing");
      stopFrame();
      tick();
    };
    const pause = () => {
      stopFrame();
      sync();
      intentRef.current = false;
      setPlayIntent(false);
      setStatus((previous) => previous === "error" ? previous : "paused");
    };
    const waiting = () => {
      stopFrame();
      sync();
      if (intentRef.current) setStatus("buffering");
    };
    const error = () => {
      stopFrame();
      intentRef.current = false;
      setPlayIntent(false);
      setStatus("error");
    };
    const metadata = () => {
      if (pendingSeekRef.current !== null) {
        audio.currentTime = pendingSeekRef.current;
        pendingSeekRef.current = null;
      }
    };
    const events = { playing, pause, waiting, error, loadedmetadata: metadata, timeupdate: sync, seeked: sync };
    for (const [event, handler] of Object.entries(events)) audio.addEventListener(event, handler);
    return () => {
      mountedRef.current = false;
      stopFrame();
      for (const [event, handler] of Object.entries(events)) audio.removeEventListener(event, handler);
      audio.pause();
    };
  }, []);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    const request = ++requestRef.current;
    if (intentRef.current) {
      intentRef.current = false;
      setPlayIntent(false);
      audio.pause();
      setStatus("paused");
      return;
    }
    if (status === "error") {
      pendingSeekRef.current = savedTimeRef.current;
      audio.load();
    }
    intentRef.current = true;
    setPlayIntent(true);
    setStatus("loading");
    try {
      await audio.play();
    } catch {
      if (!mountedRef.current || request !== requestRef.current) return;
      intentRef.current = false;
      setPlayIntent(false);
      setStatus("error");
    }
  }

  const message = status === "error"
    ? "음원을 불러오지 못했어요. 다시 시도해 주세요."
    : status === "loading"
      ? "불러오는 중…"
      : status === "buffering"
        ? "버퍼링 중…"
        : "";

  return (
    <section aria-label="반복 연습" lang="ko">
      <audio ref={audioRef} src={PRACTICE_AUDIO} preload="metadata" loop />
      <div className="space-y-3" aria-label="8마디 코드 진행">
        {PRACTICE_ROWS.map((row) => (
          <div key={row.measures[0]}>
            <div className="mb-1 grid min-h-5 grid-cols-2 items-end text-sm leading-5 text-muted-foreground">
              {row.scales.map((scale) => (
                <div key={scale} className={cn("px-2", row.scales.length === 1 && "col-span-2")}>
                  {scale}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 border border-border">
              {row.measures.map((measure, measureIndex) => (
                <div key={measure} className={cn("min-w-0", measureIndex === 1 && "border-l border-border")}>
                  <div className="px-2 pt-1 text-xs leading-4 text-muted-foreground" aria-hidden="true">{measure}</div>
                  <div className="flex">
                    {PRACTICE_CHORDS.map((event, index) => event.measure === measure ? (
                      <div
                        key={event.beat}
                        aria-label={`${measure}마디 ${event.chord}`}
                        aria-current={activeChord === index ? "true" : undefined}
                        className={cn(
                          "flex min-h-11 min-w-0 flex-1 items-center justify-center whitespace-nowrap px-0.5 text-base font-medium tracking-tight sm:min-h-16 sm:text-xl [&+div]:border-l [&+div]:border-border",
                          activeChord === index && "bg-primary text-primary-foreground",
                        )}
                      >
                        {event.chord}
                      </div>
                    ) : null)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-col items-center">
        <button
          type="button"
          onClick={togglePlayback}
          className="min-h-12 min-w-36 rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {status === "error" ? "다시 시도" : playIntent ? "일시정지" : "재생"}
        </button>
        <p className="mt-3 text-sm text-muted-foreground">↻ 자동 반복</p>
        <p role="status" className="mt-1 min-h-10 text-center text-sm leading-5 text-muted-foreground">{message}</p>
      </div>
    </section>
  );
}
