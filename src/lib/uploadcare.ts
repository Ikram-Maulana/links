"use server";

import { env } from "@/env";
import {
  deleteFile,
  UploadcareSimpleAuthSchema,
} from "@uploadcare/rest-client";

const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
  publicKey: env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY,
  secretKey: env.UPLOADCARE_SECRET_KEY,
});

export const deleteUploadcareFile = async ({ uuid }: { uuid: string }) => {
  const result = await deleteFile(
    {
      uuid,
    },
    { authSchema: uploadcareSimpleAuthSchema },
  );

  return result;
};
