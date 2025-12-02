import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

import { EcoGardenApi } from "../../../lib/ecoGarden";
import { db } from "../../../lib/firebase";
import { useAuthStore } from "../../../stores/auth";
import { useMapStore } from "../../../stores/mapStore";
import type { SensorData } from "../../../types/collection/sensor";
import { MapCard } from "../../cards/mapCard";

const listenToSensorData = (
  gardenId: string,
  callback: (data: SensorData[]) => void
) => {
  const ref = collection(doc(db, "garden", gardenId), "sensor");

  return onSnapshot(
    ref,
    (snapshot) => {
      const readings: SensorData[] = [];
      snapshot.forEach((doc) => readings.push(doc.data() as SensorData));
      callback(readings);
    },
    (err) => console.error("Sensor listener error:", err)
  );
};

export const Sensores = () => {
  const { currentGarden } = useMapStore();
  const { user } = useAuthStore();
  const gardenId = currentGarden?.garden.id;

  const [sensors, setSensors] = useState<SensorData[] | null>(null);

  useEffect(() => {
    if (!gardenId) return;

    const unsub = listenToSensorData(gardenId, setSensors);

    return () => unsub();
  }, [gardenId]);

  if (!gardenId) return null;

  if (sensors === null) return <p className="p-2">Carregando sensores...</p>;

  if (sensors.length === 0)
    return <p className="p-2">Nenhum dado de sensor encontrado.</p>;

  const humidity = sensors.find((s) => s.type === "HUMIDITY");
  const temperature = currentGarden.weather.degrees;
  const water = sensors.find((s) => s.type === "WATER_LEVEL");

  const isOwner = user
    ? user.email === currentGarden.garden.owner.email
    : false;

  const muckEvent = async () => {
    const response = await EcoGardenApi.post("/sensor/event", { gardenId });

    return response;
  };

  return (
    <>
      {humidity && (
        <MapCard.Sensor
          header="Umidade"
          title={`${humidity.percentage}%`}
          text={``}
          progress={humidity.percentage}
          progressStyle="info"
        />
      )}

      {temperature && (
        <MapCard.Sensor
          header="Temperatura"
          title={`${temperature}°C`}
          text="Faixa ideal: 2°C - 40°C"
          progress={temperature}
          progressStyle="warning"
        />
      )}

      {water && (
        <MapCard.Sensor
          header="Nível d'água"
          title={`${water.depth_cm}%`}
          text="Estimativa baseada no sensor"
          progress={water.depth_cm}
          progressStyle="primary"
        />
      )}

      {isOwner ? (
        <button className="btn btn-primary w-100" onClick={muckEvent}>
          Regar
        </button>
      ) : null}
    </>
  );
};
