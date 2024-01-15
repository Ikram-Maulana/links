import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/server";
import { IconCircleX } from "@irsyadadl/paranoid";
import dynamic from "next/dynamic";
import { type FC } from "react";
import EditFormSkeleton from "./skeleton/edit-form-skeleton";
import { unstable_noStore as noStore } from "next/cache";

const EditForm = dynamic(() => import("./edit-form"), {
  ssr: false,
  loading: () => <EditFormSkeleton />,
});

const EditCard: FC = async () => {
  noStore();
  const getDetail = await api.settings.getDetail.query();

  if (!getDetail || "error" in getDetail) {
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
        <EditForm detail={getDetail} />
      </CardContent>
    </Card>
  );
};

export default EditCard;
