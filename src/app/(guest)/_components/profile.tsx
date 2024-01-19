import DynamicImagesBlur from "@/components/images/dynamic/blur";
import { type publicMetadata, type users } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { IconLocation } from "@irsyadadl/paranoid";
import { type InferSelectModel } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { type FC } from "react";

type ProfileDataProps = InferSelectModel<typeof users> & {
  publicMetadata: InferSelectModel<typeof publicMetadata>;
};

const Profile: FC = async () => {
  noStore();
  const profile =
    (await api.publicMetadata.getProfile.query()) as unknown as ProfileDataProps;

  if (!profile || !profile.publicMetadata) {
    return notFound();
  }

  let imageUrl = "";
  try {
    if (profile.publicMetadata.avatar) {
      new URL(profile.publicMetadata.avatar); // this will throw an error if avatar is not a valid URL
      imageUrl = profile.publicMetadata.avatar;
    } else if (profile.image) {
      new URL(profile.image); // this will throw an error if image is not a valid URL
      imageUrl = profile.image;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Invalid URL: ${err.message}`);
    }

    console.error("Invalid URL for profile image");
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full">
        <DynamicImagesBlur src={imageUrl} alt={profile.name ?? ""} />
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

export default Profile;
