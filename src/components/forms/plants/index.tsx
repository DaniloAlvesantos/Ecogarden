import { useFieldArray, useForm } from "react-hook-form";
import { LuPlus, LuTrash } from "react-icons/lu";

import type { GardenModel } from "../../../types/api/api.garden";
import { PrimaryButton } from "../../buttons/primary";
// import { SearchPlant } from "../../formFields/searchPlant";
import { SecondaryInput } from "../../formFields/secondaryInput";

export type AddPlantsFormFields = {
  plants: {
    plantId: number;
    quant: number;
  }[];
};

interface AddPlantsFormProps {
  onSubmit: (data: AddPlantsFormFields) => void;
  isSaving?: boolean;
  plants: GardenModel["plants"];
}

export const AddPlantsForm = ({
  onSubmit,
  isSaving,
  plants,
}: AddPlantsFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<AddPlantsFormFields>({
    mode: "onBlur",
    defaultValues: {
      plants: plants.map((plant) => ({
        plantId: plant.plant.id,
        quant: plant.quant,
      })) ?? [{ plantId: 1, quant: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "plants",
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-3 bg-white rounded shadow-sm"
    >
      <h3 className="mb-3 fw-bold">Adicionar Hortaliças à Horta</h3>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border rounded p-3 mb-3 bg-light position-relative"
        >
          <div className="form-floating mb-3">
            <SecondaryInput<AddPlantsFormFields>
              name={`plants.${index}.plantId`}
              type="number"
              id={`plantId-${index}`}
              placeholder="ID da Planta"
              register={register}
              errors={errors}
              required="ID da planta é obrigatório"
              minLength={{
                value: 1,
                message: "ID inválido",
              }}
            />
            <label htmlFor={`plantId-${index}`}>ID da Planta</label>
            {errors.plants?.[index]?.plantId && (
              <small className="text-danger">
                {errors.plants[index]?.plantId?.message}
              </small>
            )}
          </div>

          <div className="form-floating mb-3">
            <SecondaryInput<AddPlantsFormFields>
              name={`plants.${index}.quant`}
              type="number"
              id={`plantQuant-${index}`}
              placeholder="Quantidade"
              register={register}
              errors={errors}
              required="Quantidade é obrigatória"
              minLength={{
                value: 1,
                message: "Quantidade precisa ser no mínimo 1",
              }}
            />
            <label htmlFor={`plantQuant-${index}`}>Quantidade</label>
            {errors.plants?.[index]?.quant && (
              <small className="text-danger">
                {errors.plants[index]?.quant?.message}
              </small>
            )}
          </div>

          {fields.length > 1 && (
            <button
              type="button"
              className="btn btn-danger position-absolute top-0 end-0 m-2 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "2.3rem", height: "2.3rem" }}
              onClick={() => remove(index)}
            >
              <LuTrash />
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        className="btn btn-outline-success w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
        onClick={() => append({ plantId: 0, quant: 1 })}
      >
        <LuPlus /> Adicionar Outra Planta
      </button>

      <PrimaryButton
        type="submit"
        disabled={!isValid || isSaving || !isDirty}
        text={isSaving ? "Salvando..." : "Adicionar Hortaliças"}
      />
      <button className="btn btn-secondary rounded-pill mx-2">Cancel</button>
    </form>
  );
};
