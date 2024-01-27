import { type FC } from "react";
import ProfileSkeleton from "./_components/skeleton/profile-skeleton";
import LinksListSkeleton from "./_components/links-list/skeleton/links-list-skeleton";

const Loading: FC = () => {
  return (
    <main className="container mx-auto w-screen max-w-[680px] px-4 md:px-0">
      <ProfileSkeleton />
      <LinksListSkeleton nCard={5} />
      <span className="sr-only">Loading...</span>
    </main>
  );
};

export default Loading;
