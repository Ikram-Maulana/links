import { Skeleton } from "@/components/ui/skeleton";
import { type FC } from "react";

interface CardMetricsSkeletonProps {
  length: number;
}

const CardMetricsSkeleton: FC<CardMetricsSkeletonProps> = ({ length }) => {
  return (
    <div className="grid grid-flow-row grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length }).map((_, i) => (
        <Skeleton key={i} className="h-[114px] w-auto" />
      ))}
    </div>
  );
};

export default CardMetricsSkeleton;
