import { type FC } from "react";
import ProfileSkeleton from "./_components/skeleton/profile-skeleton";
import LinksListSkeleton from "./_components/links-list/skeleton/links-list-skeleton";

const Loading: FC = () => {
  return (
    <div className="container px-4">
      <div className="mx-auto max-w-[680px]">
        <ProfileSkeleton />
        <LinksListSkeleton nCard={5} />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
