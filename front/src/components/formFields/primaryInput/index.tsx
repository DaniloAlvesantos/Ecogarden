import type { HTMLInputTypeAttribute } from "react";
import {
  type FieldErrors,
  type FieldValues,
  type Path,
  type RegisterOptions,
  type UseFormRegister,
  type ValidationRule,
} from "react-hook-form";
import type { Mask, UseFormRegisterReturn } from "use-mask-input";

interface PrimaryInputProps<T extends FieldValues = FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>;
  type: HTMLInputTypeAttribute;
  errors: FieldErrors<T>;
  pattern?: ValidationRule<RegExp>;
  minLength?: ValidationRule<number>;
  maxLength?: ValidationRule<number>;
  required?: boolean | string;
  id: string;
  placeholder: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}

const PrimaryInputComp = <TFieldValues extends FieldValues>(
  props: PrimaryInputProps<TFieldValues>
) => {
  const {
    register,
    errors,
    type,
    maxLength,
    minLength,
    pattern,
    required,
    id,
    placeholder,
    name,
    inputMode,
  } = props;

  return (
    <input
      type={type}
      className={`form-control rounded-pill ${
        errors[name] ? "is-invalid" : ""
      }`}
      id={id}
      placeholder={placeholder}
      {...register(name, {
        required,
        pattern,
        minLength,
        maxLength,
      })}
      inputMode={inputMode}
    />
  );
};

interface PrimaryInputWithMaskProps<T extends FieldValues = FieldValues>
  extends Omit<PrimaryInputProps<T>, "register"> {
  register: (
    fieldName: Path<T>,
    mask: Mask,
    options?: RegisterOptions | RegisterOptions | undefined
  ) => UseFormRegisterReturn<"name" | "email" | "password" | "phone">;
  mask: Mask;
}

export const PrimaryInputWithMask = <TFieldValues extends FieldValues>(
  props: PrimaryInputWithMaskProps<TFieldValues>
) => {
  const {
    register,
    errors,
    type,
    maxLength,
    minLength,
    pattern,
    required,
    id,
    placeholder,
    name,
    inputMode,
    mask,
  } = props;

  return (
    <input
      type={type}
      className={`form-control rounded-pill ${
        errors[name] ? "is-invalid" : ""
      }`}
      id={id}
      placeholder={placeholder}
      {...register(name, mask, {
        required,
        pattern,
        minLength,
        maxLength,
      })}
      inputMode={inputMode}
    />
  );
};

export const PrimaryInput = Object.assign(PrimaryInputComp, {
  PrimaryInputWithMask,
});
