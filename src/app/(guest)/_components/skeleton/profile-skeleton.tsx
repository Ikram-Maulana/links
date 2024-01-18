import { Skeleton } from "@/components/ui/skeleton";
import { type FC } from "react";

const ProfileSkeleton: FC = () => {
  return (
    <>
      <Skeleton className="mx-auto mb-4 h-24 w-24 rounded-full" />
      <Skeleton className="mx-auto h-[28px] w-[137px]" />
      <Skeleton className="mx-auto mt-1 h-[28px] w-[190px]" />
      <Skeleton className="mx-auto mt-1 h-[16px] w-[157px]" />
    </>
  );
};

export default ProfileSkeleton;
