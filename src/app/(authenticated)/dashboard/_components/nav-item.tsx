"use client";

import { Button } from "@/components/ui/button";
import { authenticatedNav } from "@/config/authenticated-nav";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FC } from "react";

export const NavItem: FC = () => {
  const pathname = usePathname();

  return (
    <div className="flex w-full flex-col gap-2">
      <Button
        className={cn(
          "justify-start px-2 text-sm text-zinc-600 dark:text-zinc-400",
          {
            "text-zinc-900 dark:text-zinc-50":
              pathname === authenticatedNav[0]?.href,
          },
        )}
        variant={pathname === authenticatedNav[0]?.href ? "outline" : "ghost"}
        size="sm"
        asChild
      >
        <Link href={authenticatedNav[0]?.href ?? "/dashboard"}>
          {authenticatedNav[0]?.icon} {authenticatedNav[0]?.title}
        </Link>
      </Button>

      {authenticatedNav.slice(1).map((link, index) => (
        <Button
          key={`sidebar-item-${index}`}
          className={cn(
            "justify-start px-2 text-sm text-zinc-600 dark:text-zinc-400",
            {
              "text-zinc-900 dark:text-zinc-50": pathname.startsWith(link.href),
            },
          )}
          variant={pathname.startsWith(link.href) ? "outline" : "ghost"}
          asChild
        >
          <Link href={link.href}>
            {link.icon} {link.title}
          </Link>
        </Button>
      ))}
    </div>
  );
};
