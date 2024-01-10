import Image, { type StaticImageData } from "next/image";
import { type FC } from "react";

interface StaticImagesBlurProps {
  src: StaticImageData;
  alt: string;
}

const StaticImagesBlur: FC<StaticImagesBlurProps> = ({ src, alt }) => {
  return (
    <Image
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      fill
      placeholder="blur"
    />
  );
};

export default StaticImagesBlur;
