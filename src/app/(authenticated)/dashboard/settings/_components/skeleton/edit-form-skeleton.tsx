import { Skeleton } from "@/components/ui/skeleton";
import { type FC } from "react";

const EditFormSkeleton: FC = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[95px]" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Skeleton className="h-24 w-24 flex-shrink-0 rounded-full" />

          <div className="flex w-full flex-col gap-y-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-[19px] w-full" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-[71px]" />
        <Skeleton className="h-9 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-9 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-[67px]" />
        <Skeleton className="h-9 w-full" />
      </div>

      <div className="flex w-full justify-end">
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
};

export default EditFormSkeleton;
