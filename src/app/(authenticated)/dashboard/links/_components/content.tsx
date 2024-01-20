import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/server";
import { IconCircleX } from "@irsyadadl/paranoid";
import { unstable_noStore as noStore } from "next/cache";
import { type FC } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const Content: FC = async () => {
  noStore();
  const linksList = await api.linksList.getAll.query();

  if (!linksList || "error" in linksList) {
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

  return (
    <Card>
      <CardContent className="p-6">
        <DataTable columns={columns} data={linksList} />
      </CardContent>
    </Card>
  );
};

export default Content;
