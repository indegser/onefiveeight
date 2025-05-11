import { intervalColorMap } from "@/lib/interval-color";
import clsx from "clsx";

interface Props {
  note: string;
  interval: string;
  displayNote?: boolean;
}

export const Note = ({ note, interval, displayNote = false }: Props) => {
  return (
    <div
      className={clsx(
        intervalColorMap[interval] || "bg-gray-300",
        `h-6 w-6 rounded-full text-[10px] font-semibold`,
      )}
    >
      <div className="flex h-full w-full items-center justify-center">
        {displayNote ? note : interval}
      </div>
    </div>
  );
};
