import { cn } from "@/lib/utils";
import * as React from "react";

export const ContentWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mx-auto max-w-5xl px-6", className)}
    {...props}
  />
));
ContentWrapper.displayName = "ContentWrapper";
