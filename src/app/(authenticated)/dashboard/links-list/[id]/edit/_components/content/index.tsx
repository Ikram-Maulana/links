import { Card } from "@/components/ui/card";
import { type links } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { type InferSelectModel } from "drizzle-orm";
import { notFound } from "next/navigation";
import { type FC } from "react";
import Form from "../form";

interface ContentProps {
  id: string;
}

export const Content: FC<ContentProps> = async ({ id }) => {
  const linkData = (await api.link.getOneById({
    id,
  })) as InferSelectModel<typeof links>;

  if (!linkData) {
    return notFound();
  }

  return (
    <Card className="relative">
      <Form detailLink={linkData} />
    </Card>
  );
};
