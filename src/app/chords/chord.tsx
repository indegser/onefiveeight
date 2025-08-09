import { Note } from "@/components/note/note";
import * as TonalChord from "@tonaljs/chord";
import * as TonalNote from "@tonaljs/note";

interface Props {
  chordName: string;
}

export function Chord({ chordName }: Props) {
  if (!chordName) return null;

  const { tonic } = TonalChord.get(chordName);
  const simplifedChordName = chordName.replace(
    tonic!,
    TonalNote.simplify(tonic!),
  );
  const chord = TonalChord.get(simplifedChordName);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-semibold">{chord.symbol}</div>
      <div className="flex gap-2">
        {chord.notes.map((note, index) => {
          return (
            <Note
              key={note}
              note={note}
              interval={chord.intervals[index]}
              forceNote
              simple
            />
          );
        })}
      </div>
    </div>
  );
}
