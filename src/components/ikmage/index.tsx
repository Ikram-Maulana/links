"use client";

import Image, { type ImageProps } from "next/image";
import { type FC } from "react";
import imagekitLoader from "./loader";

type IkmageProps = ImageProps & {
  src: string;
};

const Ikmage: FC<IkmageProps> = (props) => {
  const { src, alt, ...rest } = props;

  return <Image loader={imagekitLoader} src={src} alt={alt} {...rest} />;
};

export default Ikmage;
