import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@irsyadadl/paranoid";
import Link from "next/link";
import { type FC } from "react";

export const BackToHomeButton: FC = ({}) => {
  return (
    <Button variant="ghost" asChild>
      <Link href="/">
        <IconArrowLeft className="mr-2 h-4 w-4" />
        Back to Homepage
      </Link>
    </Button>
  );
};
