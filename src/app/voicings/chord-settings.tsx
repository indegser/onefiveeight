"use client";

import { DisplayTypeSelector } from "../settings/display-type-selector";
import { TonicSelector } from "../settings/tonic-selector";

export const ChordSettings = () => {
  return (
    <div className="flex items-center gap-4">
      <TonicSelector />
      <DisplayTypeSelector />
    </div>
  );
};
