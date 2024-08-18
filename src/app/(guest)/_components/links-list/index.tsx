import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { type links } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { IconCircleX, IconTriangleInfo } from "@irsyadadl/paranoid";
import { type InferSelectModel } from "drizzle-orm";
import { type FC } from "react";
import { LinksItem } from "./links-item";

type LinksListDataProps = InferSelectModel<typeof links>;

export const LinksList: FC = async () => {
  const linksList =
    (await api.link.getAllWithoutPagination()) as LinksListDataProps[];

  if (!linksList || (linksList && !Boolean(linksList.length))) {
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

  if ("error" in linksList) {
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
      {linksList.map((link) => (
        <LinksItem
          key={`link-${link.id}`}
          title={link.title}
          slug={link.slug}
        />
      ))}
    </div>
  );
};
