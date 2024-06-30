"use client";

import * as React from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@mantine/hooks";

interface BaseProps {
  children: React.ReactNode;
}

interface RootRemoProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface RemoProps extends BaseProps {
  className?: string;
  asChild?: true;
}

const desktop = "(min-width: 768px)";

const Remo = ({ children, ...props }: RootRemoProps) => {
  const isDesktop = useMediaQuery(desktop);
  const Remo = isDesktop ? Dialog : Drawer;

  return <Remo {...props}>{children}</Remo>;
};

const RemoTrigger = ({ className, children, ...props }: RemoProps) => {
  const isDesktop = useMediaQuery(desktop);
  const RemoTrigger = isDesktop ? DialogTrigger : DrawerTrigger;

  return (
    <RemoTrigger className={className} {...props}>
      {children}
    </RemoTrigger>
  );
};

const RemoClose = ({ className, children, ...props }: RemoProps) => {
  const isDesktop = useMediaQuery(desktop);
  const RemoClose = isDesktop ? DialogClose : DrawerClose;

  return (
    <RemoClose className={className} {...props}>
      {children}
    </RemoClose>
  );
};

const RemoContent = ({ className, children, ...props }: RemoProps) => {
  const isDesktop = useMediaQuery(desktop);
  const RemoContent = isDesktop ? DialogContent : DrawerContent;

  return (
    <RemoContent className={cn(`sm:max-w-[425px] ${className}`)} {...props}>
      {children}
    </RemoContent>
  );
};

const RemoDescription = ({ className, children, ...props }: RemoProps) => {
  const isDesktop = useMediaQuery(desktop);
  const RemoDescription = isDesktop ? DialogDescription : DrawerDescription;

  return (
    <RemoDescription className={className} {...props}>
      {children}
    </RemoDescription>
  );
};

const RemoHeader = ({ className, children, ...props }: RemoProps) => {
  const isDesktop = useMediaQuery(desktop);
  const RemoHeader = isDesktop ? DialogHeader : DrawerHeader;

  return (
    <RemoHeader className={cn(`text-left ${className}`)} {...props}>
      {children}
    </RemoHeader>
  );
};

const RemoTitle = ({ className, children, ...props }: RemoProps) => {
  const isDesktop = useMediaQuery(desktop);
  const RemoTitle = isDesktop ? DialogTitle : DrawerTitle;

  return (
    <RemoTitle className={className} {...props}>
      {children}
    </RemoTitle>
  );
};

const RemoBody = ({ className, children, ...props }: RemoProps) => {
  return (
    <div className={cn("px-4 md:px-0", className)} {...props}>
      {children}
    </div>
  );
};

const RemoFooter = ({ className, children, ...props }: RemoProps) => {
  const isDesktop = useMediaQuery(desktop);
  const RemoFooter = isDesktop ? DialogFooter : DrawerFooter;

  return (
    <RemoFooter className={className} {...props}>
      {children}
    </RemoFooter>
  );
};

export {
  Remo,
  RemoBody,
  RemoClose,
  RemoContent,
  RemoDescription,
  RemoFooter,
  RemoHeader,
  RemoTitle,
  RemoTrigger,
};
