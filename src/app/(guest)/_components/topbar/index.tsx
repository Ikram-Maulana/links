"use client";

import { ShareTrigger } from "@/components/share-trigger";
import { Button } from "@/components/ui/button";
import { publicMetadata } from "@/data";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import { IconDotsHorizontal } from "@irsyadadl/paranoid";
import { useWindowScroll } from "@mantine/hooks";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TopbarSkeleton } from "./skeleton/topbar-skeleton";

export default function Topbar() {
  const [{ y: scrollY }] = useWindowScroll();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <TopbarSkeleton />;
  }

  return (
    <header className="container fixed top-0 z-10 my-3 w-full px-2">
      <div
        className={cn(
          "mx-auto grid max-w-xl grid-cols-[min-content,auto,min-content] rounded-full border border-transparent bg-transparent p-3",
          {
            "border-[#ebeef1] bg-neutral-50/80 backdrop-blur-sm": scrollY > 50,
          },
        )}
      >
        <div
          className={cn(
            "relative col-start-1 hidden h-10 w-10 overflow-hidden rounded-full",
            {
              block: scrollY > 50,
            },
          )}
        >
          <Image
            src={publicMetadata.avatar}
            alt={`Profile Picture of ${publicMetadata.name}`}
            className="h-full w-full object-cover"
            fill
            placeholder="blur"
          />
        </div>

        <p
          className={cn(
            "mx-auto hidden items-center justify-center font-semibold leading-7",
            {
              flex: scrollY > 50,
            },
          )}
        >
          {publicMetadata.name}
        </p>

        <ShareTrigger url={env.NEXT_PUBLIC_BASE_URL} asChild>
          <Button
            className={cn(
              "col-start-3 flex h-10 w-10 items-center justify-center justify-self-end rounded-full border-[#E2E2E2] bg-[#F0F0F0] px-3 text-lg font-bold text-zinc-900 hover:bg-[#EBEBEB] focus-visible:ring-[#D2D2D2]",
              {
                "bg-primary text-zinc-50 hover:bg-primary/90 focus-visible:ring-ring":
                  scrollY > 50,
              },
            )}
            aria-label="Share this Link"
          >
            <IconDotsHorizontal />
          </Button>
        </ShareTrigger>
      </div>
    </header>
  );
}
