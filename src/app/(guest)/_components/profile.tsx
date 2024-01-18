import DynamicImagesBlur from "@/components/images/dynamic/blur";
import { type publicMetadata, type users } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { IconLocation } from "@irsyadadl/paranoid";
import { type InferSelectModel } from "drizzle-orm";
import { notFound } from "next/navigation";
import { type FC } from "react";

type ProfileDataProps = InferSelectModel<typeof users> & {
  publicMetadata: InferSelectModel<typeof publicMetadata>;
};

const Profile: FC = async () => {
  const profile =
    (await api.publicMetadata.getProfile.query()) as unknown as ProfileDataProps;

  if (!profile || !profile.publicMetadata) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full">
        <DynamicImagesBlur
          src={profile.publicMetadata.avatar ?? profile.image ?? ""}
          alt={profile.name ?? ""}
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

export default Profile;
