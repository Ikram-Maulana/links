"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { IconOpenLink } from "@irsyadadl/paranoid";
import { useDisclosure } from "@mantine/hooks";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { type Session as TSession } from "next-auth";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const LogoutButton = dynamic(() => import("./logout-button"), {
  loading: () => <Skeleton className="h-[32px] w-full" />,
});

interface UserButtonProps {
  user: TSession["user"] | undefined;
}

const UserButton: React.FC<UserButtonProps> = ({ user }) => {
  const [opened, handler] = useDisclosure(false);

  return (
    <DropdownMenu open={opened} onOpenChange={handler.toggle}>
      <DropdownMenuTrigger onClick={() => handler.toggle()} asChild>
        <div className="flex items-center justify-center gap-2 hover:cursor-pointer">
          <Image
            src={user?.image ?? ""}
            alt={user?.name ?? ""}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
          <p className="hidden text-sm font-semibold leading-7 lg:block">
            {user?.name}
          </p>
          {opened ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" onClick={() => handler.open()}>
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuItem
          className={cn(
            "inline-flex w-full flex-grow cursor-pointer justify-between lg:hidden",
          )}
          asChild
        >
          <Link href="/" target="_blank">
            Home Page
            <IconOpenLink className="ml-1 h-4 w-4" />
          </Link>
        </DropdownMenuItem>
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
