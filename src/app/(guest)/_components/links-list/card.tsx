"use client";

import { cn } from "@/lib/utils";
import { useViewportSize } from "@mantine/hooks";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, type FC } from "react";
import { ShareButton } from "./share-button";

interface CardProps {
  image: string | null;
  title: string;
  url: string;
  slug: string;
}

export const Card: FC<CardProps> = ({ image = "", title, url, slug }) => {
  const shouldReduceMotion = useReducedMotion();
  const { width } = useViewportSize();
  const [scaleProp, setScaleProp] = useState<{ scale: number } | undefined>();
  const [transitionProp, setTransitionProp] = useState<
    { type: string; stiffness: number; damping: number } | undefined
  >();

  useEffect(() => {
    if (width <= 768) {
      setScaleProp(undefined);
      setTransitionProp(undefined);
    } else {
      setScaleProp(shouldReduceMotion ? undefined : { scale: 1.02 });
      setTransitionProp(
        shouldReduceMotion
          ? undefined
          : { type: "spring", stiffness: 400, damping: 17 },
      );
    }
  }, [shouldReduceMotion, width]);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        whileHover={scaleProp}
        transition={transitionProp}
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
      </m.div>
    </LazyMotion>
  );
};
