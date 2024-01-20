"use client";

import { type TNavbarSidebarLink, navbarSidebarLink } from "@/app/data";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const remainingLinks = navbarSidebarLink.slice(1);

  return (
    <aside
      id="sidebar"
      className="fixed top-20 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 lg:sticky lg:block"
    >
      <ScrollArea className="h-full py-6 pr-6 lg:py-8 lg:pl-8">
        {remainingLinks.length > 0 && (
          <div className="flex w-full flex-col gap-4">
            <Button
              className={cn(
                "justify-start",
                pathname === navbarSidebarLink[0]?.href
                  ? "text-neutral-50"
                  : "text-neutral-500",
              )}
              variant={
                pathname === navbarSidebarLink[0]?.href ? "default" : "ghost"
              }
              asChild
            >
              <Link href={navbarSidebarLink[0]?.href ?? "/dashboard"}>
                {navbarSidebarLink[0]?.icon} {navbarSidebarLink[0]?.title}
              </Link>
            </Button>

            {remainingLinks.map(
              ({ title, href, icon }: TNavbarSidebarLink, index) => (
                <Button
                  key={index.toString()}
                  className={cn(
                    "justify-start",
                    pathname.startsWith(href)
                      ? "text-neutral-50"
                      : "text-neutral-500",
                  )}
                  variant={pathname.startsWith(href) ? "default" : "ghost"}
                  asChild
                >
                  <Link href={href}>
                    {icon} {title}
                  </Link>
                </Button>
              ),
            )}
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
