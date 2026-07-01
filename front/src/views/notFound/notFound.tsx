import { BsArrowLeft } from "react-icons/bs";
import { Link } from "react-router-dom";

import LostGnome from "../../assets/mascots/gnome-lost.png";

import "./notFound.scss";

export const NotFoundPage = () => {
  return (
    <section className="not-found-page">
      <img src={LostGnome} alt="Lost Gnome" className="col-md-4" />
      <div className="text-container container-fluid">
        <h1 className="display-1 fw-bold">Oops!</h1>
        <p className="fs-5">
          Não conseguimos encontrar a página que você está procurando.
        </p>
        <Link to="/">
          <button className="btn bg-eco-green-500 text-eco-light rounded-pill px-4 py-2 d-flex align-items-center justify-content-center hover-eco-bg transition-colors fs-5 gap-2">
            <BsArrowLeft className="fs-4" />
            Voltar ao Início
          </button>
        </Link>
      </div>
    </section>
  );
};
