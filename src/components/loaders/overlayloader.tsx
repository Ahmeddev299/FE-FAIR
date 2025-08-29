import React from "react";

interface LoadingOverlayProps {
  isVisible?: boolean; // optional, defaults to false if not passed
}

// Loading Overlay Component
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible = false }) => {
  if (!isVisible) return null;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};
