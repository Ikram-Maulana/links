import { Skeleton } from "@/components/ui/skeleton";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { type FC } from "react";

export const UserDropdown: FC = () => {
  return (
    <>
      <ClerkLoading>
        <Skeleton className="h-8 w-8 rounded-full lg:h-7 lg:w-7" />
      </ClerkLoading>
      <ClerkLoaded>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8 lg:w-7 lg:h-7",
            },
          }}
        />
      </ClerkLoaded>
    </>
  );
};
