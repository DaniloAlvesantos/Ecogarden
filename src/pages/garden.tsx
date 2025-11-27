import { useState, useEffect, useMemo, useCallback } from "react";
import {
  LuLoader,
  LuPencil,
  LuMapPin,
  LuSquare,
  LuUtensils,
  LuDroplets,
} from "react-icons/lu";
import { useParams } from "react-router-dom";

import {
  EditGardenForm,
  type EditGardenFormFields,
} from "../components/forms/garden/edit";
import { Header } from "../components/header";
import { useGetGarden } from "../hooks/useGetGarden";
import { EcoGardenApi } from "../lib/ecoGarden";
import type { GardenResponse, GardenModel } from "../types/api/api.garden";
import type { IrrigationHistoryModel } from "../types/api/api.history";
import { ErrorView } from "../views";

export const Garden = () => {
  const { gardenId } = useParams<{ gardenId: string }>();

  const { data: gardenData, isLoading, error } = useGetGarden(gardenId || "");
  console.log(gardenData);

  if (!gardenId) {
    return (
      <div className="text-center p-5 fs-4 text-danger">
        Error: Garden ID is missing.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="d-flex flex-column align-items-center p-4 bg-white rounded shadow-lg">
          <LuLoader
            className="text-success"
            size={40}
            style={{ animation: "spin 1s linear infinite" }}
          />
          <p className="mt-3 text-secondary fw-medium">Loading Garden...</p>
        </div>
      </div>
    );
  }

  if (error || !gardenData) {
    return <ErrorView />;
  }

  return (
    <>
      <Header
        navigation={[
          { title: "Dashboard", url: "/" },
          { title: "Hortas", url: "/dashboard/my/gardens", isFeature: true },
        ]}
      />
      <div className="min-vh-100">
        <GardenDetails initialGardenData={gardenData} />
      </div>
    </>
  );
};

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, value }) => (
  <div className="d-flex align-items-center gap-3 p-3 bg-white rounded shadow-sm border">
    <div
      className="p-3 rounded-circle text-success"
      style={{ backgroundColor: "#d1f4e0" }}
    >
      {icon}
    </div>
    <div>
      <p className="text-secondary small mb-1 fw-medium">{title}</p>
      <p className="fs-5 fw-semibold mb-0">{value}</p>
    </div>
  </div>
);

interface PlantListProps {
  plants: GardenModel["plants"];
}

const PlantList: React.FC<PlantListProps> = ({ plants }) => (
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
  </div>
);

interface HistoryListProps {
  history: IrrigationHistoryModel[];
}

const HistoryList: React.FC<HistoryListProps> = ({ history }) => (
  <div className="p-4 bg-white rounded shadow-lg border h-100">
    <h3 className="fs-4 fw-bold mb-3 d-flex align-items-center">
      <LuDroplets className="me-2 text-primary" size={20} />
      Irrigações recentes
    </h3>
    <ul className="list-unstyled">
      {history.map((h, index) => (
        <li
          key={index}
          className="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-2"
        >
          <span>{new Date(h.timestamp).toLocaleDateString()}</span>
          <span className="text-primary fw-semibold">{h.volume} ML</span>
        </li>
      ))}
    </ul>
  </div>
);

interface SaveMessage {
  type: "success" | "error";
  text: string;
}

interface GardenDetailsProps {
  initialGardenData: GardenResponse;
}

