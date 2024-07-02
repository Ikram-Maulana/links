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
import { type list } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { type InferSelectModel } from "drizzle-orm";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, type FC } from "react";
import { toast } from "sonner";

type DeleteProps = {
  row: InferSelectModel<typeof list>;
  setIsLoadingDelete: (isLoading: boolean) => void;
  handlerClose: () => void;
  children: React.ReactNode;
};

export const DeleteModal: FC<DeleteProps> = ({
  row,
  setIsLoadingDelete,
  handlerClose,
  children,
}) => {
  const router = useRouter();

  const handleError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      toast.error(error.message);
      return;
    }

    toast.error("Internal Server Error");
    return;
  }, []);

  const { mutate, isPending } = api.list.delete.useMutation({
    onSuccess: async () => {
      return toast.success(`\"${row.title}\" deleted successfully from list`);
    },
    onError: handleError,
    onSettled: () => {
      setIsLoadingDelete(false);
      handlerClose();
      return router.refresh();
    },
  });

  const isOperationPending = useMemo(() => isPending, [isPending]);

  const onDeleteHandler = useCallback(
    async ({ id }: { id: string }) => {
      if (isOperationPending) return;

      setIsLoadingDelete(true);

      try {
        mutate({ id });
      } catch (error) {
        handleError(error);
      }
    },
    [isOperationPending, setIsLoadingDelete, mutate, handleError],
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
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
              onClick={async () => {
                await onDeleteHandler({ id: row.id });
              }}
              disabled={isOperationPending}
            >
              Delete
            </AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
