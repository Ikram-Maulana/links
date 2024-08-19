import { Skeleton } from "@/components/ui/skeleton";
import { type FC } from "react";
import { ContentWrapper } from "../_components/content-wrapper";
import { Header } from "../_components/header";
import { ContentSkeleton } from "./_components/content/skeleton/content-skeleton";

const Loading: FC = () => {
  return (
    <ContentWrapper>
      <Header>
        <div className="flex flex-col">
          <Skeleton className="h-[27px] w-[118px]" />
          <Skeleton className="mt-2 h-[24px] w-[303px]" />
        </div>
      </Header>

      <ContentSkeleton />
    </ContentWrapper>
  );
};

export default Loading;
