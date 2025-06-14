import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { store, useDisplayType } from "@/lib/stores";

const ID = "display-selector";

export const DisplayTypeSelector = () => {
  const displayType = useDisplayType();
  const isNote = displayType === "note";

  const handleCheckedChange = () => {
    store.setState((state) => ({
      ...state,
      displayType: isNote ? "interval" : "note",
    }));
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        id={ID}
        checked={!isNote}
        onCheckedChange={handleCheckedChange}
      ></Switch>
      <Label htmlFor={ID}>{isNote ? "Notes" : "Intervals"}</Label>
    </div>
  );
};
