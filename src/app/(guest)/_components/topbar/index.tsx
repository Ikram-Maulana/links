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
            blurDataURL="data:image/webp;base64,UklGRtIDAABXRUJQVlA4WAoAAAAgAAAAvQAAvQAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDgg5AEAAFAUAJ0BKr4AvgA+7XayU7otJSKkVDnbQB2JZ27g3paa8CD/JtJo2N8ysDBp2RERERIDF7ptRiTZ6pMpPexYWX/DAZBFBf3KNfTvC99KUl/5Y3/bNC//2trxYQlnpgDbALy/0MJnZYQAcvGEO2sC623c9LlgXDzm0fAe/Slzi3h4u2Wz+B8lLmiPCwhe9Uprw9Jsbn841rRKtzkjHYizfaacZkzmRmlXIbh9AAD+ujt3n2+2Y600jn7OuG2bEG3XeQm8TVR8e64dBU1UtGBj1MWl9LK4s4EXNS6zK207e85Th8ioX5IbXNQjCIMMMlv9PKl9jZqyOdXrYmBmjgFAzxtjZZ8XZ+1bUYbAY9yiGRD7AedqVpHiJz6AoQe4g80aoe3+avSrKKx3raP3eDkihmY5+9N15juTv5u7vgMAKRWaEBqaJNvLyq1TTBKc/De9TmsKFN0BCLNRf81mGYiLTngZTfG6Jvdpf+SzrT9jdX4/IKxCxOI3jX72JfgM4CuswRYWRKNZl5GAytFNp6lLLypLaB91GanEMZYuU+2tlpCjmCoCJRPIhsam4BEjlk58VbBnhFt6F0lJxMhB6mZTN0KDumzT5oYSh8egs4v7EktRqVPgru4CnFpsigHbTo+XnwGy+AA="
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
