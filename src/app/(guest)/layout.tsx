import dynamic from "next/dynamic";
import { type FC } from "react";
import Footer from "./_components/footer";
import TopbarSkeleton from "./_components/skeleton/topbar-skeleton";

const Topbar = dynamic(() => import("./_components/topbar"), {
  loading: () => <TopbarSkeleton />,
  ssr: false,
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Topbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
