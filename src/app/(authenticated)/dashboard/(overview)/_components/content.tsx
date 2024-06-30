import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/trpc/server";
import {
  IconCainLink3,
  IconCircleX,
  IconCursorClick,
} from "@irsyadadl/paranoid";
import { type FC } from "react";
import { CardOverview } from "./card-overview";

export const Content: FC = async () => {
  const overviewData = (await api.overview.getAll()) as {
    linksListCount: number;
    clickedLinksSum: number;
  };

  if (!overviewData) {
    return (
      <Alert
        variant="destructive"
        className="border-red-500 bg-red-500 text-zinc-50 dark:border-red-900 dark:bg-red-900"
      >
        <IconCircleX className="h-4 w-4 !text-zinc-50" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          An error occurred while loading overview data.
        </AlertDescription>
      </Alert>
    );
  }

  const newOverviewData = [
    {
      title: "Total Links",
      value: overviewData.linksListCount,
      icon: <IconCainLink3 className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Clicked",
      value: overviewData.clickedLinksSum,
      icon: <IconCursorClick className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="grid grid-flow-row grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {newOverviewData.map((data) => (
        <CardOverview key={data.title} {...data} />
      ))}
    </div>
  );
};
