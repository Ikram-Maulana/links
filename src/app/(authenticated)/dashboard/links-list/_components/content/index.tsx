import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { type list } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { IconCircleX } from "@irsyadadl/paranoid";
import { type InferSelectModel } from "drizzle-orm";
import { Suspense, type FC } from "react";
import type * as z from "zod";
import { type searchParamsSchema } from "../../_lib/validation";
import { ListTable } from "../data-table/list-table";

interface ContentProps {
  search: z.infer<typeof searchParamsSchema>;
}

export const Content: FC<ContentProps> = async ({ search }) => {
  const listData = (await api.list.getAll(search)) as {
    data: InferSelectModel<typeof list>[];
    pageCount: number;
  };

  if (!listData || (listData && "error" in listData)) {
    <Alert
      variant="destructive"
      className="border-red-500 bg-red-500 text-zinc-50 dark:border-red-900 dark:bg-red-900"
    >
      <IconCircleX className="h-4 w-4 !text-zinc-50" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        An error occurred while loading list data.
      </AlertDescription>
    </Alert>;
  }

  return (
    <Card className="relative">
      <CardContent className="p-6">
        <Suspense
          key={`list-table-${search.page}-${search.sort}`}
          fallback={<DataTableSkeleton columnCount={4} />}
        >
          <ListTable list={listData} />
        </Suspense>
      </CardContent>
    </Card>
  );
};
