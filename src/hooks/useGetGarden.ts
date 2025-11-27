import { useQuery } from "@tanstack/react-query";

import { EcoGardenApi } from "../lib/ecoGarden";
import type { GardenResponse } from "../types/api/api.garden";

const getGardenById = async (id: string): Promise<GardenResponse> => {
  const response = await EcoGardenApi.get<{ data: GardenResponse }>(`/garden/${id}`);
  return response.data.data;
};

export const useGetGarden = (id: string) => {
  return useQuery({
    queryKey: ["garden", id],
    queryFn: () => getGardenById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 30,
    select: (data) => data,
  });
};
