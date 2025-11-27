import { Link } from "react-router-dom";

import ConfuseGnome from "../../assets/mascots/gnome-confuse.png";
import { PrimaryButton } from "../../components/buttons/primary";
import { Header } from "../../components/header";

import "./error.scss";

interface ErrorViewProps {
  message?: string;
  title?: string;
  buttonText?: string;
  buttonLink?: string;
}

export const ErrorView = (props: ErrorViewProps) => {
  const { message, title, buttonText, buttonLink } = props;
  return (
    <div className="error-view">
      <Header />
      <section className="error-content">
        <img src={ConfuseGnome} alt="Confused Gnome" />
        <h2>{title || "Tem algo de errado aqui"}</h2>
        <p className="text-eco-mutated fs-6">
          {message ||
            "Não encontramos a página que você está procurando. Não se preocupe podemos te ajudar a voltar a pagina home"}
        </p>
        <Link to={buttonLink || "/"}>
          <PrimaryButton
            text={buttonText || "Voltar para a página inicial"}
            type={"button"}
          />
        </Link>
      </section>
    </div>
  );
};
