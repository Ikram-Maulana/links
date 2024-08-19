import { searchLinkParamsSchema, type SearchParams } from "@/types";
import { type Metadata } from "next";
import { Suspense, type FC } from "react";
import { ContentWrapper } from "../_components/content-wrapper";
import { Header, HeaderText } from "../_components/header";
import { Content } from "./_components/content";
import { ContentSkeleton } from "./_components/content/skeleton/content-skeleton";

export const metadata: Metadata = {
  title: "Logs List | Ikram Maulana Links",
};

interface LogsPageProps {
  searchParams: SearchParams;
}

const Logs: FC<LogsPageProps> = async ({ searchParams }) => {
  const search = searchLinkParamsSchema.parse(searchParams);

  return (
    <ContentWrapper>
      <Header>
        <HeaderText
          title="Logs List"
          subtitle="This page is used to view logs."
        />
      </Header>

      <Suspense fallback={<ContentSkeleton />}>
        <Content search={search} />
      </Suspense>
    </ContentWrapper>
  );
};

export default Logs;
