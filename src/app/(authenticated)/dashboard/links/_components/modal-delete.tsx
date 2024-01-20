"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { EdgeStoreApiClientError } from "@edgestore/react/shared";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

type DeleteProps = {
  id: string;
  title: string;
  imageUrl: string;
  handler: {
    open: () => void;
    close: () => void;
    toggle: () => void;
  };
  setIsLoadingDelete: (isLoading: boolean) => void;
};

const ModalDelete = ({
  id,
  title,
  imageUrl,
  handler,
  setIsLoadingDelete,
}: DeleteProps) => {
  const router = useRouter();
  const { edgestore } = useEdgeStore();

  const { mutate: deleteLink, isLoading: isDeletingLink } =
    api.linksList.delete.useMutation({
      onSuccess: async () => {
        try {
          if (imageUrl && imageUrl !== "") {
            await edgestore.publicFiles.delete({
              url: imageUrl,
            });
          }
          handler.close();
          toast.success(`Link \"${title}\" deleted successfully`);
        } catch (error) {
          // All errors are typed and you will get intellisense for them
          if (error instanceof EdgeStoreApiClientError) {
            if (error.data.code === "DELETE_NOT_ALLOWED") {
              toast.error("You don't have permission to delete the image");
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
        setIsLoadingDelete(false);
        router.refresh();
      },
    });

  const onDeleteHandler = useCallback(
    ({ id }: { id: string }) => {
      if (isDeletingLink) return;

      setIsLoadingDelete(true);
      deleteLink({ id });
    },
    [deleteLink, isDeletingLink, setIsLoadingDelete],
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className={cn("hover:cursor-pointer")}
          disabled={isDeletingLink}
        >
          {isDeletingLink && (
            <ReloadIcon className="mr-2 h-3 w-3 animate-spin" />
          )}
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Data will be permanently deleted from
            the server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" asChild>
            <AlertDialogAction
              onClick={() => {
                onDeleteHandler({ id });
              }}
            >
              Delete
            </AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalDelete;
