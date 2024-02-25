import ikramBrandImage from "@/assets/images/ikram-brand.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authOptions } from "@/server/auth";
import { IconOpenLink } from "@irsyadadl/paranoid";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { NavbarMobile } from "./navbar-mobile";
import { UserButton } from "./user-button";

export const Navbar: FC = async () => {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky left-0 right-0 top-0 z-50 flex h-20 items-center border-b border-neutral-300 backdrop-blur-sm">
      <div className={cn("container flex w-full items-center justify-between")}>
        <div className="flex w-full items-center justify-between gap-2">
          <div className="lg:hidden">
            <NavbarMobile />
          </div>

          <Link className="block" href="/dashboard">
            <Image
              src={ikramBrandImage}
              width={102}
              height={26}
              alt="Ikram Maulana Brand"
            />
          </Link>

          <div className="flex gap-4">
            <Button className="hidden lg:inline-flex">
              <Link href="/" target="_blank">
                Home Page
              </Link>
              <IconOpenLink className="ml-1 h-4 w-4" />
            </Button>
            <UserButton user={session?.user} />
          </div>
        </div>
      </div>
    </header>
  );
};
