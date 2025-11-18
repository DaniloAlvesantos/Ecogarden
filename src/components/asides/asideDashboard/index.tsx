import { memo } from "react";
import "./style.scss";
import type { IconType } from "react-icons";
import { AsideData } from "../../../constants/dashboard";
import { Link } from "react-router-dom";

export type AsideDataProps = {
  icon: IconType;
  label: string;
  link: string;
};

const AsideComp = () => {
  return (
    <aside className="col-2" id="aside-dashboard">
      <nav className="dashboard-links">
        <ul>
          {AsideData.map((item) => {
            return (
              <li key={item.label}>
                <Link to={item.link}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export const AsideDashboard = memo(AsideComp);
