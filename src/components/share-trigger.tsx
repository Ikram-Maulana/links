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
import { type FC } from "react";

interface ShareTriggerProps {
  children: React.ReactNode;
  url: string;
  asChild: true;
}

export const ShareTrigger: FC<ShareTriggerProps> = ({ children, url }) => {
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
        <ShareOptions url={url} />
        <RemoFooter className="pt-4 md:hidden">
          <RemoClose asChild>
            <Button variant="outline">Cancel</Button>
          </RemoClose>
        </RemoFooter>
      </RemoContent>
    </Remo>
  );
};
