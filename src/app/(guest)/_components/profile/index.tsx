import Ikmage from "@/components/ikmage";
import { Button } from "@/components/ui/button";
import { publicMetadata } from "@/data";
import { IconLocation } from "@irsyadadl/paranoid";
import { League_Spartan } from "next/font/google";
import { type FC } from "react";
import { AvailabilityIndicator } from "./availability-indicator";

const leagueSpartan = League_Spartan({
  display: "swap",
  subsets: ["latin"],
});

export const Profile: FC = () => {
  return (
    <div className="flex flex-col items-center pt-16">
      <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full">
        <Ikmage
          src={publicMetadata.avatar.url}
          alt={publicMetadata.avatar.description}
          className="h-full w-full object-cover"
          width={96}
          height={96}
          priority
        />
      </div>

      <h1
        className={`${leagueSpartan.className} w-fit scroll-m-20 text-2xl font-extrabold tracking-tight`}
      >
        {publicMetadata.name}
      </h1>

      <p className="mt-1 w-fit leading-7">{publicMetadata.bio}</p>

      <div className="flex flex-wrap items-center gap-x-4">
        <Button
          variant="ghost"
          className="pointer-events-none p-0 text-sm font-medium leading-none text-accent-foreground"
        >
          <IconLocation className="mr-1 h-4 w-4" />
          {publicMetadata.location}
        </Button>
        {publicMetadata.isAvailable ? (
          <>
            <p>|</p>
            <AvailabilityIndicator />
          </>
        ) : null}
      </div>
    </div>
  );
};
