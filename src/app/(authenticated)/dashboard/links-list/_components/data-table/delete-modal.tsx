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
import { api } from "@/trpc/react";
import { type LinkWithClicked } from "@/types";
import { useRouter } from "next/navigation";
import { useMemo, type FC } from "react";
import { toast } from "sonner";

type DeleteProps = {
  row: LinkWithClicked;
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

  const { mutate, isPending } = api.link.delete.useMutation({
    onSuccess: async () => {
      toast.success(`\"${row.title}\" deleted successfully from links`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    },
    onSettled: () => {
      setIsLoadingDelete(false);
      handlerClose();
      router.refresh();
    },
  });

  const isOperationPending = useMemo(() => isPending, [isPending]);

  const onDeleteHandler = ({ id }: { id: string }) => {
    if (isOperationPending) return;

    setIsLoadingDelete(true);

    mutate({ id });
  };

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
              onClick={() => onDeleteHandler({ id: row.id })}
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
