"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteUploadcareFile } from "@/lib/uploadcare";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useDisclosure } from "@mantine/hooks";
import { DotsHorizontalIcon, ReloadIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";
import Error from "next/error";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ModalDelete from "./modal-delete";
import { ModalEditWrapper } from "./modal-edit-wrapper";

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
  const router = useRouter();

  const { mutate: deleteImage, isLoading: isDeletingImage } =
    api.linksList.deleteImage.useMutation({
      onSuccess: async () => {
        try {
          await deleteUploadcareFile({ uuid: row.original.image! });
          return toast.success("Image deleted successfully");
        } catch (err) {
          return toast.error("An error occurred while deleting the image");
        }
      },
      onError: (error) => {
        if (error instanceof Error && error.message) {
          return toast.error(error.message);
        }

        return toast.error("An error occurred");
      },
      onSettled: () => {
        router.refresh();
      },
    });

  function onDeleteImage({ id }: { id: string }) {
    if (isDeletingImage || isLoadingDelete) {
      return;
    }

    deleteImage({ id });
  }

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
          {isLoadingDelete || isDeletingImage ? (
            <>
              {linksList.image && (
                <DropdownMenuItem
                  className={cn("hover:cursor-pointer")}
                  disabled={isLoadingDelete || isDeletingImage}
                >
                  {isDeletingImage && (
                    <ReloadIcon className="mr-2 h-3 w-3 animate-spin" />
                  )}
                  Delete Image
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                className={cn("hover:cursor-pointer")}
                disabled={isLoadingDelete || isDeletingImage}
              >
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                className={cn("hover:cursor-pointer")}
                disabled={isLoadingDelete || isDeletingImage}
              >
                {isLoadingDelete && (
                  <ReloadIcon className="mr-2 h-3 w-3 animate-spin" />
                )}
                Delete
              </DropdownMenuItem>
            </>
          ) : (
            <>
              {linksList.image && (
                <DropdownMenuItem
                  key={`deleteImage-${linksList.id}`}
                  className={cn("hover:cursor-pointer")}
                  disabled={isLoadingDelete || isDeletingImage}
                  onClick={() => onDeleteImage({ id: linksList.id })}
                >
                  Delete Image
                </DropdownMenuItem>
              )}

              <ModalEditWrapper id={linksList.id} key={`edit-${linksList.id}`}>
                <DropdownMenuItem
                  className={cn("hover:cursor-pointer")}
                  disabled={isLoadingDelete || isDeletingImage}
                >
                  Edit
                </DropdownMenuItem>
              </ModalEditWrapper>

              <ModalDelete
                id={linksList.id}
                title={linksList.title}
                imageIds={linksList.image!}
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
