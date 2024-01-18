import { Skeleton } from "@/components/ui/skeleton";
import { type FC } from "react";

const ProfileSkeleton: FC = () => {
  return (
    <div className="flex flex-col items-center">
      <Skeleton className="mb-4 h-24 w-24 rounded-full" />
      <Skeleton className="h-[28px] w-[137px]" />
      <Skeleton className="mt-1 h-[28px] w-[190px]" />
      <Skeleton className="mt-1 h-[16px] w-[157px]" />
    </div>
  );
};

export default ProfileSkeleton;
