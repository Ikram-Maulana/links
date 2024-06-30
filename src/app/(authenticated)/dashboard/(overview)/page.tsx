import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { ContentWrapper } from "../_components/content-wrapper";
import { Header, HeaderText } from "../_components/header";

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
    </ContentWrapper>
  );
}
