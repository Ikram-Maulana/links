import dynamic from "next/dynamic";
import { type FC } from "react";
import Footer from "./_components/footer";
import TopbarSkeleton from "./_components/skeleton/topbar-skeleton";
import Script from "next/script";

const Topbar = dynamic(() => import("./_components/topbar"), {
  loading: () => <TopbarSkeleton />,
  ssr: false,
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-rose-100 to-teal-100">
      <Topbar />
      <main className="flex-grow">{children}</main>
      <Footer />

      <Script
        src="https://analytics.ikrammaulana.my.id/script.js"
        strategy="lazyOnload"
        data-website-id="c27f1d9d-4f96-4854-8ac9-a2f9bd9b043c"
      />
    </div>
  );
};

export default Layout;
