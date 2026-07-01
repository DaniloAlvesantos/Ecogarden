import { memo } from "react";
import { Link } from "react-router-dom";
import "./aside.scss";

type NavigationItem = { title: string; url: string; isFeature?: boolean };

interface AsideProps extends React.ComponentProps<"aside"> {
  navigation: NavigationItem[];
  isOpen?: boolean;
  setIsOpen?: VoidFunction;
}

export const AsideComp = ({
  navigation,
  isOpen,
  setIsOpen,
  ...props
}: AsideProps) => {
  return (
    <aside
      className={`mobile-sidebar shadow-lg d-flex flex-column justify-content-between ${
        isOpen ? "show" : ""
      }`}
      {...props}
    >
      <img
        src="/gnome-1.png"
        alt="gnome mascot"
        onClick={setIsOpen}
        className="mx-auto mt-2 img-fluid logo-aside"
      />

      <ul className="d-flex flex-column list-unstyled font-primary fw-bold text-center">
        {navigation.map((item) => (
          <li
            key={item.url}
            className="mx-auto mb-2 p-2 rounded transition-colors"
          >
            <Link to={item.url} className="text-decoration-none text-inherit">
              {item.title}
            </Link>
          </li>
        ))}
      </ul>

      <div style={{ minHeight: "3rem" }}></div>
    </aside>
  );
};

export const AsideMenu = memo(AsideComp);
