import { Suspense } from "react";
import { LinksList } from "./_components/links-list";
import { LinksListSkeleton } from "./_components/links-list/skeleton/links-list-skeleton";
import { Profile } from "./_components/profile";

export default function Home() {
  return (
    <div className="container max-w-xl px-4 md:px-0">
      <Profile />

      <Suspense fallback={<LinksListSkeleton nItem={5} />}>
        <LinksList />
      </Suspense>
    </div>
  );
}
