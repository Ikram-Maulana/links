import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconTriangleInfo } from "@irsyadadl/paranoid";
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
        <Alert variant="destructive" className="mt-4">
          <IconTriangleInfo className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default ErrorMessage;
