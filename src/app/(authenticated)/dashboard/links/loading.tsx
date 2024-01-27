import { Skeleton } from "@/components/ui/skeleton";
import { type FC } from "react";
import DataTableSkeleton from "./_components/skeleton/data-table-skeleton";

const Loading: FC = () => {
  return (
    <>
      <div className="mb-6 flex flex-col space-y-2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col">
          <Skeleton className="h-[27px] w-[118px]" />
          <Skeleton className="mt-2 h-[16px] w-[196px]" />
        </div>

        <Skeleton className="h-[36px] w-[145px] rounded-lg" />
      </div>

      <DataTableSkeleton />
      <span className="sr-only">Loading...</span>
    </>
  );
};

export default Loading;
