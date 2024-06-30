import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconBrandLinkedin,
  IconBrandWhatsapp,
  IconDuplicate,
  IconEnvelope,
} from "@irsyadadl/paranoid";
import { useClipboard } from "@mantine/hooks";
import { type FC } from "react";
import { ShareButton } from "./share-button";

interface ShareOptionsProps {
  url: string;
}

export const ShareOptions: FC<ShareOptionsProps> = ({ url }) => {
  const clipboard = useClipboard({ timeout: 500 });

  return (
    <div className="flex flex-col px-4 md:px-0">
      <ShareButton
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}?utm_source=ikramlink`}
        backgroundColor="bg-[#0A66C2]"
        icon={<IconBrandLinkedin className="h-3 w-3 text-zinc-50" />}
        label="Share on Linkedin"
      />

      <ShareButton
        href={`https://wa.me/?text=Check%20out%20this%20Link!%20-${url}?utm_source=ikramlink`}
        backgroundColor="bg-[#25D366]"
        icon={<IconBrandWhatsapp className="h-3 w-3 text-zinc-50" />}
        label="Share via Whatsapp"
      />

      <ShareButton
        href={`mailto:?subject=Check out this Link!&body=Check out this Link! - ${url}?utm_source=ikramlink`}
        backgroundColor="bg-gray-500"
        icon={<IconEnvelope className="h-3 w-3 text-zinc-50" />}
        label="Share via Email"
      />

      <Button
        variant="outline"
        className="mt-4 h-auto max-w-[375px] py-4"
        onClick={() => clipboard.copy(`${url}?utm_source=ikramlink`)}
      >
        <div className="flex w-full grid-cols-[min-content,auto,min-content] gap-4 text-center">
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm bg-gray-500 text-zinc-50">
            <IconDuplicate className="h-3 w-3 text-zinc-50" />
          </div>
          <span className="flex max-w-[260px] items-center justify-start truncate md:max-w-none">
            {url}
          </span>
          <span
            className={cn("ml-auto flex items-center justify-start", {
              "text-green-700": clipboard.copied,
            })}
          >
            {clipboard.copied ? "Copied!" : "Copy"}
          </span>
        </div>
      </Button>
    </div>
  );
};
