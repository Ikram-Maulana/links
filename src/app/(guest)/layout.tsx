import { type FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar Here */}
      <main className="flex-grow">{children}</main>
      {/* Footer Here */}
    </div>
  );
};

export default Layout;
