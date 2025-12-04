import { useQuery } from "@tanstack/react-query";

import { EcoGardenApi } from "../lib/ecoGarden";

type Response = {
  gardensCount: number;
  recentGarden: {
    id: string;
    name: string;
  }[];
};

const fallbackData = {
  gardensCount: 0,
  recentGarden: [],
};

const getDashboardData = async (): Promise<Response> => {
  const response = await EcoGardenApi.get<Response>(`garden/dashboard`);
  return response.data ?? fallbackData;
};

export const useDashboard = () => {
  return useQuery({
    queryKey: ["garden", "dashboard"],
    queryFn: getDashboardData,
    staleTime: 1000 * 60 * 30,
  });
};
