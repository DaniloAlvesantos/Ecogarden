import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { AxiosPromise, AxiosResponse } from "axios";

import { EcoGardenApi } from "../lib/ecoGarden";
import type { GardenModel } from "../types/api/api.garden";

type Response = {
  gardens: Omit<GardenModel, "plants">[];
};

type GardensData = Response;

const getUserGardens = async (): AxiosPromise<Response> => {
  const response = await EcoGardenApi.get<Response>(`/garden/user`);
  return response;
};

type UseGetUserGardensResult = Omit<
  UseQueryResult<GardensData, Error>,
  "data"
> & {
  data: GardensData;
};

export const useGetUserGardens = () => {
  const query = useQuery<AxiosResponse<Response>, Error, GardensData>({
    queryKey: ["gardens", "user"],
    queryFn: getUserGardens,
    staleTime: 1000 * 60 * 30,
    select: (response) => response.data,
  });

  return query as UseGetUserGardensResult;
};
