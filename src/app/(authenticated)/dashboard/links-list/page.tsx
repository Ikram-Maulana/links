import { Button } from "@/components/ui/button";
import { IconPlus } from "@irsyadadl/paranoid";
import Link from "next/link";
import { type FC } from "react";
import { ContentWrapper } from "../_components/content-wrapper";
import { Header, HeaderText } from "../_components/header";

const Links: FC = () => {
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

      {/* <Suspense fallback={<ContentSkeleton />}>
        <Content search={search} />
      </Suspense> */}
    </ContentWrapper>
  );
};

export default Links;
