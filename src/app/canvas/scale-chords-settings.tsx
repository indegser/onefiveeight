import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  scaleChordsSettingsStore,
  useScaleChordsDisplayType,
} from "@/lib/stores";

const ID = "scale-chords-settings";

export const ScaleChordsSettings = () => {
  const checked = useScaleChordsDisplayType() === "seventh";

  const handleCheckedChange = (checked: boolean) => {
    scaleChordsSettingsStore.setState({
      displayType: checked ? "seventh" : "triad",
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        id={ID}
        checked={checked}
        onCheckedChange={handleCheckedChange}
      ></Switch>
      <Label htmlFor={ID}>{checked ? "Seventh" : "Triad"}</Label>
    </div>
  );
};
