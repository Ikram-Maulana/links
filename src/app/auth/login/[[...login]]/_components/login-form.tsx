"use client";

import ikramLogo from "@/assets/images/ikram-logo.webp";
import { Button } from "@/components/ui/button";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { IconBrandGithub, IconLoader } from "@irsyadadl/paranoid";
import { League_Spartan } from "next/font/google";
import Image from "next/image";
import { useEffect, useState, type FC } from "react";
import { LoginFormSkeleton } from "./skeleton/login-form-skeleton";

const leagueSpartan = League_Spartan({
  display: "swap",
  subsets: ["latin"],
});

export const LoginForm: FC = () => {
  //! This comment written when clerk elements is still in beta. Please check again when clerk elements is stable and refactor the loading. If there is available component for RSC, use it!.
  //? Behavior of global loading now is when user submit the form, the global loading will be true. Not when the page is loaded.

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <LoginFormSkeleton />;
  }

  return (
    <SignIn.Root>
      <Clerk.Loading>
        {(globalLoading: boolean) => (
          <SignIn.Step name="start">
            <div>
              <Image src={ikramLogo} alt="Ikram Logo" width={64} height={64} />

              <h1
                className={`${leagueSpartan.className} mt-4 text-left text-2xl font-bold tracking-tight dark:text-zinc-50`}
              >
                Login to Dashboard 👋
              </h1>
              <p className="mt-1 text-left text-sm text-muted-foreground dark:text-zinc-400">
                Enter your login credentials to access dashboard.
              </p>

              <Clerk.GlobalError className="mt-3 block text-left text-sm text-red-400" />

              <Clerk.Connection name="github" asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 w-full"
                  disabled={globalLoading}
                >
                  <Clerk.Loading scope="provider:github">
                    {(isLoading: boolean) =>
                      isLoading ? (
                        <IconLoader className="mr-2 h-3 w-3 animate-spin" />
                      ) : (
                        <IconBrandGithub className="mr-2 h-4 w-4" />
                      )
                    }
                  </Clerk.Loading>
                  Sign in with Github
                </Button>
              </Clerk.Connection>
            </div>
          </SignIn.Step>
        )}
      </Clerk.Loading>
    </SignIn.Root>
  );
};
