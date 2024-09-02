import { BackToHomeButton } from "@/components/back-to-home-button";
import Ikmage from "@/components/ikmage";
import { publicMetadata } from "@/data";
import { type Metadata } from "next";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Login | Ikram Maulana Links",
};

export default function Page() {
  return (
    <main className="h-full lg:mx-auto lg:max-w-screen-2xl lg:px-0">
      <div className="grid h-full grid-cols-2">
        <div className="col-span-2 flex h-full flex-col items-center justify-center lg:col-span-1">
          <LoginForm />

          <div className="mt-6 flex w-fit justify-center">
            <BackToHomeButton />
          </div>
        </div>

        <div className="relative hidden h-full w-full overflow-hidden lg:block">
          <Ikmage
            src={publicMetadata.authImage.url}
            alt={publicMetadata.authImage.description}
            className="h-full w-full object-cover"
            width={666}
            height={999}
            priority
          />
        </div>
      </div>
    </main>
  );
}
