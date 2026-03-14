import * as TonalChord from "@tonaljs/chord";
import * as TonalNote from "@tonaljs/note";
import {
  type NormalizedChordEvent,
  type UncertaintyItem,
} from "../schemas/music-analysis";

const CHORD_ROOT_PATTERN = /^([A-G](?:b|#)?)(.*?)(?:\/([A-G](?:b|#)?))?$/;

function simplifyNote(note: string | null) {
  if (!note) {
    return null;
  }

  try {
    return TonalNote.simplify(note);
  } catch {
    return note;
  }
}

function normalizeDescriptor(descriptor: string) {
  return descriptor
    .replaceAll("Δ", "maj")
    .replaceAll("min", "m")
    .replaceAll("-", "m")
    .replaceAll("ø", "m7b5")
    .replaceAll("°", "dim")
    .replace(/\s+/g, "");
}

function detectQuality(descriptor: string): NormalizedChordEvent["quality"] {
  const lowered = descriptor.toLowerCase();

  if (lowered.includes("sus")) {
    return "suspended";
  }

  if (lowered.includes("m7b5") || lowered.includes("half")) {
    return "half-diminished";
  }

  if (lowered.includes("dim")) {
    return "diminished";
  }

  if (lowered.includes("aug") || lowered.includes("+")) {
    return "augmented";
  }

  if (lowered === "5") {
    return "power";
  }

  if (lowered.startsWith("m") && !lowered.startsWith("maj")) {
    return "minor";
  }

  if (lowered.includes("7")) {
    return "dominant";
  }

  if (!descriptor || lowered.startsWith("maj") || lowered === "6") {
    return "major";
  }

  return "unknown";
}

function looksLikeChordSymbol(token: string) {
  return CHORD_ROOT_PATTERN.test(token.trim());
}

export function splitChordTokens(rawText: string) {
  const sanitized = rawText
    .replace(/[|]/g, " ")
    .replace(/\s*->\s*/g, " ")
    .trim();

  if (!sanitized) {
    return [];
  }

  const candidates = sanitized.split(/\s+/).filter(Boolean);

  return candidates.every(looksLikeChordSymbol) ? candidates : [sanitized];
}

export function normalizeChordEvent(
  rawSymbol: string,
  eventId: string,
): {
  event: NormalizedChordEvent;
  uncertainty: UncertaintyItem[];
} {
  const trimmed = rawSymbol.trim();
  const uncertainty: UncertaintyItem[] = [];
  const parsed = trimmed.match(CHORD_ROOT_PATTERN);

  if (!parsed) {
    return {
      event: {
        eventId,
        rawSymbol: trimmed,
        normalizedSymbol: trimmed,
        root: null,
        bass: null,
        quality: "unknown",
        beatSpan: null,
        confidence: 0.2,
        parsingNotes: ["Could not parse chord symbol safely."],
      },
      uncertainty: [
        {
          scope: "event",
          ref: eventId,
          severity: "high",
          message: `Unparsed chord symbol: ${trimmed}`,
          recommendation: "Review the original symbolic source for this bar.",
        },
      ],
    };
  }

  const [, rawRoot, rawDescriptor, rawBass] = parsed;
  const descriptor = normalizeDescriptor(rawDescriptor);
  const root = simplifyNote(rawRoot) ?? rawRoot;
  const bass = simplifyNote(rawBass ?? null);
  const normalizedSymbol = `${root}${descriptor}${bass ? `/${bass}` : ""}`;
  const tonalChord = TonalChord.get(normalizedSymbol);
  const isRecognized = Boolean(tonalChord?.notes?.length);

  if (!isRecognized) {
    uncertainty.push({
      scope: "event",
      ref: eventId,
      severity: "medium",
      message: `Chord symbol parsed structurally but tonal lookup was weak: ${normalizedSymbol}`,
      recommendation:
        "Keep the measure marked for review until the source can be cross-checked.",
    });
  }

  return {
    event: {
      eventId,
      rawSymbol: trimmed,
      normalizedSymbol,
      root,
      bass,
      quality: detectQuality(descriptor),
      beatSpan: null,
      confidence: isRecognized ? 0.92 : 0.55,
      parsingNotes: isRecognized ? [] : ["Tonal lookup returned no concrete notes."],
    },
    uncertainty,
  };
}