const GardenDetails: React.FC<GardenDetailsProps> = ({ initialGardenData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [gardenState, setGardenState] = useState(initialGardenData.garden);
  const [locationState, setLocationState] = useState(
    initialGardenData.location
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<SaveMessage | null>(null);
  const [formData, setFormData] = useState(initialGardenData.garden);
  const [locationData, setLocationData] = useState(initialGardenData.location);

  useEffect(() => {
    if (isEditing) {
      setFormData(gardenState);
      setLocationData(locationState);
      setSaveMessage(null);
    }
  }, [isEditing, gardenState, locationState]);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setSaveMessage(null);
  }, []);

  const handleSave = async (data: EditGardenFormFields) => {
    setIsSaving(true);
    setSaveMessage(null);

    const body = {
      id: gardenState.id,
      name: data.name,
      cep: data.cep,
      place: `${data.street}, ${data.city}, ${data.state}`,
      number: gardenState.number.toString(),
      tamanhoM2: data.tamanhoM2,
    };

    try {
      await EcoGardenApi.put("/garden/update", body).then((response) => {
        if (response.status !== 200) {
          return setSaveMessage({
            type: "error",
            text: "Erro ao salvar as alterações.",
          });
        }

        setGardenState(formData);
        setLocationState({
          city: data.city,
          state: data.state,
          street: data.street,
        });
        setIsSaving(false);
        setIsEditing(false);
        setSaveMessage({
          type: "success",
          text: "Informações alteradas com sucesso!",
        });
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fullAddress = useMemo(
    () =>
      `${locationState.street}, ${locationState.city}, ${locationState.state}`,
    [locationState]
  );

  if (!isEditing) {
    return (
      <div className="container py-4" style={{ maxWidth: "1200px" }}>
        <div className="position-relative bg-white rounded shadow-lg overflow-hidden">
          <div
            className="position-relative"
            style={{ height: "16rem", backgroundColor: "#e5e7eb" }}
          >
            <div
              className="w-100 h-100"
              style={{
                backgroundImage: `url(${gardenState.imgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                background:
                  "linear-gradient(to top, rgba(17, 24, 39, 0.7), transparent)",
              }}
            />
            <div className="position-absolute bottom-0 start-0 p-4">
              <h1 className="display-4 fw-bold text-white">
                {gardenState.name}
              </h1>
              <p className="fs-5 text-white-50 mt-2">{fullAddress}</p>
            </div>
            <button
              onClick={handleEditClick}
              className="btn btn-success rounded-circle position-absolute top-0 end-0 m-3 shadow"
              style={{ width: "3rem", height: "3rem" }}
              aria-label="Edit Garden"
            >
              <LuPencil size={20} />
            </button>
          </div>

          <div className="p-4">
            {saveMessage && (
              <div
                className={`alert ${
                  saveMessage.type === "success"
                    ? "alert-success"
                    : "alert-danger"
                } mb-4`}
                role="alert"
              >
                {saveMessage.text}
              </div>
            )}

            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <InfoCard
                  icon={<LuMapPin size={24} />}
                  title="Localização (Lat/Lng)"
                  value={`${gardenState.lat.toFixed(
                    4
                  )}, ${gardenState.lng.toFixed(4)}`}
                />
              </div>
              <div className="col-md-4">
                <InfoCard
                  icon={<LuSquare size={24} />}
                  title="Tamanho da Horta"
                  value={`${gardenState.tamanhoM2} m²`}
                />
              </div>
              <div className="col-md-4">
                <InfoCard
                  icon={<LuPencil size={24} />}
                  title="Adiministrado por"
                  value={gardenState.owner.name}
                />
              </div>
            </div>

            <div className="row g-3">
              <div className="col-lg-6">
                <PlantList plants={gardenState.plants} />
              </div>
              <div className="col-lg-6">
                <HistoryList history={initialGardenData.irrigationHistory} />
              </div>
            </div>

            <p className="mt-4 text-secondary small border-top pt-3">
              Horta ID:{" "}
              <code className="bg-light p-1 rounded">{gardenState.id}</code>
              {" | "}Criado em:{" "}
              {new Date(gardenState.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const defaultFormData = {
    name: gardenState.name,
    tamanhoM2: String(gardenState.tamanhoM2),
    street: locationData.street,
    cep: gardenState.cep,
    city: locationData.city,
    state: locationData.state,
  };

  return (
    <div className="container py-4" style={{ maxWidth: "900px" }}>
      <h1 className="display-6 fw-bold mb-4 d-flex align-items-center">
        <LuPencil className="me-2 text-success" size={24} />
        Editar informações da horta
      </h1>
      <EditGardenForm
        formData={defaultFormData}
        onCancel={handleCancel}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
};

const style = document.createElement("style");
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
