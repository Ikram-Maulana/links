"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconBrandGithub } from "@irsyadadl/paranoid";
import { ReloadIcon } from "@radix-ui/react-icons";
import { signIn } from "next-auth/react";
import { useState, type FC } from "react";

interface LoginButtonProps {
  className?: string;
}

export const LoginButton: FC<LoginButtonProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGithub = async () => {
    try {
      setIsLoading(true);
      await signIn("github", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        disabled={isLoading}
        variant="outline"
        className={cn("mt-4 w-full", className)}
        onClick={loginWithGithub}
      >
        {isLoading ? (
          <ReloadIcon className="mr-2 h-3 w-3 animate-spin" />
        ) : (
          <IconBrandGithub className="mr-2 h-4 w-4" />
        )}
        Sign in with Github
      </Button>
    </>
  );
};
