import { useState, useEffect } from "react";

import { useGetPlants } from "../../../hooks/useGetPlants";

interface SearchPlantProps {
  setValue: (value: string) => void;
}

export function SearchPlant({ setValue }: SearchPlantProps) {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  // debounce (1000ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(search);
    }, 1000);
    return () => clearTimeout(handler);
  }, [search]);

  const plants = useGetPlants(debounced);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setValue(search);
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 550 }}>
      <label className="form-label fw-bold">Buscar planta</label>
      <input
        type="text"
        className="form-control"
        placeholder="Digite o nome da planta..."
        value={search}
        onChange={handleChange}
        list="plants"
      />

      {/* Loading */}
      {plants.isLoading && (
        <div className="mt-3 alert alert-info py-2">Carregando...</div>
      )}

      {/* Results */}
      {plants.data && plants.data?.length > 0 && (
        <datalist id="plants">
          {plants.data.map((plant) => (
            <option key={plant.id} value={plant.nomeComum}>
              <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                {plant.nomeCientifico}
              </div>
            </option>
          ))}
        </datalist>
      )}

      {debounced && plants.data?.length === 0 && (
        <div className="alert alert-warning mt-3">
          Nenhuma planta encontrada.
        </div>
      )}
    </div>
  );
}
