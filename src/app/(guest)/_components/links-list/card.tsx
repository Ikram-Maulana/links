import { env } from "@/env";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { type FC } from "react";
import { ShareButton } from "./share-button";

interface CardProps {
  image: string | null;
  title: string;
  url: string;
  slug: string;
}

export const Card: FC<CardProps> = ({ image = "", title, url, slug }) => {
  return (
    <div className="custor-pointer group relative mb-4 h-auto w-full transform overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-200 ease-in-out hover:scale-[102%]">
      <a
        href={`${url}?utm_source=ikramlinks&utm_medium=redirect&utm_campaign=ikramlinks`}
        className={cn(
          "text-break relative flex h-auto min-h-14 w-full items-center justify-center px-[66px] py-4 text-center",
          {
            "px-[44px]": image === "" && !image,
          },
        )}
        target="_blank"
        rel="noopener"
      >
        <div className="h-full w-full">
          <div className="absolute left-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center	justify-center overflow-hidden rounded-md">
            {image !== "" && image && (
              <Image
                src={`${env.NEXT_PUBLIC_UPLOADCARE_BASE_URL}/${image}/-/quality/lighter/-/progressive/yes/`}
                alt={title}
                layout="fill"
                sizes="100vw"
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <p className="h-fit font-medium leading-6">{title}</p>
        </div>
      </a>

      <ShareButton slug={slug} />
    </div>
  );
};
