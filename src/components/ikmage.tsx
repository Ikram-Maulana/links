"use client";

import { env } from "@/env";
import Image, { type ImageProps } from "next/image";
import { type FC } from "react";

type IkmageProps = ImageProps & {
  src: string;
};

const urlEndpoint = env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

const Ikmage: FC<IkmageProps> = (props) => {
  const { alt, width, height, src, ...rest } = props;
  const imageUrl = `${urlEndpoint}/tr:w-${width},h-${height}/${src}`;

  return <Image src={imageUrl} alt={alt} {...rest} unoptimized />;
};

export default Ikmage;
