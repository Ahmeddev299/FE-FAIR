// components/dashboard/ViewButton.tsx
import React from 'react';
import { Eye } from 'lucide-react';

interface ViewButtonProps {
  onClick?: () => void;
}

export const ViewButton: React.FC<ViewButtonProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
    >
      <Eye className="w-4 h-4" />
      <span>View</span>
    </button>
  );
};