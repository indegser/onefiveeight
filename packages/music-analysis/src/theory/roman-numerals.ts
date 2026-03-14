import * as TonalInterval from "@tonaljs/interval";
import type {
  NormalizedLeadSheet,
  ProbableKey,
  RomanNumeralMeasure,
} from "../schemas/music-analysis";

const INTERVAL_TO_NUMERAL: Record<string, string> = {
  "1P": "I",
  "2m": "bII",
  "2M": "II",
  "3m": "bIII",
  "3M": "III",
  "4P": "IV",
  "4A": "#IV",
  "5d": "bV",
  "5P": "V",
  "6m": "bVI",
  "6M": "VI",
  "7m": "bVII",
  "7M": "VII",
};

function describeFunction(romanNumeral: string) {
  if (romanNumeral.includes("V")) {
    return "dominant";
  }

  if (romanNumeral.includes("IV") || romanNumeral.includes("II")) {
    return "predominant";
  }

  if (romanNumeral.includes("I") || romanNumeral.includes("VI")) {
    return "tonic";
  }

  return "color";
}

function applyQuality(
  numeral: string,
  quality: "major" | "minor" | "dominant" | "diminished" | "half-diminished" | "augmented" | "suspended" | "power" | "unknown",
) {
  if (quality === "minor" || quality === "half-diminished") {
    return numeral.toLowerCase();
  }

  if (quality === "diminished") {
    return `${numeral.toLowerCase()}o`;
  }

  if (quality === "augmented") {
    return `${numeral}+`;
  }

  return numeral;
}

export function analyzeRomanNumerals(
  leadSheet: NormalizedLeadSheet,
  probableKey: ProbableKey,
): RomanNumeralMeasure[] {
  if (probableKey.mode === "unknown") {
    return [];
  }

  return leadSheet.sections.flatMap((section) =>
    section.systems.flatMap((system) =>
      system.measures.map((measure) => ({
        measureId: measure.measureId,
        events: measure.chordEvents.map((event) => {
          if (!event.root) {
            return {
              eventId: event.eventId,
              chordSymbol: event.normalizedSymbol,
              romanNumeral: "?",
              functionLabel: "unknown",
              confidence: 0.2,
              notes: ["Chord root was unavailable for roman numeral analysis."],
            };
          }

          const interval = TonalInterval.distance(probableKey.tonic, event.root);
          const numeral = INTERVAL_TO_NUMERAL[interval] ?? "?";

          return {
            eventId: event.eventId,
            chordSymbol: event.normalizedSymbol,
            romanNumeral: applyQuality(numeral, event.quality),
            functionLabel: describeFunction(numeral),
            confidence: numeral === "?" ? 0.3 : Math.min(0.95, event.confidence),
            notes: event.bass ? [`Bass note ${event.bass} suggests inversion or slash motion.`] : [],
          };
        }),
      })),
    ),
  );
}
