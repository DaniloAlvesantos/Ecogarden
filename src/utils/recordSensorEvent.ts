import { firestore_db } from "../lib/firebase/admin.js";
import type { SensorData } from "../@types/sensorData.js";
import { Timestamp } from "firebase-admin/firestore";
import { recordIrrigationEvent } from "./recordIrrigationEvent.js";

export async function recordSensorData(
  gardenId: string,
  sensorData: SensorData,
): Promise<void> {
  const gardenDocRef = firestore_db.collection("garden").doc(gardenId);

  const dataToSave = {
    ...sensorData,
    timestamp: Timestamp.now(),
  };

  try {
    await gardenDocRef.update({
      state: dataToSave,
    });

    await recordIrrigationEvent({
      gardenId,
      humidity: dataToSave.solo_humidity,
      temperature: 0,
      volume: dataToSave.flow_rate,
    });
  } catch (err) {
    console.error("Erro ao gravar no Firestore:", err);
    throw err;
  }
}
