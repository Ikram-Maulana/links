import { Skeleton } from "@/components/ui/skeleton";
import { type FC } from "react";
import { ContentWrapper } from "../../_components/content-wrapper";
import { Header } from "../../_components/header";

const Loading: FC = () => {
  return (
    <ContentWrapper>
      <Header>
        <div className="flex flex-col">
          <Skeleton className="h-[27px] w-[118px]" />
          <Skeleton className="mt-2 h-[24px] w-[303px]" />
        </div>

        <Skeleton className="h-8 w-[179.19px] rounded-lg" />
      </Header>

      <Skeleton className="h-[358.19px] w-full" />
    </ContentWrapper>
  );
};

export default Loading;
