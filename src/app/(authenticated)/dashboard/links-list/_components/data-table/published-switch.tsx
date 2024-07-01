"use client";

import { Switch } from "@/components/ui/switch";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { type FC } from "react";
import { toast } from "sonner";

interface PublishedSwitchProps {
  id: string;
  checked: boolean;
}

export const PublishedSwitch: FC<PublishedSwitchProps> = ({ id, checked }) => {
  const router = useRouter();

  const { mutate, isPending, variables, isError } =
    api.list.setIsPublished.useMutation({
      onSuccess: () => {
        toast.success("Links published status updated");
        return;
      },
      onError: (error) => {
        if (error instanceof Error) {
          toast.error(error.message);
          return;
        }

        toast.error("Internal Server Error");
        return;
      },
      onSettled: () => {
        router.refresh();
        return;
      },
    });

  return (
    <Switch
      checked={isError ? checked : variables?.isPublished ?? checked}
      disabled={isPending}
      onCheckedChange={() => {
        mutate({
          id,
          isPublished: !checked,
        });
      }}
    />
  );
};
