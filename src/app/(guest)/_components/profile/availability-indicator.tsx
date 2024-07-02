import { Button } from "@/components/ui/button";
import { type FC } from "react";

export const AvailabilityIndicator: FC = () => (
  <Button
    variant="ghost"
    className="pointer-events-none p-0 text-sm font-medium leading-none text-accent-foreground"
    aria-label="Available for Hire"
  >
    <div className="relative mr-2 flex h-2 w-2">
      <div className="absolute h-2 w-2 rounded-full bg-green-500"></div>
      <div className="absolute h-2 w-2 animate-ping rounded-full bg-green-500"></div>
    </div>
    Available for Hire
  </Button>
);
