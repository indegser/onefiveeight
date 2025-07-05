import { Note } from "@/components/note/note";
import * as TonalChord from "@tonaljs/chord";

interface Props {
  chordName: string;
}

export function Chord({ chordName }: Props) {
  if (!chordName) return null;

  const chord = TonalChord.get(chordName);

  return (
    <div className="flex items-center">
      <div className="basis-[72px] text-sm font-semibold">{chord.symbol}</div>
      <div className="flex flex-auto gap-2">
        {chord.notes.map((note, index) => {
          return (
            <Note
              key={note}
              note={note}
              interval={chord.intervals[index]}
              forceNote
            />
          );
        })}
      </div>
    </div>
  );
}
