import { memo } from "react";
import "./style.scss";
import type { IconType } from "react-icons";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

import {
  AsideData,
  type DashboardViewHref,
} from "../../../constants/dashboard";
import { useAuthStore } from "../../../stores/auth";

export type AsideDataProps = {
  icon: IconType;
  label: string;
  link: string;
};

type AsideCompProps = {
  changeView: (href: DashboardViewHref) => void;
};

const AsideComp = ({ changeView }: AsideCompProps) => {
  const { user, logout } = useAuthStore();

  return (
    <aside
      className="col-lg-2 col-md-3 col-12 mb-3 mb-md-0 d-flex flex-column justify-content-between"
      id="aside-dashboard"
    >
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
      <div className="py-3">
        <hr />
        <div className="dropdown">
          <a
            href="#"
            className="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <FaUserCircle className="mx-1 fs-4 text-eco-mutated" />
            <strong>{user?.name.split(" ")[0] ?? "User"}</strong>
          </a>
          <ul className="dropdown-menu text-small shadow">
            <li className="dropdown-item" onClick={() => changeView("profile")}>
              Perfil
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button className="dropdown-item" onClick={logout}>
                Sair
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export const AsideDashboard = memo(AsideComp);
