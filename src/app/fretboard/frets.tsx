import clsx from "clsx";
import { memo, useMemo } from "react";

interface Props {
  frets: number;
}

const mainFrets = ["0", "3", "5", "7", "9", "12"];

const Component = ({ frets }: Props) => {
  const arr = useMemo(() => Array.from({ length: frets + 1 }), [frets]);
  return (
    <>
      {arr.map((_, fret) => {
        const isMainFret = mainFrets.includes(fret.toString());
        const fretWidth = isMainFret ? "w-[3px]" : "w-px";
        const fretColor = isMainFret ? "bg-gray-400" : "bg-gray-300";
        return (
          <div
            key={fret}
            //  Use scaleY to prevent fret overflow top and bottom. It's 5/6 of the height
            className={clsx`-left-1/2 row-span-full -translate-x-1/2 scale-y-[0.84] transform ${fretColor} ${fretWidth}`}
            style={{
              gridColumnStart: fret + 2,
            }}
          />
        );
      })}
    </>
  );
};

export const Frets = memo(Component, (a, b) => b.frets === a.frets);
