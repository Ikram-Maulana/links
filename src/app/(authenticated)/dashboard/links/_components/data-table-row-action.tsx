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
import ModalEdit from "./modal-edit";
import { api } from "@/trpc/react";
import { useEdgeStore } from "@/lib/edgestore";
import { toast } from "sonner";
import { EdgeStoreApiClientError } from "@edgestore/react/shared";
import { useRouter } from "next/navigation";

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

  const { edgestore } = useEdgeStore();

  const { mutate: deleteImage, isLoading: isDeletingImage } =
    api.linksList.deleteImage.useMutation({
      onSuccess: async () => {
        try {
          await edgestore.publicFiles.delete({ url: row.original.image ?? "" });
          toast.success("Image deleted successfully");
        } catch (err) {
          if (err instanceof EdgeStoreApiClientError) {
            if (err.data.code === "DELETE_NOT_ALLOWED") {
              toast.error("You don't have permission to delete this file.");
            }
          }

          toast.error("An error occurred while deleting the image");
        }
      },
      onError: (error) => {
        if (error instanceof Error && error.message) {
          toast.error(error.message);
        } else {
          toast.error("An error occurred");
        }
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

              <ModalEdit id={linksList.id} key={`edit-${linksList.id}`}>
                <DropdownMenuItem
                  className={cn("hover:cursor-pointer")}
                  disabled={isLoadingDelete || isDeletingImage}
                >
                  Edit
                </DropdownMenuItem>
              </ModalEdit>

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
