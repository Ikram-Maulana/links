/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Image from "next/image";
import { getPlaiceholder } from "plaiceholder";
import { type FC } from "react";

interface DynamicImagesBlurProps {
  src: string;
  alt: string;
}

const DynamicImagesBlur: FC<DynamicImagesBlurProps> = async ({ src, alt }) => {
  const buffer = await fetch(src).then(async (res) => {
    return Buffer.from(await res.arrayBuffer());
  });
  const { base64 } = await getPlaiceholder(buffer);

  return (
    <Image
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
      blurDataURL={base64}
    />
  );
};

export default DynamicImagesBlur;
