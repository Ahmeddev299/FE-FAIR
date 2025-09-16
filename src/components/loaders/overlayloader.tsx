// import React from "react";

// interface LoadingOverlayProps {
//   isVisible?: boolean; // optional, defaults to false if not passed
// }

// // Loading Overlay Component
// export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible = false }) => {
//   if (!isVisible) return null;

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//     </div>
//   );
// };

// components/loaders/overlayloader.tsx
import * as React from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

type LoaderSize = "small" | "default" | "large";

const sizeClasses: Record<LoaderSize, string> = {
  small: "h-5 w-5",
  default: "h-8 w-8",
  large: "h-12 w-12",
};

interface LoadingOverlayProps {
  visible?: boolean;
  message?: string;
  size?: LoaderSize;
  /** If true, makes overlay full-screen instead of parent-bound */
  fullscreen?: boolean;
  className?: string;
}

/**
 * Covers either the nearest `relative` parent, or the whole screen if `fullscreen`.
 * Adds a subtle backdrop blur and centers a spinner + optional message.
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible = false,
  size = "default",
  fullscreen = false,
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
      {/* <div className="flex flex-col bg-white items-center gap-3  px-6 py-5 ring-1 ring-black/5">
        <Loader2 className={clsx("animate-spin text-gray-700", sizeClasses[size])} />
      </div> */}

           <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
     </div>
    </div>
  );
};
