import * as React from "react";
import clsx from "clsx";

type LoaderSize = "small" | "default" | "large";


interface LoadingOverlayProps {
  visible?: boolean;
  message?: string;
  size?: LoaderSize;
  fullscreen?: boolean;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  fullscreen = true,
  className = "",
}) => {
  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={clsx(
        fullscreen ? "fixed inset-0" : "absolute inset-0",
        "z-50 flex items-center justify-center",
        "bg-black/20 backdrop-blur-sm", // dim + blur background
        className
      )}
    >

      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );
};
