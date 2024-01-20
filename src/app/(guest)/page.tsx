import { Suspense } from "react";
import LinksList from "./_components/links-list";
import LinksListSkeleton from "./_components/links-list/skeleton/links-list-skeleton";
import Profile from "./_components/profile";
import ProfileSkeleton from "./_components/skeleton/profile-skeleton";

export default async function Home() {
  return (
    <main className="container">
      <div className="mx-auto max-w-[680px]">
        <Suspense fallback={<ProfileSkeleton />}>
          <Profile />
        </Suspense>

        <Suspense fallback={<LinksListSkeleton nCard={5} />}>
          <LinksList />
        </Suspense>
      </div>
    </main>
  );
}
