"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import Link from "next/link";
import React from "react";

const LogoutButton = dynamic(() => import("./logout-button"), {
  ssr: false,
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
          <Avatar className={cn("h-8 w-8")}>
            <AvatarImage src={user?.image ?? ""} alt={user?.name ?? ""} />
            <AvatarFallback>
              <span>{user?.name?.[0]}</span>
            </AvatarFallback>
          </Avatar>
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
