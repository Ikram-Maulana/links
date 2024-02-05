import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { type linksList } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { IconCircleX, IconTriangleInfo } from "@irsyadadl/paranoid";
import { type InferSelectModel } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { type FC } from "react";
import Card from "./card";

type LinksDataProps = InferSelectModel<typeof linksList>;

const LinksList: FC = async () => {
  noStore();
  const links =
    (await api.linksList.getAll.query()) as unknown as LinksDataProps[];

  if (!links) {
    return (
      <Alert
        className="mt-8 border-amber-500 bg-amber-500 text-zinc-50 dark:border-amber-900 dark:bg-amber-900 dark:text-zinc-50"
        variant="destructive"
      >
        <IconTriangleInfo className="h-4 w-4 !text-[#fafafa]" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Sorry, the link list is empty.</AlertDescription>
      </Alert>
    );
  }

  if ("error" in links) {
    return (
      <Alert
        className="mt-8 border-red-500 bg-red-500 text-zinc-50 dark:border-red-900 dark:bg-red-900 dark:text-zinc-50"
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
    <div className="mt-8">
      {links.map((link) => (
        <Card
          key={`linkslist-${link.id}`}
          title={link.title}
          url={link.url}
          slug={link.slug}
          image={link.image}
        />
      ))}
    </div>
  );
};

export default LinksList;
