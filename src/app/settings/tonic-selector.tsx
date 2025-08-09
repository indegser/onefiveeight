import { store, useTonic } from "@/lib/stores";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NOTES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export const TonicSelector = () => {
  const tonic = useTonic();

  const onChange = (tonic: (typeof NOTES)[0]) => {
    store.setState((state) => ({
      ...state,
      tonic,
    }));
  };

  return (
    <Select value={tonic} onValueChange={onChange}>
      <SelectTrigger className="w-[70px]">
        <SelectValue placeholder="Tonic" />
      </SelectTrigger>
      <SelectContent>
        {NOTES.map((note) => (
          <SelectItem key={note} value={note}>
            {note}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
