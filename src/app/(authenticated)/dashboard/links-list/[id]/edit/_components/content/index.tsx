import { Card } from "@/components/ui/card";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { type FC } from "react";
import Form from "../form";
import { type list } from "@/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";

interface ContentProps {
  id: string;
}

export const Content: FC<ContentProps> = async ({ id }) => {
  const linkData = (await api.list.getOneById({
    id,
  })) as InferSelectModel<typeof list>;

  if (!linkData) {
    return notFound();
  }

  return (
    <Card className="relative">
      <Form detailLink={linkData} />
    </Card>
  );
};
