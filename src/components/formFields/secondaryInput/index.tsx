import type { HTMLInputTypeAttribute } from "react";
import {
  type FieldErrors,
  type FieldValue,
  type FieldValues,
  type Path,
  type RegisterOptions,
  type UseFormRegister,
  type ValidationRule,
} from "react-hook-form";
import type { Mask, UseFormRegisterReturn } from "use-mask-input";

interface SecondaryInputProps<T extends FieldValues = FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>;
  type: HTMLInputTypeAttribute;
  errors: FieldErrors<T>;

  pattern?: ValidationRule<RegExp>;

  minLength?: ValidationRule<number>;
  maxLength?: ValidationRule<number>;

  min?: ValidationRule<number>;
  max?: ValidationRule<number>;

  required?: boolean | string;

  id: string;
  placeholder: string;

  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];

  disabled?: boolean;

  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;

  value?: FieldValue<T>;

  autoComplete?: React.HTMLInputAutoCompleteAttribute;
}

const SecondaryInputComp = <TFieldValues extends FieldValues>(
  props: SecondaryInputProps<TFieldValues>
) => {
  const {
    register,
    errors,
    type,

    maxLength,
    minLength,

    min,
    max,

    pattern,
    required,

    id,
    placeholder,
    name,

    inputMode,
    value,
    autoComplete,
  } = props;

  return (
    <input
      type={type}
      className={`form-control ${
        errors?.[name] ? "is-invalid" : ""
      }`}
      id={id}
      placeholder={placeholder}
      inputMode={inputMode}
      disabled={props.disabled}
      autoComplete={autoComplete}
      {...register(name, {
        required,
        pattern,

        minLength,
        maxLength,

        min,
        max,

        valueAsNumber: type === "number",

        onBlur: props.onBlur,
        onChange: props.onChange,

        value,
      })}
    />
  );
};

interface SecondaryInputWithMaskProps<
  T extends FieldValues = FieldValues
> extends Omit<SecondaryInputProps<T>, "register"> {
  register: (
    fieldName: Path<T>,
    mask: Mask,
    options?: RegisterOptions
  ) => UseFormRegisterReturn<Path<T>>;
  mask: Mask;
}

export const SecondaryInputWithMask = <
  TFieldValues extends FieldValues
>(
  props: SecondaryInputWithMaskProps<TFieldValues>
) => {
  const {
    register,
    errors,
    type,

    maxLength,
    minLength,

    min,
    max,

    pattern,
    required,

    id,
    placeholder,
    name,

    inputMode,
    mask,

    onBlur,
    onChange,
    value,
  } = props;

  return (
    <input
      type={type}
      className={`form-control ${
        errors?.[name] ? "is-invalid" : ""
      }`}
      id={id}
      placeholder={placeholder}
      inputMode={inputMode}
      {...register(name, mask, {
        required,
        pattern,

        minLength,
        maxLength,

        min,
        max,

        valueAsNumber: type === "number",

        onBlur,
        onChange,

        value,
      })}
    />
  );
};

export const SecondaryInput = Object.assign(
  SecondaryInputComp,
  {
    SecondaryInputWithMask,
  }
);