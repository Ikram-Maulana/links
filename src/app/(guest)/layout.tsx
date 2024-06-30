import { type FC } from "react";
import { Footer } from "./_components/footer";
import { TopGradient } from "./_components/top-gradient";
import Topbar from "./_components/topbar";

interface LayoutProps {
  children: React.ReactNode;
}

export const runtime = "edge";

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <TopGradient />

      <div className="flex h-full w-full flex-col items-center">
        <Topbar />
        <main className="relative w-full flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
