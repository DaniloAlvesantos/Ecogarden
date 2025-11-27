import { create } from "zustand";

import type { GardenResponse } from "../types/api/api.garden";
import type { SensorData } from "../types/collection/sensor";

interface MapStoreProps {
  showAside: boolean;
  setShowAside: (state: boolean) => void;
  currentGarden: GardenResponse | null;
  gardenSensors: SensorData[] | null;
  setGardenSensors: (newState: SensorData[] | null) => void;
  setCurrentGarden: (newState: GardenResponse) => void;
}

export const useMapStore = create<MapStoreProps>((set) => ({
  showAside: false,
  setShowAside: (newState) => set({ showAside: newState }),
  currentGarden: null,
  setCurrentGarden: (newState) => set({ currentGarden: newState }),
  gardenSensors: null,
  setGardenSensors: (newState) => set({ gardenSensors: newState }),
}));
