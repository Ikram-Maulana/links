import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconChevronRight } from "@irsyadadl/paranoid";
import { type FC } from "react";

interface ShareButtonProps {
  href: string;
  backgroundColor: string;
  icon: JSX.Element;
  label: string;
}

export const ShareButton: FC<ShareButtonProps> = ({
  href,
  backgroundColor,
  icon,
  label,
}) => (
  <Button variant="ghost" className="h-auto py-4" asChild>
    <a href={href} target="_blank" rel="noopener noreferrer">
      <div className="grid w-full grid-cols-[min-content,auto,min-content] gap-4 text-center">
        <div
          className={cn(
            `flex h-6 w-6 items-center justify-center rounded-sm ${backgroundColor} text-zinc-50`,
          )}
        >
          {icon}
        </div>
        <span className="flex items-center justify-start">{label}</span>
        <IconChevronRight className="justify-self-end" />
      </div>
    </a>
  </Button>
);
