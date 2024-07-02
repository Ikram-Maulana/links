import { Sidebar } from "./_components/sidebar";
import { Topbar } from "./_components/topbar";

interface LayoutProps {
  children: React.ReactNode;
}

export const runtime = "edge";

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-full">
      <nav>
        <Sidebar />
      </nav>

      <div className="w-full">
        <Topbar />

        <main className="h-[calc(100vh-60px)] overflow-auto pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
