import { Button } from "@/components/ui/button";
import { IconOpenLink, IconSidebar } from "@irsyadadl/paranoid";
import Link from "next/link";
import { type FC } from "react";
import { TopbarBurgerWrapper } from "./topbar-burger-wrapper";
import { UserDropdown } from "./user-dropdown";

const TopbarMobile: FC = () => {
  return (
    <div
      id="topbar-mobile"
      className="absolute left-0 top-0 z-40 flex w-full items-center border-b border-zinc-300 bg-background dark:border-zinc-600 lg:hidden"
    >
      <div className="flex w-full items-center justify-between px-6 py-4">
        <TopbarBurgerWrapper>
          <Button size="icon" variant="outline">
            <IconSidebar className="h-4 w-4" />
          </Button>
        </TopbarBurgerWrapper>

        <div className="flex gap-2">
          <Button variant="outline">
            <Link href="/" target="_blank">
              Homepage
            </Link>
            <IconOpenLink className="ml-1 h-4 w-4" />
          </Button>

          <div className="flex h-9 w-9 items-center justify-end">
            <UserDropdown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopbarMobile;
