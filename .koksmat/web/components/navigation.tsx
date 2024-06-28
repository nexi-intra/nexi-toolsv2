import { APPNAME } from "../app/global";
import { AppLeftRailProps } from "@/components/appleftrail";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  Map,
  LineChart,
  ListFilter,
  MessageCircleQuestion,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Pyramid,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react";
export const leftRailApps: AppLeftRailProps = {
  topApps: [
    {
      icon: <Home className="h-5 w-5" />,
      title: "Dashboard",
      href: `/${APPNAME}`,
    },
    {
      icon: <Pyramid className="h-5 w-5" />,
      title: "Organisation",
      href: `/${APPNAME}/organisation`,
    },
    {
      icon: <Map className="h-5 w-5" />,
      title: "Countries",
      href: `/${APPNAME}/countries`,
    },
  ],
  bottomApps: [
    {
      icon: <Settings className="h-5 w-5" />,
      title: "Settings",
      href: "/settings",
    },
  ],
};
