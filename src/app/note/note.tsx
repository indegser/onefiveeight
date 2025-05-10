import clsx from "clsx";

interface Props {
  note: string;
  interval: string;
  displayNote?: boolean;
}

export const Note = ({ note, interval, displayNote = false }: Props) => {
  const isRoot = interval === "1P";

  return (
    <div
      className={clsx(
        isRoot && "bg-gray-800! text-white/90!",
        `h-6 w-6 rounded-full bg-gray-300 text-[10px] font-semibold text-gray-500`,
      )}
    >
      <div className="flex h-full w-full items-center justify-center">
        {displayNote ? note : interval}
      </div>
    </div>
  );
};
