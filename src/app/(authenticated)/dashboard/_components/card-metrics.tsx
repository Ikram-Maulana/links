import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/server";
import { IconCircleX, IconLink } from "@irsyadadl/paranoid";
import { type FC } from "react";

interface metricsProps {
  counts: {
    links: number;
  };
}

const CardMetrics: FC = async () => {
  const metrics = (await api.metrics.getAll.query()) as unknown as metricsProps;

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
  );
};

export default CardMetrics;
