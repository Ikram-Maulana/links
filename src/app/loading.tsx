import { type FC } from "react";

const Loading: FC = () => {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-current border-t-transparent text-green-600"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </main>
  );
};

export default Loading;
