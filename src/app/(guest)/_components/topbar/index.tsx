"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { env } from "@/env";
import { cn, isValidUrl } from "@/lib/utils";
import { type publicMetadata, type users } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { useWindowScroll } from "@mantine/hooks";
import { type InferSelectModel } from "drizzle-orm";
import Image from "next/image";
import { ShareButton } from "./share-button";

type ProfileDataProps = InferSelectModel<typeof users> & {
  publicMetadata: InferSelectModel<typeof publicMetadata>;
};

export default function Topbar() {
  const [scroll] = useWindowScroll();

  const {
    data: dataProfile,
    isLoading,
    isError,
  } = api.publicMetadata.getProfile.useQuery<ProfileDataProps>();

  if (isError) {
    return null;
  }

  const DEFAULT_IMAGE_URL = "https://placehold.co/96/webp";
  let imageUrl = DEFAULT_IMAGE_URL;
  const profileName = dataProfile?.name ?? "";
  if (dataProfile && !isLoading) {
    const getImageUrl = (profile: ProfileDataProps): string => {
      const { avatar } = profile.publicMetadata;
      const { image } = profile;

      if (avatar && avatar !== "") {
        return `${env.NEXT_PUBLIC_UPLOADCARE_BASE_URL}/${avatar}/-/quality/lighter/-/progressive/yes/`;
      } else if (image && image !== "" && isValidUrl(image)) {
        return image;
      } else {
        return DEFAULT_IMAGE_URL;
      }
    };

    imageUrl = getImageUrl(dataProfile);
  }

  return (
    <header className="container fixed top-0 z-10 mx-auto my-3 w-full px-2">
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
            <Image
              src={imageUrl}
              alt={profileName}
              className={cn(
                "col-start-1 hidden h-10 min-w-10 rounded-full object-cover",
                {
                  block: scroll.y > 50,
                },
              )}
              width={40}
              height={40}
            />

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
}
