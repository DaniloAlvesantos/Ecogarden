import { PiPlant } from "react-icons/pi";

import Earth from "../../assets/earth.png";
import "./hero.scss";

export const HeroView = () => {
  return (
    <section
      id="hero"
      className="d-flex flex-column flex-sm-row mx-auto align-items-center justify-content-center hero-container"
    >
      <div
        className="text-center text-sm-start"
        style={{ maxWidth: "32.25rem" }}
      >
        <h2 className="display-2 display-sm-1 mb-2 fw-bold">
          Cultive mais, <br /> desperdice menos
        </h2>
        <p className="mb-3 text-eco-mutated">
          Sistema de irrigação inteligente com sensores automaticos para manter
          hortas comunitárias sempre saudável, economizando água e facilitando o
          cuidado coletivo
        </p>
        <button className="btn bg-eco-green-500 text-eco-light rounded-pill px-4 py-2 d-flex align-items-center justify-content-center mx-auto mx-md-0 hover-eco-bg transition-colors fs-6">
          <PiPlant className="text-eco-green-300" size={28} />
          Faça sua parte
        </button>
      </div>

      <img src={Earth} alt="earth illustration" className="img-fluid earth" />
    </section>
  );
};
