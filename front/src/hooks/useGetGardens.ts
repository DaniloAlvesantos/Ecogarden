import { useQuery } from "@tanstack/react-query";
import type { AxiosPromise } from "axios";

import { EcoGardenApi } from "../lib/ecoGarden";
import type { Gardens } from "../types/api/api.garden";

const getGardenById = async (): AxiosPromise<Gardens> => {
  const response = await EcoGardenApi.get<Gardens>(`/garden/all`);
  return response;
};

export const useGetGardens = () => {
  const query = useQuery({
    queryKey: ["garden", "all"],
    queryFn: getGardenById,
    staleTime: 1000 * 60 * 30,
  });

  const response = query.data;

  if (!response) return query;

  const data = response.data.data;

  return {
    ...query,
    data,
  };
};
