import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LuCloudUpload } from "react-icons/lu";
import { Link } from "react-router-dom";

import { useGetAdress } from "../../../hooks/useGetCEP";
import { EcoGardenApi } from "../../../lib/ecoGarden";
import { PrimaryButton } from "../../buttons/primary";
import { SecondaryInput } from "../../formFields/secondaryInput";
import { PrimaryModal } from "../../modals/primaryModal";

import { SearchCEP } from "./SearchCEP";
import "./style.scss";

interface GardenFormProps {
  name: string;
  cep: string;
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
    watch,
  } = useForm<GardenFormProps>({
    mode: "onBlur",
  });

  const [cep, setCEPState] = useState<string>("");
  const adressData = useGetAdress(cep);

  const pictureFile = watch("picture");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!pictureFile || pictureFile.length === 0) {
      setPreview(null);
      return;
    }

    const file = pictureFile[0];
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [pictureFile]);

  const onSubmit = async (data: GardenFormProps) => {
    const isInvalid = Object.entries(data).some(
      (d) => !d[1] || d[1] === "" || d[1] === 0 || d[1] === null
    );

    if (isInvalid) {
      console.log("Validation failed:", data);
      return;
    }

    const { name, cep, logradouro, numero, tamanho, picture } = data;

    if (!picture || picture.length === 0) {
      console.error("No image selected");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("cep", cep);
    formData.append("place", logradouro);
    formData.append("number", String(numero));
    formData.append("tamanhoM2", String(tamanho));
    
    formData.append("img", picture[0], picture[0].name);

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(key, ":", value.name, value.size, "bytes", value.type);
      } else {
        console.log(key, ":", value);
      }
    }

    try {
      const res = await EcoGardenApi.post(
        "/garden/create", 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Success:", res.data);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error message:", err.message);
      }
    }
  };

  const setCEP = (rawCEP: string) => {
    const cleaned = rawCEP.replace("-", "");
    setValue("cep", cleaned);
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

      <form
        id="garden-form"
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <div className="row">
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
              Não sei meu CEP
            </button>

            <PrimaryModal
              id="cepModal"
              title="Buscar CEP"
              body={<SearchCEP setCEP={setCEP} setLogradouro={setLogradouro} />}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-4">
            <label className="form-label">Logradouro</label>
            <SecondaryInput<GardenFormProps>
              type="text"
              name="logradouro"
              errors={errors}
              required="Logradouro é obrigatório"
              placeholder="Seu endereço"
              register={register}
              id="garden-logradouro"
              disabled={true}
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">Número</label>
            <SecondaryInput<GardenFormProps>
              type="text"
              name="numero"
              errors={errors}
              required="Número é obrigatório"
              placeholder="Número do endereço"
              inputMode="numeric"
              register={register}
              id="garden-numero"
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">
              Tamanho m<sup>2</sup>
            </label>
            <SecondaryInput<GardenFormProps>
              type="number"
              name="tamanho"
              errors={errors}
              required="Tamanho é obrigatório"
              placeholder="tamanho em metros quadrados"
              inputMode="numeric"
              register={register}
              id="garden-tamanho"
            />
          </div>
        </div>

        <div className="col-12 mt-4">
          <div>
            <h3 className="fs-3">Foto</h3>
            <p className="text-eco-mutated">Envie uma foto da horta</p>

            <label htmlFor="file-inp" id="label-file-inp">
              <input
                type="file"
                id="file-inp"
                accept="image/jpeg, image/png, image/gif, image/jpg "
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
                        "image/jpg",
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

          {preview && preview.length && (
            <div className="mt-3">
              <img
                src={preview}
                alt="Preview da imagem"
                style={{
                  maxWidth: "100%",
                  maxHeight: "250px",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </div>

        <div
          className="mt-4 container-fluid d-flex flex-column flex-md-row gap-4 justify-content-end"
          id="button-container"
        >
          <Link
            to="/dashboard/my/gardens"
            className="btn btn-secondary rounded-pill py-2 px-4"
            id="cancel-button"
            type="button"
          >
            Cancelar
          </Link>

          <PrimaryButton text="Enviar" type="submit" id="submit-button" />
        </div>
      </form>
    </section>
  );
};
