import { store, useScale } from "@/lib/stores";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SCALES = [
  {
    group: "Major",
    scales: ["major", "lydian", "melodic minor"],
  },
  { group: "Minor", scales: ["minor", "dorian", "harmonic minor"] },
  {
    group: "Dominant 7th",
    scales: [
      "mixolydian",
      "lydian b7",
      "altered",
      "half-whole diminished",
      "whole tone",
    ],
  },
  {
    group: "Etc",
    scales: [
      "phrygian",
      "locrian",
      "diminished",
      "major pentatonic",
      "chromatic",
    ],
  },
];

export const ScaleSelector = () => {
  const scale = useScale();

  const onChange = (scale: string) => {
    store.setState((state) => ({
      ...state,
      scale,
    }));
  };

  return (
    <Select value={scale} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Tonic" />
      </SelectTrigger>
      <SelectContent>
        {SCALES.map(({ group, scales }) => (
          <SelectGroup key={group}>
            <SelectLabel>{group}</SelectLabel>
            {scales.map((scale) => (
              <SelectItem key={scale} value={scale}>
                {scale.charAt(0).toUpperCase() + scale.slice(1)}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};
