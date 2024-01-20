import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconCircleX } from "@irsyadadl/paranoid";
import { type FC } from "react";
import { errors } from "./data";

interface ErrorMessageProps {
  error: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ error }) => {
  const errorMessage = error
    ? errors.find((e) => e.name.toLowerCase() === error.toLowerCase())?.message
    : errors.find((e) => e.name === "default")?.message;

  return (
    <>
      {errorMessage && (
        <Alert
          className="mt-4 border-red-500 bg-red-500 text-zinc-50 dark:border-red-900 dark:bg-red-900 dark:text-zinc-50"
          variant="destructive"
        >
          <IconCircleX className="h-4 w-4 !text-[#fafafa]" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default ErrorMessage;
