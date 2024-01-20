import { env } from "@/env";
import { clsx, type ClassValue } from "clsx";
import { cloneElement, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const applyIconClassNames = (icon: ReactNode, classNames = "") => {
  return cloneElement(icon as React.ReactElement, {
    className: `${classNames}`,
  });
};

export const getBaseUrl = () => {
  const IS_SERVER = typeof window === "undefined";
  let urlArr: string[] = [];

  if (!IS_SERVER) {
    const url = window.location.href;
    urlArr = url.split("/");
  }

  const baseUrl = IS_SERVER
    ? env.NEXT_PUBLIC_BASE_URL
    : `${urlArr[0]}//${urlArr[2]}`;
  return baseUrl;
};
