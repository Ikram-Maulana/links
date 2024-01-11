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
