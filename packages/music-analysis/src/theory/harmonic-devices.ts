import type {
  HarmonicDevice,
  NormalizedLeadSheet,
  ProbableKey,
  RomanNumeralMeasure,
} from "../schemas/music-analysis";

export function detectHarmonicDevices(
  leadSheet: NormalizedLeadSheet,
  probableKey: ProbableKey,
  romanNumerals: RomanNumeralMeasure[],
): HarmonicDevice[] {
  const devices: HarmonicDevice[] = [];
  const measures = leadSheet.sections.flatMap((section) =>
    section.systems.flatMap((system) => system.measures),
  );

  const slashMeasures = measures.filter((measure) =>
    measure.chordEvents.some((event) => Boolean(event.bass)),
  );

  if (slashMeasures.length) {
    devices.push({
      device: "slash-bass voice leading",
      confidence: 0.82,
      measures: slashMeasures.map((measure) => measure.measureId),
      description:
        "Slash chords indicate directed bass motion or smoother inner-voice connection between changes.",
    });
  }

  const borrowedMeasures = romanNumerals.filter((measure) =>
    measure.events.some((event) => /^b/.test(event.romanNumeral)),
  );

  if (borrowedMeasures.length && probableKey.mode !== "unknown") {
    devices.push({
      device: "borrowed mixture or modal color",
      confidence: 0.68,
      measures: borrowedMeasures.map((measure) => measure.measureId),
      description:
        "Accidentally altered roman numerals suggest mixture, tonicization, or non-diatonic color around the home key.",
    });
  }

  const cadentialMeasures = romanNumerals.filter((measure) => {
    const labels = measure.events.map((event) => event.romanNumeral);

    return labels.some((label) => label.includes("V")) &&
      labels.some((label) => label.includes("I"));
  });

  if (cadentialMeasures.length) {
    devices.push({
      device: "cadential dominant motion",
      confidence: 0.74,
      measures: cadentialMeasures.map((measure) => measure.measureId),
      description:
        "Measures combining dominant and tonic functions likely reinforce sectional cadence or turnaround energy.",
    });
  }

  const secondaryDominantMeasures = romanNumerals.filter((measure) =>
    measure.events.some((event) => /V/.test(event.romanNumeral) && /^I{0,1}V/.test(event.romanNumeral) === false),
  );

  if (secondaryDominantMeasures.length) {
    devices.push({
      device: "secondary dominant or applied tension",
      confidence: 0.52,
      measures: secondaryDominantMeasures.map((measure) => measure.measureId),
      description:
        "Some dominant-quality chords fall outside the basic tonic-dominant frame and may be acting as applied dominants.",
    });
  }

  return devices;
}
