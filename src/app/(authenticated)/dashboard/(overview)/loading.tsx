import { Skeleton } from "@/components/ui/skeleton";
import { type FC } from "react";
import { CardMetricsSkeleton } from "../_components/skeleton/card-metrics-skeleton";

const Loading: FC = () => {
  return (
    <>
      <div className="mb-6 flex flex-col">
        <Skeleton className="h-[27px] w-[118px]" />
        <Skeleton className="mt-2 h-[16px] w-[196px]" />
      </div>

      <CardMetricsSkeleton length={1} />
      <span className="sr-only">Loading...</span>
    </>
  );
};

export default Loading;
