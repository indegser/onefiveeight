import { FretboardPosition } from "@/lib/guitar";
import clsx from "clsx";

export const Note = ({ string, fret, note, interval }: FretboardPosition) => {
  const isRoot = interval === "1P";

  return (
    <div
      style={{ gridRow: string, gridColumn: fret }}
      // py for preventing note from being too close on another string.
      className="flex w-full justify-center py-0.5 font-[family-name:var(--font-geist-mono)]"
    >
      <div
        className={clsx(
          isRoot && "bg-blue-800! text-white/90!",
          `h-6 w-6 rounded-full bg-gray-300 text-[10px] font-semibold text-gray-500`,
        )}
      >
        <div className="flex h-full w-full items-center justify-center">
          {isRoot ? note : interval}
        </div>
      </div>
    </div>
  );
};
