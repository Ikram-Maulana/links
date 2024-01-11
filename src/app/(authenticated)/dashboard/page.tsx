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

  return (
    <div className="mb-6 flex flex-col">
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Dashboard
      </h1>
      <p className="text-sm font-medium leading-6 text-gray-500">
        Welcome back, {session?.user.name}!
      </p>
    </div>
  );
};

export default page;
