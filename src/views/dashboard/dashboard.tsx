import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import GnomeLost from "../../assets/mascots/gnome-lost.png";
import { DashboardChart } from "../../components/chart/dashoboard";
import { useDashboard } from "../../hooks/useDashboard";

import { DashboardSkeleton } from "./loading";

import "./loading.scss";

export const DashboardView = () => {
  const [selectedGarden, setSelectedGarden] = useState("");
  const { data, isLoading } = useDashboard();

  useEffect(() => {
    if (data) {
      setSelectedGarden(data.recentGarden?.[0]?.id ?? "");
    }
  }, [data]);

  if (isLoading) return <DashboardSkeleton />;

  if (!data)
    return <div className="text-danger">Erro ao carregar dashboard.</div>;

  const handleGardenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGarden(e.target.value);
  };

  const hasContent = data.recentGarden.length > 0;

  return (
    <section>
      <div>
        <h1>Dashboard</h1>
        <p className="text-eco-mutated">Seja bem vindo ao Dashboard</p>
      </div>

      {hasContent ? (
        <div className="container-fluid">
          <select
            className="form-select mb-4"
            aria-label="Trocar horta"
            onChange={handleGardenChange}
            value={selectedGarden}
          >
            {data.recentGarden.map((garden) => (
              <option key={garden.id} value={garden.id}>
                {garden.name}
              </option>
            ))}
          </select>
          {selectedGarden && <DashboardChart gardenId={selectedGarden} />}
        </div>
      ) : (
        <div className="container-fluid">
          <div
            className="d-flex flex-column align-items-center card p-2"
            style={{ maxWidth: "20rem" }}
          >
            <span className="fs-6 fw-medium">
              Você ainda não cadastrou nenhuma horta
            </span>
            <img
              src={GnomeLost}
              alt="gnome lost"
              style={{ maxHeight: "10rem" }}
            />
            <Link to="/dashboard/garden/create" className="btn btn-link p-0">
              Cadastrar agora
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};
