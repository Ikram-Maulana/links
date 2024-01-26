/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { cn } from "@/lib/utils";
import Image from "next/image";
import { getPlaiceholder } from "plaiceholder";
import React from "react";

export interface DynamicImageBlurProps
  extends React.ComponentPropsWithoutRef<typeof Image> {
  src: string;
  alt: string;
}

const DynamicImagesBlur = React.forwardRef<
  HTMLImageElement,
  DynamicImageBlurProps
>(async ({ src, alt, className, ...props }, ref) => {
  const response = await fetch(src);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const { base64 } = await getPlaiceholder(buffer);

  return (
    <Image
      src={src}
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
      blurDataURL={base64}
      {...props}
      ref={ref}
    />
  );
});

DynamicImagesBlur.displayName = "DynamicImagesBlur";
export default DynamicImagesBlur;
