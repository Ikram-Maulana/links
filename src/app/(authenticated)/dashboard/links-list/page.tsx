import { Button } from "@/components/ui/button";
import { type SearchParams } from "@/types";
import { IconPlus } from "@irsyadadl/paranoid";
import { type Metadata } from "next";
import Link from "next/link";
import { Suspense, type FC } from "react";
import { ContentWrapper } from "../_components/content-wrapper";
import { Header, HeaderText } from "../_components/header";
import { Content } from "./_components/content";
import { ContentSkeleton } from "./_components/content/skeleton/content-skeleton";
import { searchParamsSchema } from "./_lib/validation";

export const metadata: Metadata = {
  title: "Links List | Ikram Maulana Links",
};

interface LinksPageProps {
  searchParams: SearchParams;
}

const Links: FC<LinksPageProps> = async ({ searchParams }) => {
  const search = searchParamsSchema.parse(searchParams);

  return (
    <ContentWrapper>
      <Header>
        <HeaderText
          title="Links List"
          subtitle="This page is used to manage links."
        />

        <Button size="sm" className="text-sm" asChild>
          <Link href="/dashboard/links-list/create">
            <IconPlus className="mr-2 h-3 w-3" />
            Add Link
          </Link>
        </Button>
      </Header>

      <Suspense fallback={<ContentSkeleton />}>
        <Content search={search} />
      </Suspense>
    </ContentWrapper>
  );
};

export default Links;
