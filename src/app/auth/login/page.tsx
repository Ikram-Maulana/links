import fieldImage from "@/assets/images/field.jpg";
import ikramLogo from "@/assets/images/ikram-logo.png";
import { StaticImagesBlur } from "@/components/images/static/blur";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/server/auth";
import { IconArrowLeft } from "@irsyadadl/paranoid";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type FC } from "react";
import { ErrorMessage } from "./_components/error-messages";
import { LoginButton } from "./_components/login-button";

interface LoginPageProps {
  searchParams: {
    error: string | null;
  };
}

const page: FC<LoginPageProps> = async ({ searchParams }) => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="lg:mx-auto lg:max-w-screen-2xl lg:px-0">
      <div className="grid grid-cols-2">
        <div className="relative hidden h-full overflow-hidden lg:block">
          <StaticImagesBlur src={fieldImage} alt="Field" />
        </div>

        <div className="col-span-2 flex min-h-screen items-center justify-center lg:col-span-1">
          <div>
            <Image src={ikramLogo} alt="Ikram Logo" width={64} height={64} />

            <h1 className="mt-6 text-2xl font-semibold tracking-tight">
              Login 👋
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your login credentials to access dashboard.
            </p>

            {searchParams.error && <ErrorMessage error={searchParams.error} />}

            <LoginButton />

            <div className="mt-6 flex w-full justify-center">
              <Button variant="ghost" asChild>
                <Link href="/">
                  <IconArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
