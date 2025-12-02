import React from "react";
import { LuUtensils } from "react-icons/lu";

import type { GardenModel } from "../../types/api/api.garden";

interface PlantListProps {
  plants: GardenModel["plants"];
  setShowAddPlantsForm: (show: boolean) => void;
}

export const PlantList: React.FC<PlantListProps> = ({ plants, setShowAddPlantsForm }) => (
  <div className="p-4 bg-white rounded shadow-lg border h-100">
    <h3 className="fs-4 fw-bold mb-3 d-flex align-items-center">
      <LuUtensils className="me-2 text-success" size={20} />
      Hortaliças atuais
    </h3>
    <ul className="list-unstyled">
      {plants.map((p, index) => (
        <li
          key={index}
          className="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-2"
        >
          <span className="fw-medium">{p.plant.nomeComum}</span>
          <span className="text-success fw-semibold fs-5">x{p.quant}</span>
        </li>
      ))}
    </ul>
    <button className="btn btn-success w-100" onClick={() => setShowAddPlantsForm(true)}>Editar</button>
  </div>
);
