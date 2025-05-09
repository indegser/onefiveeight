import { Fingering } from "@/lib/guitar";

const strings = [...new Array(6)];

interface Props {
  fingering: Fingering;
}

export const Fretboard = ({ fingering }: Props) => {
  const lowestFret = fingering.reduce((acc, curr) => {
    if (curr.fret === 0) return acc;
    if (curr.fret < acc) {
      return curr.fret;
    }
    return acc;
  }, 100);

  const highestFret = fingering.reduce((acc, curr) => {
    if (curr.fret > acc) {
      return curr.fret;
    }
    return acc;
  }, 0);

  const frets = [...new Array(highestFret - lowestFret + 1)].map(
    (_, index) => index + lowestFret
  );

  return (
    <div className="w-28 border-b border-gray-500">
      {frets.map((_, index) => {
        const fretNumber = index + lowestFret;
        const fretFingerings = fingering.filter((f) => f.fret === fretNumber);

        return (
          <Fret
            key={index}
            fretNumber={fretNumber}
            fretFingerings={fretFingerings}
            isLowestFret={index === 0}
          ></Fret>
        );
      })}
    </div>
  );
};

const Fret = ({
  fretFingerings,
  fretNumber,
  isLowestFret,
}: {
  fretFingerings: Fingering;
  fretNumber: number;
  isLowestFret: boolean;
}) => {
  return (
    <div className="border-t border-gray-500 h-10 relative">
      {isLowestFret ? (
        <div className="absolute text-xs -translate-x-4 top-1/2 -translate-y-1/2">
          {fretNumber}
        </div>
      ) : null}
      <div className="flex justify-between h-full">
        {strings.map((_, index) => {
          const stringNumber = 6 - index;
          const fingering = fretFingerings.find(
            (f) => f.string === stringNumber
          );
          const isFingering = fingering !== undefined;
          return (
            <div key={index} className="w-[1px] h-full bg-gray-500 relative">
              {isFingering ? <Note fingering={fingering} /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Note = ({
  isMute,
  fingering,
}: {
  isMute?: boolean;
  fingering: Fingering[number];
}) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm flex items-center">
      {isMute ? (
        "X"
      ) : (
        <div className="w-5 h-5 rounded-full text-black text-[10px] text-center items-center justify-center flex bg-orange-200">
          {fingering.note}
        </div>
      )}
    </div>
  );
};
