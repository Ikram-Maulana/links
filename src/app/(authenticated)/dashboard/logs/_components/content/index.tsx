import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import {
  type selectLinkSchema,
  type selectLogSchema,
} from "@/server/db/schema";
import { api } from "@/trpc/server";
import { type searchLogParamsSchema } from "@/types";
import { IconCircleX } from "@irsyadadl/paranoid";
import { Suspense, type FC } from "react";
import type { z } from "zod";
import { LogsTable } from "../data-table/logs-table";

interface ContentProps {
  search: z.infer<typeof searchLogParamsSchema>;
}

export const Content: FC<ContentProps> = async ({ search }) => {
  const logsData = (await api.log.getAll(search)) as {
    data: {
      logs: z.infer<typeof selectLogSchema>;
      links: z.infer<typeof selectLinkSchema> | null;
    }[];
    pageCount: number;
  };

  if (!logsData || (logsData && "error" in logsData)) {
    <Alert
      variant="destructive"
      className="border-red-500 bg-red-500 text-zinc-50 dark:border-red-900 dark:bg-red-900"
    >
      <IconCircleX className="h-4 w-4 !text-zinc-50" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        An error occurred while loading logs data.
      </AlertDescription>
    </Alert>;
  }

  return (
    <Card className="relative">
      <CardContent className="p-6">
        <Suspense
          key={`logs-table-${search.page}-${search.sort}`}
          fallback={<DataTableSkeleton columnCount={4} />}
        >
          <LogsTable logs={logsData} />
        </Suspense>
      </CardContent>
    </Card>
  );
};
