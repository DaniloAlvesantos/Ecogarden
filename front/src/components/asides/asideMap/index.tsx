import "bootstrap/dist/js/bootstrap.min.js";
import "./style.scss";

import { AsideGardenContent } from "./asideGardenContent";

interface AsideMapProps {
  show: boolean;
}

export const AsideMap = ({ show }: AsideMapProps) => {
  return (
    <aside className={`aside-map ${show ? "show" : ""}`}>
      <AsideGardenContent />
    </aside>
  );
};
