"use client";

import { navbarSidebarLink, type TNavbarSidebarLink } from "@/app/data";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function NavbarMobile() {
  const pathname = usePathname();
  const [opened, handler] = useDisclosure(false);
  const { width } = useViewportSize();
  const remainingLinks = navbarSidebarLink.slice(1);

  useEffect(() => {
    if (width >= 1024) {
      handler.close();
    }
  }, [width, handler]);

  return (
    <Sheet open={opened} onOpenChange={handler.toggle}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="mr-2 px-3 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <HamburgerMenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className={cn("border-neutral-300 pr-0")}>
        <ScrollArea className="my-8 h-[calc(100vh-8rem)] pb-8 pr-6">
          <div className="flex flex-col space-y-2">
            {remainingLinks.length > 0 && (
              <div className="flex flex-col gap-4">
                <Button
                  className={cn(
                    "justify-start",
                    pathname === navbarSidebarLink[0]?.href
                      ? "text-neutral-50"
                      : "text-neutral-500",
                  )}
                  variant={
                    pathname === navbarSidebarLink[0]?.href
                      ? "default"
                      : "ghost"
                  }
                  asChild
                  onClick={() => handler.close()}
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
                      onClick={() => handler.close()}
                    >
                      <Link href={href}>
                        {icon} {title}
                      </Link>
                    </Button>
                  ),
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
