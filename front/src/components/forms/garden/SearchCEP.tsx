import { memo } from "react";
import { useForm, Controller } from "react-hook-form";

import { useGetCEP } from "../../../hooks/useGetCEP";

interface SearchCEPProps {
  setCEP: (cep: string) => void;
  setLogradouro: (logradouro: string) => void;
}

type SearchFormInputs = {
  state: string;
  city: string;
  street: string;
  cepSelect: string;
};

export const SearchCEP = memo((props: SearchCEPProps) => {
  const { setCEP, setLogradouro } = props;

  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useForm<SearchFormInputs>({
    defaultValues: {
      state: "",
      city: "",
      street: "",
      cepSelect: "",
    },
  });

  const [state, city, street] = watch(["state", "city", "street"]);

  const {
    data: ceps,
    isLoading,
    isError,
    isFetching,
  } = useGetCEP(state, city, street);

  const searchResults = ceps || [];

  const handleCEPSelect = (selectedCepValue: string) => {
    setCEP(selectedCepValue);

    const selectedCEP = searchResults.find(
      (cep) => cep.cep === selectedCepValue
    );
    if (selectedCEP) {
      console.table(selectedCEP);
      const street = selectedCEP.logradouro;
      const city = selectedCEP.localidade;
      const state = selectedCEP.uf;
      setLogradouro(`${street}, ${city} - ${state}`);
    } else {
      setLogradouro("");
    }
  };

  const isQueryEnabled = !!state?.trim() && !!city?.trim() && !!street?.trim();

  const showLoading = (isLoading || isFetching) && isQueryEnabled;

  return (
    <>
      <div className="row g-3">
        <div className="col-md-4">
          <label htmlFor="state" className="form-label fw-bold">
            Estado (UF)
          </label>
          <input
            {...register("state", { required: "Estado é obrigatório" })}
            type="text"
            id="state"
            placeholder="Ex: SP"
            maxLength={2}
            className={`form-control ${errors.state ? "is-invalid" : ""}`}
          />
          {errors.state && (
            <div className="invalid-feedback">{errors.state.message}</div>
          )}
        </div>

        <div className="col-md-8">
          <label htmlFor="city" className="form-label fw-bold">
            Cidade
          </label>
          <input
            {...register("city", { required: "Cidade é obrigatória" })}
            type="text"
            id="city"
            placeholder="Ex: São Paulo"
            className={`form-control ${errors.city ? "is-invalid" : ""}`}
          />
          {errors.city && (
            <div className="invalid-feedback">{errors.city.message}</div>
          )}
        </div>

        <div className="col-12">
          <label htmlFor="street" className="form-label fw-bold">
            Logradouro (Rua/Avenida)
          </label>
          <input
            {...register("street", {
              required: "Logradouro é obrigatório",
            })}
            type="text"
            id="street"
            placeholder="Ex: Avenida Paulista"
            className={`form-control ${errors.street ? "is-invalid" : ""}`}
          />
          {errors.street && (
            <div className="invalid-feedback">{errors.street.message}</div>
          )}
        </div>

        <div className="col-12 mt-4">
          <label htmlFor="cepSelect" className="form-label fw-bold">
            CEPs Encontrados
          </label>

          {showLoading && (
            <div className="alert alert-info py-2 d-flex align-items-center">
              <div
                className="spinner-border spinner-border-sm me-2"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              Buscando endereços...
            </div>
          )}

          {isError && (
            <div className="alert alert-danger py-2">
              Erro ao buscar CEPs. Verifique os dados e tente novamente.
            </div>
          )}

          {!isQueryEnabled && !showLoading && (
            <div className="alert alert-warning py-2">
              Preencha todos os campos (UF, Cidade, Logradouro) para iniciar a
              busca.
            </div>
          )}

          <Controller
            name="cepSelect"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="cepSelect"
                disabled={showLoading || searchResults.length === 0}
                onChange={(e) => {
                  field.onChange(e);
                  handleCEPSelect(e.target.value);
                }}
                className="form-select"
              >
                <option value="">
                  {showLoading
                    ? "Aguarde..."
                    : searchResults.length > 0
                    ? `Selecione um CEP (${searchResults.length} encontrado(s))`
                    : "Nenhum CEP encontrado. Tente refinar a busca."}
                </option>
                {searchResults.map((cep) => (
                  <option key={cep.cep} value={cep.cep}>
                    {cep.cep} - {cep.logradouro}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
      </div>

      <div className="card-footer bg-light border-top rounded-bottom-4 p-3">
        <p className="mb-1 text-muted small">Status da Seleção:</p>
        <p className="mb-0">
          CEP:
          <strong className="text-primary">
            {watch("cepSelect") || "Nenhum"}
          </strong>
        </p>
      </div>
    </>
  );
});
