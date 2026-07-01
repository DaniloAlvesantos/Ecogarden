export interface IrrigationModel {
  id: string;
  irrigationHistoryId: string;
  temperature: number;
  humidity: number;
  timestamp: Date;
  volume: number;
}
