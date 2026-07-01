import { FaLeaf } from "react-icons/fa";
import { TbMapPin } from "react-icons/tb";

import type { AsideDataProps } from "../components/asides/asideDashboard";
import { DashboardView, ProfileView } from "../views";

export const AsideData: AsideDataProps[] = [
  {
    icon: FaLeaf,
    label: "Hortas",
    link: "/dashboard/my/gardens",
  },
  {
    icon: TbMapPin,
    label: "Mapa",
    link: "/map",
  },
];

export const DashboardViews = [
  {
    href: "dashboard",
    Component: DashboardView,
  },
  {
    href: "profile",
    Component: ProfileView,
  },
] as const;

export type DashboardViewHref = (typeof DashboardViews)[number]["href"];

export type DashboardViewsProps = {
  href: DashboardViewHref;
  Component: React.FC<{ changeView: (href: DashboardViewHref) => void }>;
};
