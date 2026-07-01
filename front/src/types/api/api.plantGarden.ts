export interface PlantGardenModel {
  id: string;
  plantId: number;
  gardenId: string;
  quant: number;
  dataPlantio: string;
}

export interface AddPlantGarden {
  gardenId: string;
  plantId: number;
  quant: number;
  dataPlantio: string;
}

export type AddPlantGardenResponse =
  | {
      error: string;
      plantId: number;
      message?: never;
      plantGarden?: never;
    }
  | {
      message: string;
      plantGarden: {
        id: string;
        gardenId: string;
        plantId: number;
        quant: number;
        dataPlantio: Date;
      };
      error?: never;
      plantId?: never;
    };
