interface PrimaryButtonProps {
  text: string;
  onClick?: VoidFunction;
  disabled?: boolean;
  className?: string;
  type: "button" | "submit" | "reset";
  id?: string;
}

export const PrimaryButton = (props: PrimaryButtonProps) => {
  const { text, onClick, disabled, className, type, id } = props;

  return (
    <button
      id={id}
      className={
        "btn bg-eco-green-500 text-eco-light rounded-pill px-4 py-2 hover-eco-bg transition-colors fs-6" +
        className
      }
      onClick={onClick}
      disabled={disabled}
      aria-label={text}
      type={type}
    >
      {text}
    </button>
  );
};
