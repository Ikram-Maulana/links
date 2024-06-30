import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { ContentWrapper } from "../_components/content-wrapper";
import { Header, HeaderText } from "../_components/header";
import { Content } from "./_components/content";
import { ContentSkeleton } from "./_components/skeleton/content-skeleton";

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    return <RedirectToSignIn />;
  }

  return (
    <ContentWrapper>
      <Header>
        <HeaderText
          title="Dashboard"
          subtitle={`Welcome back, ${user.fullName}!`}
        />
      </Header>

      <Suspense fallback={<ContentSkeleton />}>
        <Content />
      </Suspense>
    </ContentWrapper>
  );
}
