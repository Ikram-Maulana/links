import { authOptions } from "@/server/auth";
import { type Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense, type FC } from "react";
import CardMetrics from "../_components/card-metrics";
import CardMetricsSkeleton from "../_components/skeleton/card-metrics-skeleton";

export const metadata: Metadata = {
  title: "Dashboard | Ikram Maulana Links",
};

const page: FC = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <>
      <div className="mb-6 flex flex-col">
        <h1 className="w-fit scroll-m-20 text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="w-fit text-sm font-medium leading-6 text-gray-500">
          Welcome back, {session?.user.name}!
        </p>
      </div>

      <Suspense fallback={<CardMetricsSkeleton length={1} />}>
        <CardMetrics />
      </Suspense>
    </>
  );
};

export default page;
