"use server";

import { redirect } from "next/navigation";

export const redirectTo = (path: string) => {
  redirect(path);
};
