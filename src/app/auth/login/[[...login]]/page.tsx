import { CoffeBar } from "@/assets/images";
import { BackToHomeButton } from "@/components/back-to-home-button";
import { type Metadata } from "next";
import Image from "next/image";
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

        <div className="relative hidden h-full overflow-hidden lg:block">
          <Image
            src={CoffeBar}
            alt="Cozy Sitting Area in Filipenko Coffee Bar"
            className="h-full w-full object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      </div>
    </main>
  );
}
