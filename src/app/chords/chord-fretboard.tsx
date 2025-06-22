import { Fretboard } from "@/components/fretboard/fretboard";
import { getFretboardPositionsOfInversions } from "@/lib/voicing";
import type { Chord } from "@tonaljs/chord";

interface Props {
  chord: Chord;
}

export function ChordFretboard({ chord }: Props) {
  const tonic = chord.tonic!;
  const inversions = getFretboardPositionsOfInversions(tonic);

  const forms = inversions.map((inversion) => {
    return inversion.map((position) => {
      const index = chord.intervals.findIndex(
        (interval) => interval === position.interval,
      );

      return {
        tonic: chord.tonic!,
        openNote: chord.notes[0],
        string: position.string,
        fret: position.fret,
        note: chord.notes[index],
        interval: position.interval,
      };
    });
  });

  return (
    <div className="flex flex-wrap gap-8">
      {forms.map((form, index) => {
        const startFret = Math.min(...form.map((x) => x.fret));
        const endFret = Math.max(...form.map((x) => x.fret));
        return (
          <Fretboard
            key={index}
            startFret={Math.max(startFret - 1, 0)}
            endFret={endFret + 1}
            fretboardPositions={form}
          />
        );
      })}
    </div>
  );
}
