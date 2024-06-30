"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { useEffect, type FC } from "react";
import { NavItem } from "../nav-item";

interface TopbarBurgerWrapperProps {
  children: React.ReactNode;
}

export const TopbarBurgerWrapper: FC<TopbarBurgerWrapperProps> = ({
  children,
}) => {
  const [opened, handler] = useDisclosure(false);
  const { width } = useViewportSize();

  useEffect(() => {
    if (width >= 1024) {
      handler.close();
    }
  }, [width, handler]);

  return (
    <Sheet open={opened} onOpenChange={handler.toggle}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="left"
        className={cn("border-zinc-300 px-0 dark:border-zinc-600")}
      >
        <ScrollArea className="my-8 h-[calc(100vh-8rem)] px-4 pb-6">
          <NavItem />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
