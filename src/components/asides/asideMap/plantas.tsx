import { useMapStore } from "../../../stores/mapStore";
import { MapCard } from "../../cards/mapCard";

export const Plantas = () => {
  const { currentGarden } = useMapStore();
  const plants = currentGarden?.garden.plants ?? [];

  if (!plants.length)
    return <p className="p-2 m-0">Nenhuma planta cadastrada.</p>;

  return (
    <>
      {plants.map((item) => (
        <MapCard.Plant
          key={item.plant.id}
          name={item.plant.nomeComum}
          nameCi={item.plant.nomeCientifico}
          quant={item.quant}
        />
      ))}
    </>
  );
};
