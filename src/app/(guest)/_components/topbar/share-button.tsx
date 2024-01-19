"use client";

import { LinkedinIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn, getBaseUrl } from "@/lib/utils";
import {
  IconBrandWhatsapp,
  IconChevronRight,
  IconDotsHorizontal,
  IconDuplicate,
  IconEnvelope,
} from "@irsyadadl/paranoid";
import { useClipboard, useMediaQuery } from "@mantine/hooks";
import { useState, type FC } from "react";

interface ShareButtonProps {
  yPosition: number;
}

const ShareButton: FC<ShareButtonProps> = ({ yPosition }) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className={cn(
              "col-start-3 flex h-10 w-10 items-center justify-center justify-self-end rounded-full  border-[#E2E2E2] bg-[#F0F0F0] px-3 text-lg font-bold text-zinc-900 hover:bg-[#EBEBEB] focus-visible:ring-[#D2D2D2]",
              {
                "bg-primary text-zinc-50 hover:bg-primary/90 focus-visible:ring-ring":
                  yPosition > 50,
              },
            )}
          >
            <IconDotsHorizontal />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share this Link</DialogTitle>
            <DialogDescription>
              Select options below to share this link with others.
            </DialogDescription>
          </DialogHeader>
          <ShareOptions />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className={cn(
            "col-start-3 flex h-10 w-10 items-center justify-center justify-self-end rounded-full  border-[#E2E2E2] bg-[#F0F0F0] px-3 text-lg font-bold text-zinc-900 hover:bg-[#EBEBEB] focus-visible:ring-[#D2D2D2]",
            {
              "bg-primary text-zinc-50 hover:bg-primary/90 focus-visible:ring-ring":
                yPosition > 50,
            },
          )}
        >
          <IconDotsHorizontal />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Share this Link</DrawerTitle>
          <DrawerDescription>
            Select options below to share this link with others.
          </DrawerDescription>
        </DrawerHeader>
        <ShareOptions />
        <DrawerFooter className="pt-4">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const ShareOptions = () => {
  const clipboard = useClipboard({ timeout: 500 });

  return (
    <div className="flex flex-col px-4 md:px-0">
      <Button variant="ghost" className="h-auto py-4" asChild>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${getBaseUrl()}?utm_source=ikramlink`}
          target="_blank"
        >
          <div className="grid w-full grid-cols-[min-content,auto,min-content] gap-4 text-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#0A66C2] text-zinc-50">
              <LinkedinIcon className="h-3 w-3 text-zinc-50" />
            </div>
            <span className="flex items-center justify-start">
              Share on Linkedin
            </span>
            <IconChevronRight className="justify-self-end" />
          </div>
        </a>
      </Button>

      <Button variant="ghost" className="h-auto py-4" asChild>
        <a
          href={`https://wa.me/?text=Check%20out%20this%20Link!%20-%20${getBaseUrl()}?utm_source=ikramlink`}
          target="_blank"
        >
          <div className="grid w-full grid-cols-[min-content,auto,min-content] gap-4 text-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#25D366] text-zinc-50">
              <IconBrandWhatsapp className="h-3 w-3 text-zinc-50" />
            </div>
            <span className="flex items-center justify-start">
              Share via Whatsapp
            </span>
            <IconChevronRight className="justify-self-end" />
          </div>
        </a>
      </Button>

      <Button variant="ghost" className="h-auto py-4" asChild>
        <a
          href={`mailto:?subject= Check out this Linkt! &amp;body= Check%20out%20this%20Link! - ${getBaseUrl()}?utm_source=ikramlink`}
          target="_blank"
        >
          <div className="grid w-full grid-cols-[min-content,auto,min-content] gap-4 text-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-gray-500 text-zinc-50">
              <IconEnvelope className="h-3 w-3 text-zinc-50" />
            </div>
            <span className="flex items-center justify-start">
              Share via Email
            </span>
            <IconChevronRight className="justify-self-end" />
          </div>
        </a>
      </Button>

      <Button
        variant="outline"
        className="mt-4 h-auto py-4"
        onClick={() => clipboard.copy(`${getBaseUrl()}?utm_source=ikramlink`)}
      >
        <div className="flex w-full grid-cols-[min-content,auto,min-content] gap-4 text-center">
          <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-gray-500 text-zinc-50">
            <IconDuplicate className="h-3 w-3 text-zinc-50" />
          </div>
          <span className="flex max-w-[260px] items-center justify-start truncate md:max-w-none">
            {getBaseUrl()}
          </span>
          <span
            className={cn("ml-auto flex items-center justify-start", {
              "text-primary": clipboard.copied,
            })}
          >
            {clipboard.copied ? "Copied!" : "Copy"}
          </span>
        </div>
      </Button>
    </div>
  );
};

export default ShareButton;
