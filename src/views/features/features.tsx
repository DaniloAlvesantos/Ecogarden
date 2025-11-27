import type { ReactNode } from "react";

import "./features.scss";
import Mockup from "../../assets/mockup.png";
import Tracking from "../../assets/tracking.png";

export const FeaturesView = () => {
  return (
    <section
      id="features"
      className="d-flex flex-column align-items-center justify-content-center"
    >
      <h2 className="display-6 fw-bold my-4 text-center">
        Simples, mas impactante
      </h2>
      <main className="row g-4 align-items-stretch">
        <div className="col-12 col-lg-8">
          <FeatureCard>
            <div className="row align-items-center justify-content-center">
              <span className=" col-12 col-md-6">
                <h3 className="fs-4 font-primary">Fácil de achar</h3>
                <p className="font-secondary text-eco-mutated">
                  Encontre uma horta comunitaria mais próximo de sua localização
                </p>
                <p className="font-secondary text-eco-mutated">
                  Visualize o estado da horta, clima, água...
                </p>
              </span>
              <img
                src={Tracking}
                alt="Tracking"
                className="tracking-img col-12 w-50 col-lg-5"
              />
            </div>
          </FeatureCard>
        </div>
        <div className="col-12 col-lg-4">
          <FeatureCard>
            <div className="d-flex flex-column align-items-center justify-content-center position-relative">
              <span>
                <h3 className="fs-3 font-primary">Compartilhe</h3>
                <p className="font-secondary text-eco-mutated">
                  Faça com que todos ao seu redor ajude a manter e construir
                  novos{" "}
                  <strong className="text-eco-green-400 fw-normal">
                    green spaces
                  </strong>
                </p>
              </span>
            </div>
          </FeatureCard>
        </div>
        <div className="col-12">
          <FeatureCard style={{ alignItems: "start", padding: "4rem 1.5rem" }}>
            <div className="d-flex">
              <span className="">
                <h3 className="fs-3 font-primary">
                  Utilize a qualquer
                  <br />
                  momento
                </h3>
                <p className="font-secondary text-eco-mutated w-75">
                  Obtenha experiências satisfatórias em todos dispositivos
                </p>
                <p className="font-secondary text-eco-mutated w-75">
                  Possibilidade de cadastrar novas hortas e comunidades em
                  dispositivos móveis
                </p>
              </span>
              <img src={Mockup} alt="Mockup" className="mockup" />
            </div>
          </FeatureCard>
        </div>
      </main>
    </section>
  );
};

interface FeatureCardProps extends React.ComponentProps<"div"> {
  children: ReactNode;
}

const FeatureCard = ({ children, ...props }: FeatureCardProps) => {
  return (
    <div className="card-feature" {...props}>
      {children}
    </div>
  );
};
