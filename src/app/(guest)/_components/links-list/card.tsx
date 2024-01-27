"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { type FC } from "react";

const ShareButton = dynamic(() => import("./share-button"), {
  loading: () => (
    <Skeleton className="absolute bottom-0 right-[6px] top-0 z-[1] mx-0 my-auto h-10 w-10 rounded-full" />
  ),
  ssr: false,
});

interface CardProps {
  image: string | null;
  title: string;
  url: string;
  slug: string;
}

const Card: FC<CardProps> = ({ image = "", title, url, slug }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="hover:custor-pointer group relative mb-4 h-auto w-full overflow-hidden rounded-lg bg-white shadow-sm"
    >
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
        id={`${slug}-link`}
        data-umami-event={`${title} link`}
      >
        <div className="h-full w-full">
          <div className="absolute left-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center	justify-center overflow-hidden rounded-md">
            {image !== "" && image && (
              <Image
                src={image}
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
    </motion.div>
  );
};

export default Card;
