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
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Invalid URL: ${err.message}`);
    }
    return false;
  }
};
