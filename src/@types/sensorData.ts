enum SensorType {
  soloHumidity="solo_humidity",
  flowRate="flow_rate",
}

export interface SensorData {
    [SensorType.soloHumidity]: number;
    [SensorType.flowRate]: number;
    pump: boolean;
    message: string;
}