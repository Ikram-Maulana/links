import { type Metadata } from "next";
import { type FC } from "react";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard Links | Ikram Maulana Links",
};

const page: FC = async () => {
  const publicMetadata = await api.publicMetadata.available.query();

  if (!publicMetadata || "error" in publicMetadata) {
    return redirect("/dashboard/settings");
  }

  return (
    <div className="mb-6 flex flex-col">
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Links
      </h1>
      <p className="text-sm font-medium leading-6 text-gray-500">
        This page is used to manage links.
      </p>
    </div>
  );
};

export default page;
