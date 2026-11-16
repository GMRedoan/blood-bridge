import { FieldError } from "react-hook-form";

interface FormErrorProps {
  error?: FieldError;
}

export const FormError = ({ error }: FormErrorProps) => {
  if (!error) return null;

  return <p className="text-xs text-destructive">{error.message}</p>;
};