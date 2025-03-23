import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle } from "lucide-react";

function ErrorAlert({ message }) {
  if (!message) return null;

  return (
    <Alert variant="destructive" className="mb-4 border-red-900 bg-red-950">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export default ErrorAlert;
