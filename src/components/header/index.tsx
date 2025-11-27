import { useState } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { Link } from "react-router-dom";

import "./header.scss";
import {
  defautNavigation,
  defautNavigationUser,
} from "../../constants/navigation";
import { useAuthStore } from "../../stores/auth";
import { AsideMenu } from "../asides/asideMenu/aside";

interface HeaderProps {
  navigation?: { title: string; url: string; isFeature?: boolean }[];
}

export type NavigationType = HeaderProps["navigation"];

export const Header = ({ navigation = defautNavigation }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user, loading } = useAuthStore();

  if (user && !loading && navigation === defautNavigation) {
    navigation = defautNavigationUser;
  }

  const toggleAside = () => setIsOpen((prev) => !prev);

  return (
    <header className="w-100 px-2 d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <img
          className="me-2 img-fluid logo"
          src="/gnome-1.png"
          alt="gnome mascot"
        />
        <span className="font-primary fw-bold">EcoGarden</span>
      </div>

      <nav className="d-none d-md-block">
        <ul
          className="d-flex align-items-center list-unstyled mb-0 font-primary fw-medium"
          style={{ fontSize: "0.875rem", gap: "1rem" }}
        >
          {navigation?.map((item, index) => {
            if (item.isFeature) {
              return (
                <li key={index}>
                  <Link
                    to={item.url}
                    className="btn bg-eco-green-500 text-eco-light rounded-pill px-4 py-2 text-decoration-none hover-eco-bg transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              );
            }
            return (
              <li key={index} style={{ cursor: "pointer" }}>
                {item.url.startsWith("http") ? (
                  <a
                    href={item.url}
                    className="hover-eco-green transition-colors text-decoration-none text-inherit"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.title}
                  </a>
                ) : (
                  <Link
                    to={item.url}
                    className="hover-eco-green transition-colors text-decoration-none text-inherit"
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <span
        className="d-md-none p-2 rounded-circle transition-colors"
        style={{ cursor: "pointer" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(94, 94, 94, 0.1)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
        onClick={toggleAside}
      >
        <RiMenu3Line size={24} />
      </span>

      {navigation?.length ? (
        <AsideMenu
          isOpen={isOpen}
          navigation={navigation}
          setIsOpen={toggleAside}
        />
      ) : null}
    </header>
  );
};
