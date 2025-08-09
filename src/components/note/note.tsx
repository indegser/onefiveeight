import { intervalColorMap } from "@/lib/interval-color";
import { useDisplayType } from "@/lib/stores";
import * as TonalNote from "@tonaljs/note";
import clsx from "clsx";

interface Props {
  note: string;
  interval: string;
  forceNote?: boolean;
  dimmed?: boolean;
  simple?: boolean;
}

export const Note = ({
  note,
  interval,
  forceNote,
  dimmed = false,
  simple = false,
}: Props) => {
  const isNote = useDisplayType() === "note" || forceNote;

  return (
    <div
      className={clsx(
        "relative shrink-0",
        (!simple && intervalColorMap[interval]) || "bg-gray-200",
        `h-6 w-6 rounded-full text-[10px] font-semibold`,
        dimmed && "!bg-gray-200 !text-gray-200",
      )}
    >
      <div className="flex h-full w-full items-center justify-center">
        {isNote ? TonalNote.simplify(note) : interval}
      </div>
    </div>
  );
};
