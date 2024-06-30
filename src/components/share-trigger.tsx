"use client";

import { ShareOptions } from "@/components/share-options";
import { Button } from "@/components/ui/button";
import {
  Remo,
  RemoClose,
  RemoContent,
  RemoDescription,
  RemoFooter,
  RemoHeader,
  RemoTitle,
  RemoTrigger,
} from "@/components/ui/remo";
import { env } from "@/env";
import { type FC } from "react";

interface ShareTriggerProps {
  children: React.ReactNode;
  asChild: true;
}

export const ShareTrigger: FC<ShareTriggerProps> = ({ children }) => {
  return (
    <Remo>
      <RemoTrigger asChild>{children}</RemoTrigger>
      <RemoContent>
        <RemoHeader>
          <RemoTitle>Share this Link</RemoTitle>
          <RemoDescription>
            Select options below to share this link with others.
          </RemoDescription>
        </RemoHeader>
        <ShareOptions url={env.NEXT_PUBLIC_BASE_URL} />
        <RemoFooter className="pt-4 md:hidden">
          <RemoClose asChild>
            <Button variant="outline">Cancel</Button>
          </RemoClose>
        </RemoFooter>
      </RemoContent>
    </Remo>
  );
};
