"use client";

import { amplitude } from "@/lib/amplitude";
import { useEffect } from "react";

export function Tracker() {
  useEffect(() => {
    amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_KEY!, undefined, {
      logLevel:
        process.env.NODE_ENV === "production"
          ? amplitude.Types.LogLevel.None
          : amplitude.Types.LogLevel.Debug,
      autocapture: true,
    });
  }, []);

  return null;
}
