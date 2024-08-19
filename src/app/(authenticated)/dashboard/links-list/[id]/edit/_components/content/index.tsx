import { Card } from "@/components/ui/card";
import { api } from "@/trpc/server";
import { type updateLinkSchema } from "@/types";
import { notFound } from "next/navigation";
import { type FC } from "react";
import { type z } from "zod";
import Form from "../form";

interface ContentProps {
  id: string;
}

export const Content: FC<ContentProps> = async ({ id }) => {
  const linkData = (await api.link.getOneById({
    id,
  })) as z.infer<typeof updateLinkSchema>;

  if (!linkData) {
    return notFound();
  }

  return (
    <Card className="relative">
      <Form detailLink={linkData} />
    </Card>
  );
};
