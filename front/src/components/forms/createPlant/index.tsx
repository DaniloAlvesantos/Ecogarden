import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { EcoGardenApi } from "../../../lib/ecoGarden";
import { PrimaryButton } from "../../buttons/primary";
import { SecondaryInput } from "../../formFields/secondaryInput";

export type CreatePlantFormFields = {
  nomeComum: string;
  nomeCientifico: string;
  umidadeMin: number;
  umidadeMax: number;
  tempMin: number;
  tempMax: number;
};

export const CreatePlantForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<CreatePlantFormFields>({
    mode: "onBlur",
    defaultValues: {
      nomeComum: "",
      nomeCientifico: "",
      umidadeMin: 0,
      umidadeMax: 100,
      tempMin: 0,
      tempMax: 40,
    },
  });

  const onSubmit = async (data: CreatePlantFormFields) => {
    try {
      const response = await EcoGardenApi.post("/plant/create", data);

      const result = await response.data;

      if (!response.data || result.error) {
        alert(result.error || "Erro ao criar planta");
        return;
      }

      alert("Planta criada com sucesso!");

      reset();

      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("Erro interno do servidor");
    }
  };

  return (
    <div className="container py-4">
      <div className="mx-auto" style={{ maxWidth: "700px" }}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 bg-white rounded shadow-sm"
        >
          <h2 className="fw-bold mb-4">Cadastrar Nova Planta</h2>

          {/* Nome comum */}
          <div className="form-floating mb-3">
            <SecondaryInput<CreatePlantFormFields>
              name="nomeComum"
              type="text"
              id="nomeComum"
              placeholder="Nome comum"
              register={register}
              errors={errors}
              required="Nome comum é obrigatório"
            />

            <label htmlFor="nomeComum">Nome Comum</label>

            {errors.nomeComum && (
              <small className="text-danger">{errors.nomeComum.message}</small>
            )}
          </div>

          {/* Nome científico */}
          <div className="form-floating mb-3">
            <SecondaryInput<CreatePlantFormFields>
              name="nomeCientifico"
              type="text"
              id="nomeCientifico"
              placeholder="Nome científico"
              register={register}
              errors={errors}
              required="Nome científico é obrigatório"
            />

            <label htmlFor="nomeCientifico">Nome Científico</label>

            {errors.nomeCientifico && (
              <small className="text-danger">
                {errors.nomeCientifico.message}
              </small>
            )}
          </div>

          {/* Umidade mínima */}
          <div className="form-floating mb-3">
            <SecondaryInput<CreatePlantFormFields>
              name="umidadeMin"
              type="number"
              id="umidadeMin"
              placeholder="Umidade mínima"
              register={register}
              errors={errors}
              required="Umidade mínima é obrigatória"
              min={{
                value: 0,
                message: "Valor mínimo é 0",
              }}
              max={{
                value: 100,
                message: "Valor máximo é 100",
              }}
            />

            <label htmlFor="umidadeMin">Umidade Mínima (%)</label>

            {errors.umidadeMin && (
              <small className="text-danger">{errors.umidadeMin.message}</small>
            )}
          </div>

          {/* Umidade máxima */}
          <div className="form-floating mb-3">
            <SecondaryInput<CreatePlantFormFields>
              name="umidadeMax"
              type="number"
              id="umidadeMax"
              placeholder="Umidade máxima"
              register={register}
              errors={errors}
              required="Umidade máxima é obrigatória"
              min={{
                value: 0,
                message: "Valor mínimo é 0",
              }}
              max={{
                value: 100,
                message: "Valor máximo é 100",
              }}
            />

            <label htmlFor="umidadeMax">Umidade Máxima (%)</label>

            {errors.umidadeMax && (
              <small className="text-danger">{errors.umidadeMax.message}</small>
            )}
          </div>

          {/* Temperatura mínima */}
          <div className="form-floating mb-3">
            <SecondaryInput<CreatePlantFormFields>
              name="tempMin"
              type="number"
              id="tempMin"
              placeholder="Temperatura mínima"
              register={register}
              errors={errors}
              required="Temperatura mínima é obrigatória"
            />

            <label htmlFor="tempMin">Temperatura Mínima (°C)</label>

            {errors.tempMin && (
              <small className="text-danger">{errors.tempMin.message}</small>
            )}
          </div>

          {/* Temperatura máxima */}
          <div className="form-floating mb-4">
            <SecondaryInput<CreatePlantFormFields>
              name="tempMax"
              type="number"
              id="tempMax"
              placeholder="Temperatura máxima"
              register={register}
              errors={errors}
              required="Temperatura máxima é obrigatória"
            />

            <label htmlFor="tempMax">Temperatura Máxima (°C)</label>

            {errors.tempMax && (
              <small className="text-danger">{errors.tempMax.message}</small>
            )}
          </div>

          <div className="d-flex gap-2">
            <PrimaryButton
              type="submit"
              disabled={!isValid || !isDirty}
              text="Cadastrar Planta"
            />

            <button
              type="button"
              className="btn btn-secondary rounded-pill"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
