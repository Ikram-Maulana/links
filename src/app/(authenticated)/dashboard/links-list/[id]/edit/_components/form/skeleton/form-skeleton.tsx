import { CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type FC } from "react";

export const EditLinkFormSkeleton: FC = () => {
  return (
    <>
      <CardContent className="space-y-4 p-6">
        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9" />
        </div>

        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9" />
        </div>

        <Skeleton className="h-[90.38px] w-full md:h-[71.19px]" />
      </CardContent>

      <CardFooter className="justify-end border-t px-6 py-4">
        <Skeleton className="h-9 w-24" />
      </CardFooter>
    </>
  );
};
