import { ScrollArea } from "@/components/ui/scroll-area";
import { League_Spartan } from "next/font/google";
import Link from "next/link";
import { type FC } from "react";
import { NavItem } from "../nav-item";

const leagueSpartan = League_Spartan({
  display: "swap",
  subsets: ["latin"],
});

export const Sidebar: FC = () => {
  return (
    <aside
      id="sidebar"
      className="hidden h-screen w-[250px] flex-shrink-0 flex-col justify-between border-r border-zinc-300 bg-background px-4 pb-6 dark:border-zinc-600 lg:flex"
    >
      <div className="flex h-[60px] items-center">
        <Link href="/dashboard">
          <p
            className={`${leagueSpartan.className} scroll-m-20 px-2 text-2xl font-semibold tracking-tight`}
          >
            Ikram Links.
          </p>
        </Link>
      </div>

      <div className="mt-6 flex-1">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <NavItem />
        </ScrollArea>
      </div>
    </aside>
  );
};
