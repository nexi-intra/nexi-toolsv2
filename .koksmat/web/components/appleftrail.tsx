"use client";
import Image from "next/image";

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

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Link from "next/link";
import DarkModeToggle from "@/components/darkmodetoggle";

export interface AppIcon {
  icon: React.ReactNode;
  title: string;
  href: string;
}
export interface AppLeftRailProps {
  topApps: AppIcon[];
  bottomApps: AppIcon[];
}

export default function AppLeftRail(props: AppLeftRailProps) {
  const { topApps, bottomApps } = props;
  const drawApps = (apps: AppIcon[]) => {
    return apps.map((app, index) => {
      return (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <Link
              href={app.href}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              {app.icon}
              <span className="sr-only">{app.title}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{app.title}</TooltipContent>
        </Tooltip>
      );
    });
  };
  return (
    <TooltipProvider>
      <aside className="h-[calc(100vh-80px)] inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          {/* <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link> */}
          {drawApps(topApps)}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <DarkModeToggle />
          {drawApps(bottomApps)}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
