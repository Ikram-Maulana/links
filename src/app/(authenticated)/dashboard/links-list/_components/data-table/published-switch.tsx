"use client";

import { Switch } from "@/components/ui/switch";
import { api } from "@/trpc/react";
import { useRouter } from "nextjs-toploader/app";
import { type FC } from "react";
import { toast } from "sonner";

interface PublishedSwitchProps {
  id: string;
  checked: boolean;
}

export const PublishedSwitch: FC<PublishedSwitchProps> = ({ id, checked }) => {
  const router = useRouter();

  const { mutate, isPending, variables, isError } =
    api.link.setIsPublished.useMutation({
      onSuccess: () => {
        toast.success("Links published status updated");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "An error occurred",
        );
      },
      onSettled: () => {
        router.refresh();
      },
    });

  return (
    <Switch
      checked={isError ? checked : (variables?.isPublished ?? checked)}
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
