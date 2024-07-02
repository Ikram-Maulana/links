import { Button } from "@/components/ui/button";
import { IconOpenLink } from "@irsyadadl/paranoid";
import Link from "next/link";
import { type FC } from "react";
import TopbarMobile from "./topbar-mobile";
import { UserDropdown } from "./user-dropdown";

export const Topbar: FC = () => {
  return (
    <div
      id="topbar-desktop"
      className="flex h-[60px] items-center justify-end border-b border-zinc-300 bg-background px-6 dark:border-zinc-600"
    >
      <TopbarMobile />

      <div className="hidden lg:flex lg:gap-3">
        <Button size="sm" variant="outline" className="text-sm" asChild>
          <Link href="/" target="_blank">
            Homepage
            <IconOpenLink className="ml-2 h-3 w-3" />
          </Link>
        </Button>

        <div className="flex h-8 w-7 items-center justify-center">
          <UserDropdown />
        </div>
      </div>
    </div>
  );
};
