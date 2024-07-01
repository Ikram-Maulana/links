import { type FC } from "react";
import { ContentWrapper } from "../../_components/content-wrapper";
import { Header, HeaderText } from "../../_components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconArrowLeft } from "@irsyadadl/paranoid";
import { Content } from "./_components/content";

const AddLinks: FC = () => {
  return (
    <ContentWrapper>
      <Header>
        <HeaderText
          title="Add Link"
          subtitle="This page is used to add link."
        />

        <Button variant="outline" size="sm" className="text-sm" asChild>
          <Link href="/dashboard/links-list">
            <IconArrowLeft className="mr-2 h-3 w-3" />
            Back to Links List
          </Link>
        </Button>
      </Header>

      <Content />
    </ContentWrapper>
  );
};

export default AddLinks;
