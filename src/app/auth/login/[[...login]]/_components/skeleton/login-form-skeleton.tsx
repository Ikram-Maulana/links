import { Skeleton } from "@/components/ui/skeleton";
import { type FC } from "react";

export const LoginFormSkeleton: FC = () => {
  return (
    <div className="flex w-[400px] flex-col px-10">
      <Skeleton className="h-[64px] w-[64px] rounded-full" />

      <div className="mt-4">
        <Skeleton className="h-[27.5px] w-full" />
      </div>

      <div className="mt-2">
        <Skeleton className="h-[20px] w-full" />
      </div>

      <div className="mt-4">
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
};
