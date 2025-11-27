import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiEyeOff, HiEye } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useHookFormMask } from "use-mask-input";

import { PrimaryButton } from "../../buttons/primary";
import { PrimaryInput } from "../../formFields/primaryInput";

export type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

interface SignUpFormProps {
  handleForm: (data: SignUpFormData) => void;
}

export const SignUpForm = (props: SignUpFormProps) => {
  const { handleForm } = props;
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handlePasswordVisible = () => {
    setPasswordVisible((prev) => !prev);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignUpFormData>({
    mode: "onBlur",
  });

  const registerPhoneWithMask = useHookFormMask(register);

  return (
    <form onSubmit={handleSubmit(handleForm)}>
      <div className="form-floating mb-3">
        <PrimaryInput<SignUpFormData>
          type="text"
          id="nameInp"
          placeholder="Fulano da silva"
          name="name"
          errors={errors}
          required="Nome é obrigatório"
          register={register}
          inputMode="text"
        />
        <label htmlFor="emailInp">Nome</label>
        {errors.name && (
          <small className="text-danger">{errors.name.message}</small>
        )}
      </div>

      <div className="form-floating mb-3">
        <PrimaryInput<SignUpFormData>
          type="email"
          id="emailInp"
          placeholder="name@example.com"
          name="email"
          errors={errors}
          required="Email é obrigatório"
          pattern={{
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Email inválido",
          }}
          minLength={{
            value: 6,
            message: "Email muito curto",
          }}
          register={register}
          inputMode="email"
        />
        <label htmlFor="emailInp">Email</label>
        {errors.email && (
          <small className="text-danger">{errors.email.message}</small>
        )}
      </div>

      <div className="form-floating mb-3">
        <PrimaryInput.PrimaryInputWithMask<SignUpFormData>
          type="tel"
          id="telInp"
          placeholder="(19) 99999-9999"
          name="phone"
          errors={errors}
          required="Telefone é obrigatório"
          mask="99 99999-9999"
          register={registerPhoneWithMask}
          inputMode="tel"
        />
        <label htmlFor="emailInp">Telefone</label>
        {errors.phone && (
          <small className="text-danger">{errors.phone.message}</small>
        )}
      </div>

      <div className="form-floating mb-3 password-wrapper">
        <PrimaryInput<SignUpFormData>
          name="password"
          errors={errors}
          register={register}
          type={passwordVisible ? "text" : "password"}
          id="passwordInp"
          placeholder="Password"
          required="Senha obrigatória"
          minLength={{
            value: 6,
            message: "Senha deve ter pelo menos 6 caracteres",
          }}
        />
        <button
          type="button"
          className="eye-btn"
          onClick={handlePasswordVisible}
          aria-label="Toggle password visibility"
        >
          {!errors.password ? (
            passwordVisible ? (
              <HiEyeOff />
            ) : (
              <HiEye />
            )
          ) : undefined}
        </button>
        <label htmlFor="passwordInp">Password</label>
        {errors.password && (
          <small className="text-danger">{errors.password.message}</small>
        )}
      </div>

      <div className="d-flex flex-column">
        <PrimaryButton type="submit" disabled={!isValid} text="Entrar" />
        <Link
          to="/login"
          className="m-2 font-secondary text-decoration-underline text-primary"
        >
          Entrar com uma conta
        </Link>
      </div>
    </form>
  );
};
