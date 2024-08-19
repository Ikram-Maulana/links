import { applyIconClassNames } from "@/lib/utils";
import { IconCainLink3, IconFileText, IconHome } from "@irsyadadl/paranoid";
import { type ReactNode } from "react";

export type TAuthenticatedNav = {
  title: string;
  href: string;
  icon: ReactNode;
};

export const authenticatedNav: TAuthenticatedNav[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: <IconHome />,
  },
  {
    title: "Links List",
    href: "/dashboard/links-list",
    icon: <IconCainLink3 />,
  },
  {
    title: "Logs",
    href: "/dashboard/logs",
    icon: <IconFileText />,
  },
].map((data) => ({
  ...data,
  icon: applyIconClassNames(data.icon, "mr-2 h-4 w-4"),
}));
