import clsx from "clsx";
import { useMemo } from "react";

interface Props {
  startFret: number;
  endFret: number;
}

const mainFrets = ["0", "3", "5", "7", "9", "12", "15", "17", "19", "22"];

const Component = ({ startFret, endFret }: Props) => {
  const frets = useMemo(
    () =>
      Array.from({ length: endFret - startFret + 1 }).map(
        (_, i) => i + startFret,
      ),
    [startFret, endFret],
  );

  return (
    <>
      {frets.map((fret, index) => {
        const isMainFret = mainFrets.includes(fret.toString());
        const fretWidth = isMainFret ? "w-[3px]" : "w-px";
        const fretColor = isMainFret ? "bg-gray-400" : "bg-gray-300";
        return (
          <div
            key={fret}
            //  Use scaleY to prevent fret overflow top and bottom. It's 5/6 of the height
            className={clsx`relative row-span-full -translate-x-1/2 scale-y-[0.84] transform ${fretColor} ${fretWidth}`}
            style={{
              gridColumnStart: index + 1 + 1, // +1 because grid starts at 1
            }}
          >
            {isMainFret ? (
              <div className="absolute -top-[20px] text-xs text-gray-600">
                {fret}
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
};

export const Frets = Component;
