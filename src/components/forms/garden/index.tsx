import { useEffect, useState } from "react";
import { LuCloudUpload } from "react-icons/lu";
import { PrimaryButton } from "../../buttons/primary";
import "./style.scss";
import { SecondaryInput } from "../../formFields/secondaryInput";
import { useForm } from "react-hook-form";
import { PrimaryModal } from "../../modals/primaryModal";
import { SearchCEP } from "./SearchCEP";
import { useGetAdress } from "../../../hooks/useGetCEP";

interface GardenFormProps {
  name: string;
  cep: number;
  logradouro: string;
  numero: number;
  tamanho: number;
  picture: FileList;
}

export const GardenForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<GardenFormProps>({
    mode: "onBlur",
  });

  const [cep, setCEPState] = useState<string>("");

  const adressData = useGetAdress(cep);

  const onSubmit = (data: GardenFormProps) => {
    console.table(data);
  };

  const setCEP = (rawCEP: string) => {
    const cleaned = rawCEP.replace("-", "");
    setValue("cep", Number(cleaned));
    setCEPState(cleaned);
  };

  const setLogradouro = (logradouro: string) => {
    setValue("logradouro", logradouro);
  };

  useEffect(() => {
    if (!adressData?.data) return;
    const logradouro = adressData.data.logradouro;
    if (logradouro) {
      const { logradouro, uf, localidade } = adressData.data;
      const adress = `${logradouro}, ${localidade} - ${uf}`;
      setValue("logradouro", adress);
    }
  }, [adressData, setValue]);

  return (
    <section>
      <div>
        <h2 className="fs-1">Crie uma nova horta</h2>
        <p className="text-eco-mutated fs-5">
          Preencha o formulário abaixo para a criação de sua horta
        </p>
      </div>

      <form id="garden-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          {/* Nome da Horta */}
          <div className="col-12 col-md-6">
            <label className="form-label">Nome da horta</label>
            <SecondaryInput<GardenFormProps>
              type="text"
              name="name"
              errors={errors}
              required="Nome da horta é obrigatório"
              placeholder="Horta Comunitária"
              register={register}
              id="garden-name"
            />
          </div>

          {/* CEP */}
          <div className="col-12 col-md-6">
            <label className="form-label">CEP</label>
            <SecondaryInput<GardenFormProps>
              type="text"
              name="cep"
              errors={errors}
              required="CEP é obrigatório"
              placeholder="00000-000"
              register={register}
              inputMode="numeric"
              id="garden-cep"
              onBlur={(e) => setCEP(e.target.value)}
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
        </div>

        <div className="row">
          {/* Logradouro */}
          <div className="col-12 col-md-4">
            <label className="form-label">Logradouro</label>
            <SecondaryInput<GardenFormProps>
              type="text"
              name="logradouro"
              errors={errors}
              required="Logradouro é obrigatório"
              placeholder="Rua das Flores"
              register={register}
              id="garden-logradouro"
              disabled={true}
            />
          </div>

          {/* Número */}
          <div className="col-12 col-md-4">
            <label className="form-label">Número</label>
            <SecondaryInput<GardenFormProps>
              type="text"
              name="numero"
              errors={errors}
              required="Número é obrigatório"
              placeholder="123"
              inputMode="numeric"
              register={register}
              id="garden-numero"
            />
          </div>

          {/* Tamanho */}
          <div className="col-12 col-md-4">
            <label className="form-label">
              Tamanho m<sup>2</sup>
            </label>
            <SecondaryInput<GardenFormProps>
              type="number"
              name="tamanho"
              errors={errors}
              required="Tamanho é obrigatório"
              placeholder="100"
              inputMode="numeric"
              register={register}
              id="garden-tamanho"
            />
          </div>
        </div>

        {/* Foto */}
        <div className="col-12 mt-4">
          <div>
            <h3 className="fs-3">Foto</h3>
            <p className="text-eco-mutated">Envie uma foto da horta</p>

            <label htmlFor="file-inp" id="label-file-inp">
              <input
                type="file"
                id="file-inp"
                {...register("picture", {
                  required: "A foto da horta é obrigatória",
                  validate: {
                    validType: (files) => {
                      const file = files?.[0];
                      if (!file) return true;

                      const validTypes = [
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                      ];
                      return (
                        validTypes.includes(file.type) ||
                        "Tipo de arquivo inválido. Aceitamos JPEG, PNG e GIF."
                      );
                    },
                    maxSize: (files) => {
                      const file = files?.[0];
                      if (!file) return true;

                      const maxSize = 5 * 1024 * 1024;
                      return (
                        file.size <= maxSize ||
                        "O tamanho do arquivo excede o limite de 5MB."
                      );
                    },
                  },
                })}
              />

              <span>
                <LuCloudUpload size={52} className="text-eco-mutated" />
                <h5>Arraste e solte aqui</h5>
                <p>Selecione a foto do seu dispositivo</p>
              </span>
            </label>
          </div>

          {errors.picture && (
            <div className="invalid-feedback">{errors.picture.message}</div>
          )}
        </div>

        {/* Buttons */}
        <div
          className="mt-4 container-fluid d-flex flex-column flex-md-row gap-4 justify-content-end"
          id="button-container"
        >
          <button
            className="btn btn-secondary rounded-pill py-2"
            id="cancel-button"
            type="button"
          >
            Cancelar
          </button>

          <PrimaryButton text="Enviar" type="submit" id="submit-button" />
        </div>
      </form>
    </section>
  );
};
