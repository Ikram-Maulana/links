import { type FC } from "react";
import { LinksListSkeleton } from "./_components/links-list/skeleton/links-list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

const Loading: FC = () => {
  return (
    <main className="container mx-auto w-screen max-w-[680px] px-4 md:px-0">
      {/* Profile Skeleton */}
      <div className="flex flex-col items-center pt-16">
        <Skeleton className="mb-4 h-24 w-24 rounded-full" />
        <Skeleton className="h-8 w-[157.45px]" />
        <Skeleton className="mt-1 h-[28px] w-[192.91px]" />
        <Skeleton className="mt-1 h-9 w-[272.06px]" />
      </div>

      <LinksListSkeleton nItem={5} />
      <span className="sr-only">Loading...</span>
    </main>
  );
};

export default Loading;
