"use client";

import { env } from "@/env";
import { type IKImageProps, type ImageKitProviderProps } from "@/types";
import { IKImage } from "imagekitio-next";
import { type ImageProps } from "next/image";
import { type FC } from "react";

type IkmageProps = Omit<ImageProps, "src" | "loading" | "loader"> &
  IKImageProps &
  ImageKitProviderProps;

const urlEndpoint = env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

const Ikmage: FC<IkmageProps> = (props) => {
  return <IKImage urlEndpoint={urlEndpoint} {...props} />;
};

export default Ikmage;
