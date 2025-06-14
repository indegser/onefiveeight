import { store, useScale } from "@/lib/stores";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as ScaleType from "@tonaljs/scale-type";

const SCALES = ScaleType.names().slice(0, 14);

export const ScaleSelector = () => {
  const scale = useScale();

  const onChange = (scale: (typeof SCALES)[0]) => {
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
        {SCALES.map((scale) => (
          <SelectItem key={scale} value={scale}>
            {scale.charAt(0).toUpperCase() + scale.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
