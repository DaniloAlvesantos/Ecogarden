import { type NavigationType } from "../components/header";

const defautNavigation: Required<NavigationType> = [
  { title: "Sobre", url: "#about", isFeature: false },
  { title: "Recursos", url: "#features", isFeature: false },
  { title: "Login", url: "/login", isFeature: false },
  { title: "Localizar", url: "/map", isFeature: true },
];

const defautNavigationUser: Required<NavigationType> = [
  { title: "Sobre", url: "#about", isFeature: false },
  { title: "Recursos", url: "#features", isFeature: false },
  { title: "Dashboard", url: "/dashboard", isFeature: false },
  { title: "Localizar", url: "/map", isFeature: true },
];

export { defautNavigation, defautNavigationUser };
