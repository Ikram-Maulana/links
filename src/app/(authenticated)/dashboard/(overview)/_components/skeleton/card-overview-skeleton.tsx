import { Skeleton } from "@/components/ui/skeleton";
import { type FC } from "react";

interface CardOverviewSkeletonProps {
  length: number;
}

export const CardOverviewSkeleton: FC<CardOverviewSkeletonProps> = ({
  length,
}) => {
  return (
    <div className="grid grid-flow-row grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length }).map((_, i) => (
        <Skeleton key={i} className="h-[106px] w-auto" />
      ))}
    </div>
  );
};
