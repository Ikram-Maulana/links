import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@irsyadadl/paranoid";
import Link from "next/link";
import { Suspense, type FC } from "react";
import { ContentWrapper } from "../../../_components/content-wrapper";
import { Header, HeaderText } from "../../../_components/header";
import { Content } from "./_components/content";
import { ContentSkeleton } from "./_components/content/skeleton/content-skeleton";

interface LinkProps {
  params: {
    id: string;
  };
}

const UpdateLink: FC<LinkProps> = async ({ params }) => {
  return (
    <ContentWrapper>
      <Header>
        <HeaderText
          title="Update Link"
          subtitle="This page is used to update link."
        />

        <Button variant="outline" size="sm" className="text-sm" asChild>
          <Link href="/dashboard/links-list">
            <IconArrowLeft className="mr-2 h-3 w-3" />
            Back to Link
          </Link>
        </Button>
      </Header>

      <Suspense fallback={<ContentSkeleton />}>
        <Content {...params} />
      </Suspense>
    </ContentWrapper>
  );
};

export default UpdateLink;
