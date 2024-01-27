import { Skeleton } from "@/components/ui/skeleton";
import { type FC } from "react";

const Loading: FC = () => {
  return (
    <>
      <div className="mb-6 flex flex-col">
        <Skeleton className="h-[27px] w-[118px]" />
        <Skeleton className="mt-2 h-[16px] w-[196px]" />
      </div>

      <Skeleton className="h-full max-h-[599px] w-full rounded-xl md:max-h-[504px]" />
      <span className="sr-only">Loading...</span>
    </>
  );
};

export default Loading;
