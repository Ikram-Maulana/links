import "@/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";

import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";
import { type Metadata } from "next";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "Ikram Maulana Links",
  description:
    "Discover the social media links of Ikram Maulana, a Full Stack Web Developer. Explore my collection of projects and skills in web development.",
  applicationName: "Ikram Maulana Links",
  keywords: [
    "Ikram Maulana",
    "Ikram Maulana Portfolio",
    "Ikram Maulana Links",
    "Ikram Maulana Website",
    "Ikram Maulana Full Stack Web Developer",
    "Ikram Maulana Social Media",
    "Ikram Maulana Social Media Links",
    "Ikram Links",
    "Portfolio",
    "Web Developer",
    "Fullstack Developer",
    "Fullstack Web Developer",
    "React Developer",
    "Founder Daunnesia",
    "Ikram UMMI",
    "Daunnesia",
    "Daunnesia Agensi",
    "Daunnesia Agency",
    "Agency",
    "Agensi",
    "Universitas Muhammadiyah Sukabumi",
    "Universitas Muhammadiyah Sukabumi Informatics Engineering",
    "Universitas Muhammadiyah Sukabumi Teknik Informatika",
    "UMMI",
    "UMMI Sukabumi",
    "UMMI Informatics Engineering",
    "UMMI Teknik Informatika",
    "Informatics Engineering",
    "Teknik Informatika",
  ],
  authors: [
    {
      name: "Ikram Maulana",
      url: "https://ikrammaulana.my.id",
    },
  ],
  creator: "Ikram Maulana",
  metadataBase: new URL("https://links.ikrammaulana.my.id"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ikram Maulana Links",
    title: "Ikram Maulana Links",
    description:
      "Discover the social media links of Ikram Maulana, a Full Stack Web Developer. Explore my collection of projects and skills in web development.",
    url: "https://links.ikrammaulana.my.id",
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
    <ClerkProvider>
      <html
        className={`${GeistSans.className} antialiased motion-safe:scroll-smooth`}
        lang="en"
        suppressHydrationWarning
      >
        <body className="antialiased">
          <NextTopLoader color="#16a34a" height={4} showSpinner={false} />

          <TRPCReactProvider>{children}</TRPCReactProvider>

          <div className="lg:hidden">
            <Toaster richColors position="bottom-center" duration={5000} />
          </div>
          <div className="hidden lg:flex">
            <Toaster richColors position="top-center" duration={5000} />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
