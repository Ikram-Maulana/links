import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env";
import { EdgeStoreProvider } from "@/lib/edgestore";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { GeistSans } from "geist/font/sans";

export const metadata = {
  title: "Ikram Maulana Links",
  description:
    "Discover the social media links of Ikram Maulana, a Full Stack Web Developer. Explore my collection of projects and skills in web development.",
  applicationName: "Ikram Maulana Links",
  keywords: [
    "Ikram Maulana",
    "Ikram Maulana Portfolio",
    "Ikram Maulana Website",
    "Ikram Maulana Full Stack Web Developer",
    "Full Stack Web Developer",
    "React Developer",
    "Daunnesia",
    "Founder Daunnesia",
    "Daunnesia Website",
    "Ikram Daunnesia",
  ],
  authors: [
    {
      name: "Ikram Maulana",
      url: env.NEXT_PUBLIC_PORTFOLIO_URL,
    },
  ],
  creator: "Ikram Maulana",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Ikram Maulana Links",
    title: "Ikram Maulana Links",
    description:
      "Discover the social media links of Ikram Maulana, a Full Stack Web Developer. Explore my collection of projects and skills in web development.",
    url: env.NEXT_PUBLIC_BASE_URL,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Ikram Maulana Links",
      },
    ],
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`font-sans ${GeistSans.className} antialiased motion-safe:scroll-smooth`}
    >
      <body className="min-h-screen antialiased">
        <TRPCReactProvider>
          <EdgeStoreProvider>{children}</EdgeStoreProvider>
        </TRPCReactProvider>

        <div className="lg:hidden">
          <Toaster richColors position="bottom-center" duration={5000} />
        </div>
        <div className="hidden lg:flex">
          <Toaster richColors position="top-center" duration={5000} />
        </div>
      </body>
    </html>
  );
}
