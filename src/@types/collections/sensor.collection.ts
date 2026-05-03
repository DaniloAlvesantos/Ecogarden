import type { Timestamp } from "firebase-admin/firestore";

interface BaseSensorData {
  timestamp: Timestamp;
}

export interface SoloHumidity extends BaseSensorData {
  type: "solo_humidity";
  percentage: number;
}

export interface FlowRate extends BaseSensorData {
  type: "flow_rate";
  rate: number;
}

export type SensorCollectionData = SoloHumidity | FlowRate;