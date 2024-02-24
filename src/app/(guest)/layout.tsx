import { env } from "@/env";
import dynamic from "next/dynamic";
import Script from "next/script";
import { type FC } from "react";
import Footer from "./_components/footer";
import TopbarSkeleton from "./_components/skeleton/topbar-skeleton";

const Topbar = dynamic(() => import("./_components/topbar"), {
  loading: () => <TopbarSkeleton />,
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-rose-100 to-teal-100">
      <Topbar />
      <main className="flex-grow">{children}</main>
      <Footer />

      <Script
        src={env.NEXT_PUBLIC_UMAMI_URL}
        strategy="lazyOnload"
        data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
      />
    </div>
  );
};

export default Layout;
