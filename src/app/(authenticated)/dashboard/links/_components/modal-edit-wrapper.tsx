"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type linksList } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { useDisclosure } from "@mantine/hooks";
import { type InferSelectModel } from "drizzle-orm";
import dynamic from "next/dynamic";
import { type FC } from "react";
import { toast } from "sonner";

const ModalEditForm = dynamic(() =>
  import("./modal-edit-form").then((mod) => mod.ModalEditForm),
);

interface ModalEditWrapperProps {
  children: React.ReactNode;
  id: string;
}

export const ModalEditWrapper: FC<ModalEditWrapperProps> = ({
  children,
  id,
}) => {
  const [opened, handler] = useDisclosure(false);

  const {
    data: detailLink,
    isLoading: isLoadingDetailLink,
    error: errorDetailLink,
  } = api.linksList.getOne.useQuery({ id });

  if (errorDetailLink) {
    return toast.error(errorDetailLink.message);
  }

  return (
    <Dialog open={opened} onOpenChange={handler.toggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="dark:text-slate-50 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Link</DialogTitle>
        </DialogHeader>

        <ModalEditForm
          id={id}
          handler={handler}
          isLoadingDetailLink={isLoadingDetailLink}
          detailLink={detailLink as InferSelectModel<typeof linksList>[]}
        />
      </DialogContent>
    </Dialog>
  );
};
