import { RedirectToSignIn, SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    return <RedirectToSignIn />;
  }

  return (
    <>
      <h1>Hello Dashboard</h1>
      <SignOutButton />
    </>
  );
}
