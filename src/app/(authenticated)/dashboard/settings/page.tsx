import { Skeleton } from "@/components/ui/skeleton";
import { type Metadata } from "next";
import { Suspense, type FC } from "react";
import { EditCard } from "./_components/edit-card";

export const metadata: Metadata = {
  title: "Dashboard Settings | Ikram Maulana Links",
};

const page: FC = () => {
  return (
    <>
      <div className="mb-4 flex flex-col">
        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="text-sm font-medium leading-6 text-gray-500">
          This page is used to manage users settings.
        </p>
      </div>

      <Suspense
        fallback={
          <Skeleton className="h-full max-h-[599px] w-full rounded-xl md:max-h-[504px]" />
        }
      >
        <EditCard />
      </Suspense>
    </>
  );
};

export default page;
