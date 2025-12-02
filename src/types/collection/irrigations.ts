import type { Timestamp } from "firebase/firestore";

export interface Irrigations {
  humidity: number;
  temperature: number;
  timestamp: Timestamp;
  volume: number;
}
