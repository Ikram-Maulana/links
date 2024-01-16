"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useDisclosure } from "@mantine/hooks";
import { DotsHorizontalIcon, ReloadIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";
import { useState } from "react";
import ModalDelete from "./modal-delete";

interface DataRow<TData> extends Row<TData> {
  original: TData & {
    id: string;
    title: string;
    image: string | null;
  };
}

interface DataTableRowActionsProps<TData> {
  row: DataRow<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const linksList = row.original;
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [opened, handler] = useDisclosure(false);

  return (
    <DropdownMenu open={opened} onOpenChange={handler.toggle}>
      <DropdownMenuTrigger asChild onClick={() => handler.toggle()}>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuGroup onClick={() => handler.open()}>
          {isLoadingDelete ? (
            <>
              {/* <DropdownMenuItem
                className={cn("hover:cursor-pointer")}
                disabled={isLoadingDelete}
              >
                Edit
              </DropdownMenuItem> */}

              <DropdownMenuItem
                className={cn("hover:cursor-pointer")}
                disabled={isLoadingDelete}
              >
                <ReloadIcon className="mr-2 h-3 w-3 animate-spin" />
                Delete
              </DropdownMenuItem>
            </>
          ) : (
            <>
              {/* <EditModal id={techStack.id} key={`edit-${techStack.id}`}>
                <DropdownMenuItem
                  className={cn("hover:cursor-pointer")}
                  disabled={isLoadingDelete}
                >
                  Edit
                </DropdownMenuItem>
              </EditModal> */}

              <ModalDelete
                id={linksList.id}
                title={linksList.title}
                imageUrl={linksList.image ?? ""}
                handler={handler}
                key={`delete-${linksList.id}`}
                setIsLoadingDelete={setIsLoadingDelete}
              />
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
