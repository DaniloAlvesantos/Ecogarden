import { useQuery } from "@tanstack/react-query";

import { EcoGardenApi } from "../lib/ecoGarden";
import type { PlantModel } from "../types/api/api.plant";

const getPlantsByName = async (name: string): Promise<PlantModel[]> => {
  const response = await EcoGardenApi.get<{ plants: PlantModel[] }>(
    `/plant/${name}`
  );

  return response.data.plants;
};

export const useGetPlants = (name: string) => {
  return useQuery({
    queryKey: ["plant", name],
    queryFn: () => getPlantsByName(name),
    enabled: Boolean(name) && name.length >= 3,
    staleTime: 1000 * 60 * 30,
  });
};
