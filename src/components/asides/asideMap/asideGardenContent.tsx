import { AccordionMap } from "../../accordions/accordionMap";

import { AsideHeader } from "./asideHeader";
import { Historico } from "./historico";
import { HortaInfo } from "./hortaInfo";
import { Plantas } from "./plantas";
import { Sensores } from "./sensores";

import "./style.scss";

export const AsideGardenContent = () => (
  <section className="aside-map-content">
    <AsideHeader />

    <div className="accordion" id="aside-map-accordion">
      <AccordionMap id="one" title="Informações da Horta" defaultOpen>
        <HortaInfo />
      </AccordionMap>

      <AccordionMap id="two" title="Sensores">
        <Sensores />
      </AccordionMap>

      <AccordionMap id="three" title="Histórico Irrigação">
        <Historico />
      </AccordionMap>

      <AccordionMap id="four" title="Plantas">
        <Plantas />
      </AccordionMap>
    </div>
  </section>
);
