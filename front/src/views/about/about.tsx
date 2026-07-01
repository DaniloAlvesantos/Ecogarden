import Building from "../../assets/buildings.png";
import "./about.scss";

const data = [
  {
    title: "Economia de água e redução de desperdício",
    description:
      "ao evitar regas por tempo fixo e sobreirrigação, sistemas inteligentes cortam consumo e perdas por evaporação e vazamentos. Isso é crucial em cidades com restrições hídricas",
  },
  {
    title: "Menor carga sobre redes de drenagem e poluição",
    description:
      "regas mais eficientes reduzem escoamento superficial que arrasta fertilizantes/contaminantes para bueiros, contribuindo para menos poluição e menor risco de enchentes locais",
  },
  {
    title: "Benefícios climáticos locais",
    description:
      "hortas bem irrigadas ajudam a reduzir ilhas de calor, aumentar infiltração e suportar maior biodiversidade urbana (insetos, aves), melhorando a resiliência da malha verde da cidade",
  },
] as const;

export const AboutView = () => {
  return (
    <section id="about" className="about-container">
      <div className="text-center text-sm-start about-container-text">
        <h2 className="display-6 fw-bold">
          Como afetamos <br />
          no dia a dia
        </h2>
        <p className="text-eco-mutated fs-5">
          Entenda o próposito que mudou cidades através de pequenas mudanças
        </p>
      </div>
      <div className=" align-items-center about-content">
        <ol className="about-list col-md-6">
          {data.map(({ title, description }) => (
            <ListItem key={title} title={title} description={description} />
          ))}
        </ol>
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <img src={Building} alt="Edifícios" className="building" />
        </div>
      </div>
    </section>
  );
};

const ListItem = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <li>
      <strong className="text-eco-green-400">{title} - </strong> {description}
    </li>
  );
};
