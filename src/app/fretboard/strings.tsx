import { memo } from "react";

const strings = Array.from({ length: 6 });

const Component = () => {
  return (
    <>
      {strings.map((_, r) => (
        <div
          key={r}
          className="col-span-full h-px self-center bg-gray-300"
          style={{ gridRowStart: r + 1 }}
        />
      ))}
    </>
  );
};

Component.displayName = "Strings";
export const Strings = memo(Component);
