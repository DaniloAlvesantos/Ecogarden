import type { DefaultResponse } from "./api.default";
import type { IrrigationHistoryModel } from "./api.history";
import type { PlantModel } from "./api.plant";

export interface GardenModel {
  number: number;
  name: string;
  cep: string;
  tamanhoM2: number;
  id: string;
  userId: string;
  lat: number;
  lng: number;
  imgUrl: string;
  createdAt: string;
  owner: {
    name: string;
    email: string;
  };
  plants: {
    plant: PlantModel;
    quant: number;
  }[];
}

export interface GardenResponse {
  garden: GardenModel;
  location: {
    city: string;
    state: string;
    street: string;
  };
  irrigationHistory: IrrigationHistoryModel[];
  weather: {
    degrees: number;
  };
}

export type Garden = DefaultResponse<GardenResponse>;
export type Gardens = DefaultResponse<GardenResponse[]>;
