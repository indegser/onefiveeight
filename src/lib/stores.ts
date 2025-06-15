import { Store, useStore } from "@tanstack/react-store";

export const store = new Store({
  tonic: "C", // Default root note
  scale: "major",
  displayType: "interval", // Default display type
});

export const useTonic = () => useStore(store, (state) => state.tonic);
export const useScale = () => useStore(store, (state) => state.scale);
export const useDisplayType = () =>
  useStore(store, (state) => state.displayType);

export const scaleChordsSettingsStore = new Store({
  displayType: "seventh",
});

export const useScaleChordsDisplayType = () =>
  useStore(scaleChordsSettingsStore, (state) => state.displayType);
