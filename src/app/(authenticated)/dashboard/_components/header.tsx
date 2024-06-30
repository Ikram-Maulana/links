import { cn } from "@/lib/utils";
import { League_Spartan } from "next/font/google";
import * as React from "react";

interface HeaderTextProps {
  title: string;
  subtitle: string;
}

const leagueSpartan = League_Spartan({
  display: "swap",
  subsets: ["latin"],
});

export const Header = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 pb-5 pt-8 md:flex-row md:items-center md:justify-between md:space-y-0 lg:pb-6",
      className,
    )}
    {...props}
  />
));
Header.displayName = "Header";

export const HeaderText: React.FC<HeaderTextProps> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col">
      <h1
        className={`${leagueSpartan.className} scroll-m-20 text-2xl font-semibold tracking-tight`}
      >
        {title}
      </h1>
      <p className="text-sm font-medium leading-6 text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
};
