import type { Timestamp } from "firebase-admin/firestore";
import type { SensorData } from "../sensorData";
import type { IrrigationHistory } from "./irrigationHistory.collection";

export interface GardenCollection {
  name: string;
  irrigations: IrrigationHistory[];
  state: SensorData & {
    timestamp: Timestamp;
  };
}
