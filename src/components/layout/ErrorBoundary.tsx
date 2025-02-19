
import { Link } from "react-router-dom";
import { HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  error?: Error;
}

const ErrorBoundary = ({ error }: ErrorBoundaryProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Oops!</h1>
          <p className="text-muted-foreground">
            {error?.message || "The page you're looking for doesn't exist."}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/" className="flex items-center gap-2">
            <HomeIcon className="w-4 h-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ErrorBoundary;
