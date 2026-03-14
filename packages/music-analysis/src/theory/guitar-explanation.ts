import type {
  HarmonicDevice,
  NormalizedLeadSheet,
  ProbableKey,
  ProbableMeter,
} from "../schemas/music-analysis";

export function buildGuitaristExplanation(
  leadSheet: NormalizedLeadSheet,
  probableKey: ProbableKey,
  probableMeter: ProbableMeter,
  devices: HarmonicDevice[],
): string {
  const firstMeasure = leadSheet.sections[0]?.systems[0]?.measures[0];
  const openingChords = firstMeasure?.chordEvents
    .map((event) => event.normalizedSymbol)
    .join(" -> ");
  const deviceSummary = devices.map((device) => device.device).join(", ");

  return [
    `Treat the chart as centered on ${probableKey.tonic} ${probableKey.mode} with a ${probableMeter.meter} pulse, but keep the form flexible where uncertainty is flagged.`,
    openingChords
      ? `The first bar opens with ${openingChords}, so voice the top notes clearly and let the bass movement explain the harmony.`
      : "Start by locking the bass movement and the top melody note before adding extensions.",
    deviceSummary
      ? `For guitar, the most important harmonic colors are ${deviceSummary}; prioritize compact voicings that keep common tones ringing across those moves.`
      : "Favor compact voicings and smooth nearest-note movement because the current draft does not justify more elaborate reharmonization claims.",
  ].join(" ");
}
