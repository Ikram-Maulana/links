import image404 from "@/assets/images/not-found.png";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@irsyadadl/paranoid";
import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 Page Not Found | Ikram Maulana Links",
};

const page = () => {
  return (
    <div className="container flex min-h-screen w-full max-w-2xl flex-col items-center justify-center text-center">
      <Image src={image404} alt="404" width={500} height={281.25} />

      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Opss! Something Missing
      </h1>
      <p className="mb-6 mt-4 text-lg text-muted-foreground">
        The page you&apos;re looking for isn&apos;t found. We suggest you Back
        to Homepage.
      </p>

      <BackToHomeButton />
    </div>
  );
};

const BackToHomeButton = () => {
  return (
    <Button className="rounded-lg" asChild>
      <Link href="/">
        <IconArrowLeft className="mr-2 h-4 w-4" />
        Back to Homepage
      </Link>
    </Button>
  );
};

export default page;
