import { Skeleton } from "@/components/ui/skeleton";
import { type FC } from "react";

interface LinksListSkeletonProps {
  nCard: number;
}

const LinksListSkeleton: FC<LinksListSkeletonProps> = ({ nCard }) => {
  return (
    <div className="mt-8">
      {Array(nCard)
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

export default LinksListSkeleton;
