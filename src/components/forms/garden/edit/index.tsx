import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { LuLoader, LuSave } from "react-icons/lu";

import { useGetAdress } from "../../../../hooks/useGetCEP";
import { SecondaryInput } from "../../../formFields/secondaryInput";
import "./style.scss";
import { PrimaryModal } from "../../../modals/primaryModal";
import { SearchCEP } from "../SearchCEP";

export interface EditGardenFormFields {
  name: string;
  tamanhoM2: string;
  street: string;
  cep: string;
  city: string;
  state: string;
}

interface RefactoredGardenFormProps {
  onCancel: () => void;
  onSave: (data: EditGardenFormFields) => void;
  formData: EditGardenFormFields;
  isSaving: boolean;
}

const EditGardenForm: React.FC<RefactoredGardenFormProps> = ({
  formData,
  onCancel,
  onSave,
  isSaving,
}) => {
  const [cep, setCep] = useState(formData.cep);
  const adressRawData = useGetAdress(cep !== formData.cep ? cep : "");
  const adressData = adressRawData?.data;

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty },
    setValue,
  } = useForm<EditGardenFormFields>({
    defaultValues: {
      name: formData.name,
      tamanhoM2: formData.tamanhoM2,
      street: formData.street,
      cep: formData.cep,
      city: formData.city,
      state: formData.state,
    },
    mode: "onBlur",
  });

  const setCEP = (rawCEP: string) => {
    const cleaned = rawCEP.replace("-", "");
    setValue("cep", cleaned);
    setCep(cleaned);
  };

  const setLogradouro = (logradouro: string) => {
    console.log(logradouro);
    setValue("street", logradouro);
  };

  const adress = adressData
    ? {
        street: adressData.logradouro,
        city: adressData.localidade,
        state: adressData.uf,
      }
    : { street: formData.street, city: formData.city, state: formData.state };

  return (
    <div className="p-4 bg-white rounded shadow-lg border border-light">
      <form onSubmit={handleSubmit(onSave)}>
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label fw-medium">Nome da horta</label>
            <SecondaryInput<EditGardenFormFields>
              type="text"
              name="name"
              errors={errors}
              required="Nome da horta é obrigatório"
              placeholder="Enter nome da horta"
              register={register}
              id="garden-name"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-medium">Tamanho (m²)</label>
            <SecondaryInput<EditGardenFormFields>
              type="number"
              name="tamanhoM2"
              errors={errors}
              required="Tamanho é obrigatório"
              placeholder="Enter tamanho (m²)"
              register={register}
              id="garden-tamanho"
              inputMode="numeric"
              minLength={{
                value: 1,
                message: "O tamanho deve ser maior que 0",
              }}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-medium">Rua</label>
            <SecondaryInput<EditGardenFormFields>
              type="text"
              name="street"
              errors={errors}
              required="Rua é obrigatória"
              placeholder="Enter rua"
              register={register}
              id="garden-street"
              value={adress.street}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-medium">CEP</label>
            <SecondaryInput<EditGardenFormFields>
              type="text"
              name="cep"
              errors={errors}
              required="CEP é obrigatório"
              placeholder="Enter CEP"
              register={register}
              id="garden-cep"
            />
            <button
              className="btn btn-link p-0"
              data-bs-toggle="modal"
              data-bs-target="#cepModal"
              type="button"
            >
              Buscar CEP
            </button>

            <PrimaryModal
              id="cepModal"
              title="Buscar CEP"
              body={<SearchCEP setCEP={setCEP} setLogradouro={setLogradouro} />}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-medium">Cidade</label>
            <SecondaryInput<EditGardenFormFields>
              type="text"
              name="city"
              errors={errors}
              required="Cidade é obrigatória"
              placeholder="Enter cidade"
              register={register}
              id="garden-city"
              value={adress.city}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-medium">Estado</label>
            <SecondaryInput<EditGardenFormFields>
              type="text"
              name="state"
              errors={errors}
              required="Estado é obrigatório"
              placeholder="Enter estado"
              register={register}
              id="garden-state"
              value={adress.state}
            />
          </div>
        </div>
        <div className="d-flex justify-content-end gap-2 pt-3 border-top">
          <button
            onClick={onCancel}
            className="btn btn-secondary"
            type="button"
          >
            Cancel
          </button>

          <button
            disabled={isSaving || !isDirty}
            className="btn btn-success d-flex align-items-center"
          >
            {isSaving ? (
              <LuLoader
                className="me-2"
                size={16}
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : (
              <LuSave className="me-1" size={16} />
            )}
            {isSaving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
};

export { EditGardenForm };
