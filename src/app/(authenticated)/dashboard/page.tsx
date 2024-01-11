import { authOptions } from "@/server/auth";
import { type Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { type FC } from "react";

export const metadata: Metadata = {
  title: "Dashboard | Ikram Maulana Links",
};

const page: FC = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  return <div>Dashboard</div>;
};

export default page;
