import { intervalColorMap } from "@/lib/interval-color";
import clsx from "clsx";
import { useDisplayType } from "../use-display-type";

interface Props {
  note: string;
  interval: string;
}

export const Note = ({ note, interval }: Props) => {
  const { isNote } = useDisplayType();
  return (
    <div
      className={clsx(
        "relative",
        intervalColorMap[interval] || "bg-gray-300",
        `h-6 w-6 rounded-full text-[10px] font-semibold`,
      )}
    >
      <div className="flex h-full w-full items-center justify-center">
        {isNote ? note : interval}
      </div>
    </div>
  );
};
