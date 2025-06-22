import { FretboardPosition } from "@/lib/fingering";
import { Note } from "../../components/note/note";

export const Finger = ({ string, fret, note, interval }: FretboardPosition) => {
  return (
    <div
      style={{ gridRow: string, gridColumn: fret + 1 }}
      // py for preventing note from being too close on another string.
      className="flex w-full justify-center py-0.5 font-[family-name:var(--font-geist-mono)]"
    >
      <Note note={note} interval={interval} />
    </div>
  );
};
