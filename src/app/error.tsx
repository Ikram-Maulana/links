"use client";

import { Button } from "@/components/ui/button";
import { UpdateIcon } from "@radix-ui/react-icons";
import { type Metadata } from "next";
import { type FC } from "react";

export const metadata: Metadata = {
  title: "Internal Server Error | Ikram Maulana Links",
};

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const Error: FC<ErrorProps> = ({ error, reset }) => {
  return (
    <div className="container flex h-full w-full flex-col items-center justify-center text-left">
      <div className="w-full max-w-sm">
        <p className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          500
        </p>

        <h1 className="mt-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Internal Server Error
        </h1>
        <p className="mt-4 text-muted-foreground">
          Sorry, we are having some technical difficulties. Please try again
          later.
        </p>
        <code className="relative mb-6 mt-2 block w-fit rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          Digest: {error.digest}
        </code>

        <Button variant="ghost" onClick={() => reset()}>
          <UpdateIcon className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default Error;
