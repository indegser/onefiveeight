const strings = [...Array.from({ length: 6 })];

interface Props {
  hasOpenFret: boolean;
}

export const Strings = ({ hasOpenFret }: Props) => {
  return (
    <>
      {strings.map((_, r) => (
        <div
          key={r}
          className="col-span-full h-px self-center bg-gray-300"
          style={{ gridColumnStart: hasOpenFret ? 2 : 1, gridRowStart: r + 1 }}
        />
      ))}
    </>
  );
};
