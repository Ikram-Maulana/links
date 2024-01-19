import { Suspense } from "react";
import Profile from "./_components/profile";
import ProfileSkeleton from "./_components/skeleton/profile-skeleton";

export default async function Home() {
  return (
    <main className="container">
      <div className="mx-auto max-w-[680px]">
        <Suspense fallback={<ProfileSkeleton />}>
          <Profile />
        </Suspense>
      </div>
    </main>
  );
}
