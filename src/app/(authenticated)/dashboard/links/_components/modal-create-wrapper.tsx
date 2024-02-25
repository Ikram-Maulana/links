import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { type FC } from "react";

// Not using ssr false because not using web browser API
const ModalCreateForm = dynamic(() =>
  import("./modal-create-form").then((mod) => mod.ModalCreateForm),
);

interface ModalCreateWrapperProps {
  children: React.ReactNode;
}

export const ModalCreateWrapper: FC<ModalCreateWrapperProps> = ({
  children,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="dark:text-slate-50 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Link</DialogTitle>
        </DialogHeader>

        <ModalCreateForm />
      </DialogContent>
    </Dialog>
  );
};
