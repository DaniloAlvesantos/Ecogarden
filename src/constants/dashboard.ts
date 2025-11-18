import type { AsideDataProps } from "../components/asides/asideDashboard";
import { FaUser, FaLeaf } from "react-icons/fa";
import { TbMapPin } from "react-icons/tb";

export const AsideData: AsideDataProps[] = [
  {
    icon: FaUser,
    label: "Perfil",
    link: "/dashboard/my/profile",
  },
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
