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
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
    />
  );
};

export default StaticImagesBlur;
