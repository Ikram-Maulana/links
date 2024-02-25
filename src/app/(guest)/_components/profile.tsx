import { env } from "@/env";
import { isValidUrl } from "@/lib/utils";
import { type publicMetadata, type users } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { IconLocation } from "@irsyadadl/paranoid";
import { type InferSelectModel } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import { type FC } from "react";

type ProfileDataProps = InferSelectModel<typeof users> & {
  publicMetadata: InferSelectModel<typeof publicMetadata>;
};

export const Profile: FC = async () => {
  noStore();
  const profile =
    (await api.publicMetadata.getProfile.query()) as unknown as ProfileDataProps;

  if (!profile || !profile.publicMetadata) {
    return notFound();
  }

  const DEFAULT_IMAGE_URL = "https://placehold.co/96/webp";
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
  const imageUrl = getImageUrl(profile);

  return (
    <div className="flex flex-col items-center pt-16">
      <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full">
        <Image
          src={imageUrl}
          alt={profile.name ?? ""}
          className="h-full w-full object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>

      <h1 className="w-fit scroll-m-20 text-xl font-semibold tracking-tight">
        {profile.name}
      </h1>

      <p className="mt-1 w-fit leading-7">{profile.publicMetadata.bio}</p>
      <p className="mt-1 flex w-fit items-center text-sm font-medium leading-none">
        <IconLocation className="mr-1 h-4 w-4" />
        {profile.publicMetadata.location}
      </p>
    </div>
  );
};
