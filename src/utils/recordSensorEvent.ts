import { firestore_db } from "../lib/firebase/admin.js";
import type { SensorData } from "../@types/sensorData.js";
import { Timestamp } from "firebase-admin/firestore";

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
  } catch (err) {
    console.error("Erro ao gravar no Firestore:", err);
    throw err;
  }
}
