import { Loader2 } from "lucide-react";

// Fixed Inline Loader Component
export const InlineLoader = ({ isVisible = true, message = "Loading...", size = "default" }) => {
  if (!isVisible) return null;

  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-5 w-5", 
    large: "h-6 w-6"
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {message && <span className="text-sm">{message}</span>}
    </div>
  );
};