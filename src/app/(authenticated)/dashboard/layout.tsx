import { Skeleton } from "@/components/ui/skeleton";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";
import { Navbar } from "./_components/navbar";

const Sidebar = dynamic(() => import("./_components/sidebar"), {
  loading: () => (
    <Skeleton className="fixed top-20 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 rounded-none border-r border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 lg:sticky lg:block" />
  ),
});

interface layoutProps {
  children: React.ReactNode;
}

const layout: React.FC<layoutProps> = async ({ children }) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/auth/login");
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="flex-1">
        <div className="container flex-1 items-start md:gap-6 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 lg:pl-0">
          <Sidebar />

          <main className="mb-6 space-y-4 py-6 lg:mb-10 lg:p-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default layout;
