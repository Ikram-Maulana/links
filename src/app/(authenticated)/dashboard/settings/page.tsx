import { type Metadata } from "next";
import { type FC } from "react";

export const metadata: Metadata = {
  title: "Dashboard Settings | Ikram Maulana Links",
};

const page: FC = () => {
  return (
    <div className="mb-6 flex flex-col">
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Settings
      </h1>
      <p className="text-sm font-medium leading-6 text-gray-500">
        This page is used to manage users settings.
      </p>
    </div>
  );
};

export default page;
