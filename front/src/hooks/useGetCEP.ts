import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type CEPResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
};

/**
 * Fetches address data based on State, City, and Street name from the ViaCEP API.
 * * @param state The state abbreviation (e.g., 'SP').
 * @param city The city name (e.g., 'Sao Paulo').
 * @param street The street name (e.g., 'Avenida Paulista').
 * @returns A promise that resolves to an array of matching address objects.
 */
const fetchCEP = async ({
  state,
  city,
  street,
}: {
  state: string;
  city: string;
  street: string;
}): Promise<CEPResponse[]> => {
  const cityFormated = encodeURIComponent(city);
  const streetFormated = encodeURIComponent(street);

  const url = `https://viacep.com.br/ws/${state}/${cityFormated}/${streetFormated}/json`;

  const response = await axios.get<CEPResponse[]>(url);

  return response.data;
};

/**
 * Custom hook to search for address (CEP) data using a combination of state, city, and street.
 * This query is only enabled when all three search parameters are provided.
 * * @param state The state (e.g., 'SP'). Should be undefined until ready.
 * @param city The city name (e.g., 'Sao Paulo'). Should be undefined until ready.
 * @param street The street name (e.g., 'Avenida Paulista'). Should be undefined until ready.
 * @returns An object containing the query data and status (isLoading, isError, etc.).
 */
export const useGetCEP = (state: string, city: string, street: string) => {
  const query = useQuery<CEPResponse[], unknown>({
    queryKey: ["cep-lookup", state, city, street],
    queryFn: () => fetchCEP({ state, city, street }),
    enabled: !!state && !!city && !!street && street.length >= 3,
    staleTime: 1000 * 60 * 60 * 24,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

const fetchAdress = async (cep: string): Promise<CEPResponse> => {
  const url = `https://viacep.com.br/ws/${cep}/json`;
  const response = await axios.get<CEPResponse>(url);
  return response.data;
};

export const useGetAdress = (cep: string) => {
  return useQuery<CEPResponse, unknown>({
    queryKey: ["cep-single", cep],
    queryFn: () => fetchAdress(cep),
    enabled: !!cep,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
