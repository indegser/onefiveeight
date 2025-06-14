import { DisplayTypeSelector } from "./display-type-selector";
import { ScaleSelector } from "./scale-selector";
import { TonicSelector } from "./tonic-selector";

export const Settings = () => {
  return (
    <div className="flex items-center gap-4">
      <TonicSelector />
      <ScaleSelector />
      <DisplayTypeSelector />
    </div>
  );
};
