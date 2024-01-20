"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type publicMetadata, type users } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { useWindowScroll } from "@mantine/hooks";
import { type InferSelectModel } from "drizzle-orm";
import dynamic from "next/dynamic";
import { type FC } from "react";

const ShareButton = dynamic(() => import("./share-button"), {
  loading: () => <Skeleton className="col-start-3 h-10 w-10 rounded-full" />,
  ssr: false,
});

type ProfileDataProps = InferSelectModel<typeof users> & {
  publicMetadata: InferSelectModel<typeof publicMetadata>;
};

const Topbar: FC = () => {
  const [scroll] = useWindowScroll();

  const {
    data: dataProfile,
    isLoading,
    isError,
  } = api.publicMetadata.getProfile.useQuery<ProfileDataProps>();

  if (isError) {
    return null;
  }

  let imageUrl = "";
  let profileName = "";
  if (dataProfile && !isLoading) {
    try {
      if (dataProfile.publicMetadata.avatar) {
        new URL(dataProfile.publicMetadata.avatar); // this will throw an error if avatar is not a valid URL
        imageUrl = dataProfile.publicMetadata.avatar;
      } else if (dataProfile.image) {
        new URL(dataProfile.image); // this will throw an error if image is not a valid URL
        imageUrl = dataProfile.image;
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Invalid URL: ${err.message}`);
      }

      console.error("Invalid URL for profile image");
    }

    profileName = dataProfile.name ?? "";
  }

  return (
    <header className="container fixed top-0 z-10 my-3 w-full px-2">
      <div
        className={cn(
          "mx-auto grid max-w-[788px] grid-cols-[min-content,auto,min-content] rounded-full border border-transparent bg-transparent p-3",
          {
            "border-[#ebeef1] bg-neutral-50/80 backdrop-blur-sm": scroll.y > 50,
          },
        )}
      >
        {isLoading && (
          <>
            <Skeleton
              className={cn("col-start-1 hidden h-10 w-10 rounded-full", {
                flex: scroll.y > 50,
              })}
            />
            <Skeleton
              className={cn("col-start-2 m-auto hidden h-[28px] w-[115px]", {
                block: scroll.y > 50,
              })}
            />
          </>
        )}

        {dataProfile && !isLoading && (
          <>
            <Avatar
              className={cn("hidden", {
                block: scroll.y > 50,
              })}
            >
              <AvatarImage src={imageUrl} alt={profileName} />
              <AvatarFallback>
                {profileName
                  .split(" ")
                  .map((name: string) => name[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <p
              className={cn(
                "mx-auto hidden items-center justify-center font-semibold leading-7",
                {
                  flex: scroll.y > 50,
                },
              )}
            >
              {profileName}
            </p>
          </>
        )}

        <ShareButton yPosition={scroll.y} />
      </div>
    </header>
  );
};

export default Topbar;
