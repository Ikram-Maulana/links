import { Suspense } from "react";
import LinksList from "./_components/links-list";
import LinksListSkeleton from "./_components/links-list/skeleton/links-list-skeleton";
import Profile from "./_components/profile";
import ProfileSkeleton from "./_components/skeleton/profile-skeleton";

export default async function Home() {
  return (
    <main className="container mx-auto w-screen max-w-[680px] px-4 md:px-0">
      <Suspense fallback={<ProfileSkeleton />}>
        <Profile />
      </Suspense>

      <Suspense fallback={<LinksListSkeleton nCard={5} />}>
        <LinksList />
      </Suspense>
    </main>
  );
}
