import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/server";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { type FC } from "react";
import EditFormSkeleton from "./skeleton/edit-form-skeleton";

const EditForm = dynamic(() => import("./edit-form"), {
  ssr: false,
  loading: () => <EditFormSkeleton />,
});

const EditCard: FC = async () => {
  const getDetail = await api.settings.getDetail.query();

  if (!getDetail || "error" in getDetail) {
    return notFound();
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
