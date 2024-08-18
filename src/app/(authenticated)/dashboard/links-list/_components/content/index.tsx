import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { type links } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { type searchLinkParamsSchema } from "@/types";
import { IconCircleX } from "@irsyadadl/paranoid";
import { type InferSelectModel } from "drizzle-orm";
import { Suspense, type FC } from "react";
import type * as z from "zod";
import { LinksTable } from "../data-table/link-table";

interface ContentProps {
  search: z.infer<typeof searchLinkParamsSchema>;
}

export const Content: FC<ContentProps> = async ({ search }) => {
  const linksData = (await api.link.getAll(search)) as {
    data: InferSelectModel<typeof links>[];
    pageCount: number;
  };

  if (!linksData || (linksData && "error" in linksData)) {
    <Alert
      variant="destructive"
      className="border-red-500 bg-red-500 text-zinc-50 dark:border-red-900 dark:bg-red-900"
    >
      <IconCircleX className="h-4 w-4 !text-zinc-50" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        An error occurred while loading links data.
      </AlertDescription>
    </Alert>;
  }

  return (
    <Card className="relative">
      <CardContent className="p-6">
        <Suspense
          key={`links-table-${search.page}-${search.sort}`}
          fallback={<DataTableSkeleton columnCount={4} />}
        >
          <LinksTable links={linksData} />
        </Suspense>
      </CardContent>
    </Card>
  );
};
