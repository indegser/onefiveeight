"use client";

import { store, useTonic } from "@/lib/stores";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

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
      <SelectTrigger className="w-[60px]">
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
