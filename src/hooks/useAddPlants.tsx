import { useMutation } from "@tanstack/react-query";

import { EcoGardenApi } from "../lib/ecoGarden";

type AddPlantsRequest = {
  gardenId: string;
  plants: {
    plantId: number;
    quant: number;
  }[];
};

type AddPlantsResponse = {
  message: string;
  results: {
    plantId: number;
    status: "created" | "updated" | "error";
    message?: string;
    plantGarden?: {
      id: string;
      plantId: number;
      gardenId: string;
      quant: number;
      dataPlantio: string;
    };
  }[];
};

export const useAddPlantsToGarden = () => {
  return useMutation({
    mutationKey: ["garden:addPlants"],
    mutationFn: async (payload: AddPlantsRequest) => {
      const { data } = await EcoGardenApi.post<AddPlantsResponse>(
        "/garden/add/plants",
        payload
      );

      return data;
    },
  });
};
