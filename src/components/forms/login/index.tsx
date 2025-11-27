import { useForm } from "react-hook-form";
import { HiEyeOff, HiEye } from "react-icons/hi";
import { Link } from "react-router-dom";

import { PrimaryButton } from "../../buttons/primary";
import { PrimaryInput } from "../../formFields/primaryInput";

export type LoginFormData = {
  email: string;
  password: string;
};

interface LoginFormProps {
  passwordVisible: boolean;
  handlePasswordVisible: VoidFunction;
  handleForm: (data: LoginFormData) => void;
}

export const LoginForm = (props: LoginFormProps) => {
  const { passwordVisible, handlePasswordVisible, handleForm } = props;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    mode: "onBlur",
  });

  return (
    <form onSubmit={handleSubmit(handleForm)}>
      <div className="form-floating mb-3">
        <PrimaryInput<LoginFormData>
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
        />
        <label htmlFor="emailInp">Email</label>
        {errors.email && (
          <small className="text-danger">{errors.email.message}</small>
        )}
      </div>

      <div className="form-floating mb-3 password-wrapper">
        <PrimaryInput<LoginFormData>
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
          to="/signup"
          className="m-2 font-secondary text-decoration-underline text-primary"
        >
          Criar conta
        </Link>
      </div>
    </form>
  );
};
