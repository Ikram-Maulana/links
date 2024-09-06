import { env } from "@/env";
import { type ImageLoaderProps } from "next/image";

const urlEndpoint = env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

const imagekitLoader = ({ src, width, quality }: ImageLoaderProps) => {
  return `${urlEndpoint}/tr:w-${width},q-${quality ?? 80}/${src}`;
};

export default imagekitLoader;
