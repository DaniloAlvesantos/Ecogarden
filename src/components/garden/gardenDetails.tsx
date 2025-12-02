import { useState, useEffect } from "react";
import { LuPencil, LuMapPin, LuSquare } from "react-icons/lu";

import { useAddPlantsToGarden } from "../../hooks/useAddPlants";
import { EcoGardenApi } from "../../lib/ecoGarden";
import type { GardenResponse } from "../../types/api/api.garden";
import {
  EditGardenForm,
  type EditGardenFormFields,
} from "../forms/garden/edit";
import { AddPlantsForm } from "../forms/plants";

import { HistoryList } from "./historyList";
import { InfoCard } from "./infoCard";
import { PlantList } from "./plantList";

interface SaveMessage {
  type: "success" | "error";
  text: string;
}

interface GardenDetailsProps {
  initialGardenData: GardenResponse;
}

export const GardenDetails: React.FC<GardenDetailsProps> = ({
  initialGardenData,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [gardenState, setGardenState] = useState(initialGardenData.garden);
  const [locationState, setLocationState] = useState(
    initialGardenData.location
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<SaveMessage | null>(null);

  const [formData, setFormData] = useState(initialGardenData.garden);
  const [locationData, setLocationData] = useState(initialGardenData.location);
  const [showAddPlantsForm, setShowAddPlantsForm] = useState(false);

  const addPlants = useAddPlantsToGarden();

  useEffect(() => {
    if (isEditing) {
      setFormData(gardenState);
      setLocationData(locationState);
      setSaveMessage(null);
    }
  }, [isEditing, gardenState, locationState]);

  const handleEditClick = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setSaveMessage(null);
  };

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
      const response = await EcoGardenApi.put("/garden/update", body);

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
    } catch (err) {
      console.error(err);
    }
  };

  const fullAddress = `${locationState.street}, ${locationState.city}, ${locationState.state}`;

  if (isEditing) {
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
  }

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

          <div className="position-absolute bottom-0 start-0 p-4">
            <h1 className="display-4 fw-bold text-white">{gardenState.name}</h1>
            <p className="fs-5 text-white-50 mt-2">{fullAddress}</p>
          </div>

          <button
            onClick={handleEditClick}
            className="btn btn-success rounded-circle position-absolute top-0 end-0 m-3 shadow"
            style={{ width: "3rem", height: "3rem" }}
          >
            <LuPencil size={20} />
          </button>
        </div>

        <div className="p-4">
          {/* Info messages */}
          {saveMessage && (
            <div
              className={`alert ${
                saveMessage.type === "success"
                  ? "alert-success"
                  : "alert-danger"
              } mb-4`}
            >
              {saveMessage.text}
            </div>
          )}

          {/* Info cards */}
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

          {/* Plants and irrigation history */}
          <div className="row g-3" id="plantAndIrrigation">
            <div className="col-lg-6">
              {!showAddPlantsForm ? (
                <PlantList
                  plants={gardenState.plants}
                  setShowAddPlantsForm={setShowAddPlantsForm}
                />
              ) : (
                <div className="scroll-container">
                  <AddPlantsForm
                    plants={gardenState.plants}
                    isSaving={addPlants.isPending}
                    onSubmit={(data) => {
                      addPlants.mutate(
                        {
                          gardenId: gardenState.id,
                          plants: data.plants.map((item) => ({
                            plantId: Number(item.plantId),
                            quant: Number(item.quant),
                          })),
                        },
                        {
                          onSuccess: (updatedGarden) => {
                            alert(updatedGarden.message);
                            setShowAddPlantsForm(false);
                          },
                          onError: (err) => console.error(err),
                        }
                      );
                    }}
                  />
                </div>
              )}
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
};
