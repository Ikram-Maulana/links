"use client";

import UploadcareImage from "@uploadcare/nextjs-loader";
import { type ImageProps } from "next/image";
import { type FC } from "react";

type UcareImageProps = ImageProps;

const UcareImage: FC<UcareImageProps> = (props) => {
  return <UploadcareImage {...props} />;
};

export default UcareImage;
