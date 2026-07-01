import axios from "axios";

export const EcoGardenApi = axios.create({
  baseURL: "http://localhost:3333",
});

export const setEcoGardenClient = (token: string) => {
  EcoGardenApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const removeEcoGardenClient = () => {
  delete EcoGardenApi.defaults.headers.common["Authorization"];
};
