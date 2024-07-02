"use client";

import { ShareTrigger } from "@/components/share-trigger";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { IconDotsHorizontal } from "@irsyadadl/paranoid";
import { useViewportSize } from "@mantine/hooks";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { useEffect, useState, type FC } from "react";

interface LinksItemProps {
  title: string;
  slug: string;
}

export const LinksItem: FC<LinksItemProps> = ({ title, slug }) => {
  const { width } = useViewportSize();
  const shouldReduceMotion = useReducedMotion();

  const [animationProps, setAnimationProps] = useState<{
    whileHover?: { scale: number };
    transition?: { type: string; stiffness: number; damping: number };
  }>({});

  useEffect(() => {
    if (width <= 768 || shouldReduceMotion) {
      setAnimationProps({});
    } else {
      setAnimationProps({
        whileHover: { scale: 1.02 },
        transition: { type: "spring", stiffness: 400, damping: 17 },
      });
    }
  }, [shouldReduceMotion, width]);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        {...animationProps}
        className="hover:custor-pointer group relative mb-4 h-auto w-full overflow-hidden rounded-lg bg-white shadow-sm"
      >
        <a
          href={`${env.NEXT_PUBLIC_BASE_URL}/s/${slug}`}
          className="text-break relative flex h-auto min-h-14 w-full items-center justify-center px-[44px] py-4 text-center"
          target="_blank"
          rel="noopener"
        >
          <p className="h-fit font-medium leading-6">{title}</p>
        </a>

        <ShareTrigger url={`${env.NEXT_PUBLIC_BASE_URL}/s/${slug}`} asChild>
          <Button
            variant="ghost"
            className="absolute bottom-0 right-[6px] top-0 z-[1] mx-0 my-auto flex h-10 w-10 items-center justify-center rounded-full px-3 text-lg font-bold transition-all hover:border-[#E2E2E2] hover:bg-[#F0F0F0] sm:right-2 lg:hidden lg:group-hover:flex"
            aria-label="Share this Link"
          >
            <IconDotsHorizontal />
          </Button>
        </ShareTrigger>
      </m.div>
    </LazyMotion>
  );
};
