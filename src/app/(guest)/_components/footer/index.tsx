import Link from "next/link";
import { type FC } from "react";

export const Footer: FC = () => {
  return (
    <footer className="container py-10">
      <div className="mx-auto max-w-[680px] text-center">
        <p className="text-sm font-medium leading-5">
          &copy; Ikram Maulana {new Date().getFullYear()} •{" "}
          <Link
            className="hover:text-blue-500"
            href="/s/analytics-links"
            target="_blank"
            rel="noopener noreferrer"
            prefetch={false}
          >
            Analytics
          </Link>
        </p>
      </div>
    </footer>
  );
};
