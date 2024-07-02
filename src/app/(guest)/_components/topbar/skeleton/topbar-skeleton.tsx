import { Skeleton } from "@/components/ui/skeleton";
import { type FC } from "react";

export const TopbarSkeleton: FC = () => {
  return (
    <header className="container fixed top-0 z-10 my-3 w-full">
      <Skeleton className="mx-auto grid max-w-xl rounded-full border border-transparent bg-transparent p-3">
        <Skeleton className="col-start-3 flex h-10 w-10 items-center justify-center justify-self-end rounded-full" />
      </Skeleton>
    </header>
  );
};
