"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type links } from "@/server/db/schema";
import { IconLoader } from "@irsyadadl/paranoid";
import { useDisclosure } from "@mantine/hooks";
import { type InferSelectModel } from "drizzle-orm";
import Link from "next/link";
import { useCallback, useState } from "react";
import { DeleteModal } from "./delete-modal";

interface LinkTableActionsProps<TData> {
  row: Row<TData>;
}

export function LinkTableActions<TData>({ row }: LinkTableActionsProps<TData>) {
  const linksData = row.original as InferSelectModel<typeof links>;
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [opened, { toggle, open, close }] = useDisclosure(false);

  const handlerOpenChange = useCallback(() => {
    toggle();
  }, [toggle]);

  const handlerOpen = useCallback(() => {
    open();
  }, [open]);

  const handlerClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <DropdownMenu open={opened} onOpenChange={handlerOpenChange}>
      <DropdownMenuTrigger onClick={handlerOpenChange} asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[160px]"
        onClick={handlerOpen}
      >
        <DropdownMenuItem
          key={`edit-${linksData.id}`}
          disabled={isLoadingDelete}
          className="hover:cursor-pointer"
          asChild
        >
          <Link href={`/dashboard/links-links/${linksData.id}/edit`}>Edit</Link>
        </DropdownMenuItem>
        <DeleteModal
          row={linksData}
          setIsLoadingDelete={setIsLoadingDelete}
          handlerClose={handlerClose}
          key={`delete-${linksData.id}`}
        >
          <DropdownMenuItem
            className="hover:cursor-pointer"
            disabled={isLoadingDelete}
          >
            {isLoadingDelete && (
              <IconLoader className="mr-2 h-3 w-3 animate-spin" />
            )}
            Delete
          </DropdownMenuItem>
        </DeleteModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
