import { useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";

import { SecondaryInput } from "../../components/formFields/secondaryInput";
import { useAuthStore } from "../../stores/auth";


type ProfileForm = {
  name: string;
  email: string;
  phone: string;
};

export const ProfileView = () => {
  const { user } = useAuthStore();

  const {
    register,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
    },
  });

  const registerPhoneWithMask = useHookFormMask(register);

  return (
    <section>
      <div>
        <h1>Perfil</h1>
        <p className="text-eco-mutated">Altere as informações do seu perfil</p>
      </div>
      <form>
        <div className="mb-3">
          <label htmlFor="nome" className="label-form">
            Nome
          </label>
          <SecondaryInput<ProfileForm>
            register={register}
            id="nome"
            name="name"
            type="text"
            errors={errors}
            placeholder={""}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="label-form">
            Email
          </label>
          <SecondaryInput<ProfileForm>
            register={register}
            id="email"
            name="email"
            type="email"
            errors={errors}
            placeholder={""}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="label-form">
            Telefône
          </label>
          <SecondaryInput.SecondaryInputWithMask<ProfileForm>
            type="tel"
            id="phone"
            placeholder="(19) 99999-9999"
            name="phone"
            errors={errors}
            required="Telefone é obrigatório"
            mask="99 99999-9999"
            register={registerPhoneWithMask}
            inputMode="tel"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-1"
          disabled={!isDirty || isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </section>
  );
};
