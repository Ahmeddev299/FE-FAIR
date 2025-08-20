
import React from 'react';

// Loading Overlay Component
export const LoadingOverlay = ({ isVisible, message = "Loading...", size = "default" }) => {
  if (!isVisible) return null;

  return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
  );
};


