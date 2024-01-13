import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/server";
import { IconCircleX, IconLink, IconTriangleInfo } from "@irsyadadl/paranoid";
import Link from "next/link";
import { type FC } from "react";

interface metricsProps {
  counts: {
    links: number;
  };
}

const CardMetrics: FC = async () => {
  const [metrics, publicMetadata] = await Promise.all([
    api.metrics.getAll.query() as unknown as metricsProps,
    api.publicMetadata.available.query(),
  ]);

  if (!metrics || "error" in metrics) {
    return (
      <Alert
        className="border-red-500 bg-red-500 text-zinc-50 dark:border-red-900 dark:bg-red-900 dark:text-zinc-50"
        variant="destructive"
      >
        <IconCircleX className="h-4 w-4 !text-[#fafafa]" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          An error occurred while loading data.
        </AlertDescription>
      </Alert>
    );
  }

  const metricsData = [
    {
      title: "Total Links",
      value: metrics.counts.links,
      icon: <IconLink className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <>
      {(!publicMetadata || "error" in publicMetadata) && (
        <Alert
          className="mb-4 border-amber-500 bg-amber-500 text-zinc-50 dark:border-amber-900 dark:bg-amber-900 dark:text-zinc-50"
          variant="destructive"
        >
          <IconTriangleInfo className="h-4 w-4 !text-[#fafafa]" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            You haven&apos;t filled in the basic information, please fill it in
            first{" "}
            <Link href="/dashboard/settings" className="underline">
              here
            </Link>
            .
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-flow-row grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metricsData.map((metric, index) => (
          <Card key={`metric-${index}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default CardMetrics;
