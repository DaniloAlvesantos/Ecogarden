import { useState, useEffect } from "react";

import { useGetPlants } from "../../../hooks/useGetPlants";
import type { PlantModel } from "../../../types/api/api.plant";

interface SearchPlantProps {
  onSelect: (plant: PlantModel) => void;
  defaultValue?: string;
}

export function SearchPlant({ onSelect, defaultValue = "" }: SearchPlantProps) {
  const [search, setSearch] = useState(defaultValue);
  const [debounced, setDebounced] = useState("");
  const [selected, setSelected] = useState(false);

  // debounce (600ms)
  useEffect(() => {
    if (selected) return;
    const handler = setTimeout(() => {
      setDebounced(search);
    }, 600);
    return () => clearTimeout(handler);
  }, [search, selected]);

  const plants = useGetPlants(debounced);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSelected(false);
  };

  const handleSelect = (plant: PlantModel) => {
    setSearch(plant.nomeComum);
    setSelected(true);
    setDebounced("");
    onSelect(plant);
  };

  const showDropdown =
    !selected && debounced.length >= 3 && !plants.isLoading;

  return (
    <div className="position-relative">
      <input
        type="text"
        className="form-control"
        placeholder="Digite o nome da planta..."
        value={search}
        onChange={handleChange}
        autoComplete="off"
      />

      {plants.isLoading && (
        <div className="position-absolute top-100 start-0 w-100 bg-white border rounded shadow-sm z-3 px-3 py-2 text-muted small">
          Carregando...
        </div>
      )}

      {showDropdown && plants.data && plants.data.length > 0 && (
        <ul
          className="list-unstyled position-absolute top-100 start-0 w-100 bg-white border rounded shadow-sm z-3 mb-0"
          style={{ maxHeight: "12rem", overflowY: "auto" }}
        >
          {plants.data.map((plant) => (
            <li
              key={plant.id}
              className="px-3 py-2 border-bottom"
              style={{ cursor: "pointer" }}
              onMouseDown={() => handleSelect(plant)}
            >
              <span className="fw-medium">{plant.nomeComum}</span>
              <span className="text-muted small ms-2">
                {plant.nomeCientifico}
              </span>
            </li>
          ))}
        </ul>
      )}

      {showDropdown && debounced && plants.data?.length === 0 && (
        <div className="position-absolute top-100 start-0 w-100 bg-white border rounded shadow-sm z-3 px-3 py-2 text-warning small">
          Nenhuma planta encontrada.
        </div>
      )}
    </div>
  );
}