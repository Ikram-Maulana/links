import { applyIconClassNames } from "@/lib/utils";
import { IconGear, IconHome, IconLink } from "@irsyadadl/paranoid";
import { type ReactNode } from "react";

export type TNavbarSidebarLink = {
  title: string;
  href: string;
  icon: ReactNode;
  additionalClassNames?: string;
};

export const navbarSidebarLink: TNavbarSidebarLink[] = [
  {
    title: "overview",
    href: "/dashboard",
    icon: <IconHome />,
  },
  {
    title: "Links",
    href: "/dashboard/links",
    icon: <IconLink />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <IconGear />,
  },
].map((data) => ({
  ...data,
  icon: applyIconClassNames(data.icon, "mr-2 h-4 w-4"),
}));
