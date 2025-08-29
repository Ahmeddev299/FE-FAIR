import { Loader2 } from "lucide-react";
import * as React from "react";

type LoaderSize = "small" | "default" | "large";

interface InlineLoaderProps {
  isVisible?: boolean;
  message?: string | null;
  size?: LoaderSize;
  className?: string;
}

// Map is typed with the same union as `size`
const sizeClasses: Record<LoaderSize, string> = {
  small: "h-4 w-4",
  default: "h-5 w-5",
  large: "h-6 w-6",
};

// Fixed Inline Loader Component
export const InlineLoader: React.FC<InlineLoaderProps> = ({
  isVisible = true,
  message = "Loading...",
  size = "default",
  className = "",
}) => {
  if (!isVisible) return null;

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {message ? <span className="text-sm">{message}</span> : null}
    </div>
  );
};
