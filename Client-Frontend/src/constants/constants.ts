import { FaUsers, FaHome } from "react-icons/fa";
import { FaChartColumn} from "react-icons/fa6";
// import { LuTarget } from "react-icons/lu";
import { IconType } from "react-icons";

export type MenuItem = {
  icon: IconType;
  link: string;
};

export const menu: MenuItem[] = [
  { icon: FaHome, link: "/" },
  { icon: FaUsers, link: "/users" },
  { icon: FaChartColumn, link: "/champions-board" },
  // { icon: FaZ, link: "/function" },
  // { icon: FaDollarSign, link: "/finance" },
  // { icon: LuTarget, link: "/target" },
];
