import { cn } from "@/lib/utils";
import Image, { type StaticImageData } from "next/image";
import React from "react";

export interface StaticImageBlurProps
  extends React.ComponentPropsWithoutRef<typeof Image> {
  src: StaticImageData;
  alt: string;
}

export const StaticImagesBlur = React.forwardRef<
  HTMLImageElement,
  StaticImageBlurProps
>(({ src, alt, className, ...props }, ref) => (
  <Image
    src={src}
    alt={alt}
    className={cn("h-full w-full object-cover", className)}
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    placeholder="blur"
    {...props}
    ref={ref}
  />
));

StaticImagesBlur.displayName = "StaticImagesBlur";
