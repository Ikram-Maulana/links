import { Skeleton } from "@/components/ui/skeleton";
import { type FC } from "react";

interface LinksListSkeletonProps {
  nItem: number;
}

export const LinksListSkeleton: FC<LinksListSkeletonProps> = ({ nItem }) => {
  return (
    <div className="mt-8">
      {Array(nItem)
        .fill(null)
        .map((_, i) => (
          <Skeleton
            key={`linkslistskeleton-${i}`}
            className="mb-4 h-14 w-full"
          />
        ))}
    </div>
  );
};
