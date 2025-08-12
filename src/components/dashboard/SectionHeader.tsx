import React from 'react';
import { ChevronRight, Plus } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  count?: number;
  onViewAll?: () => void;
  onAdd?: () => void;
  addLabel?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  count, 
  onViewAll, 
  onAdd, 
  addLabel 
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {count !== undefined && (
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
            {count}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {onAdd && addLabel && (
          <button
            onClick={onAdd}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            <Plus className="w-3 h-3 mr-1" />
            {addLabel}
          </button>
        )}
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700"
          >
            View All
            <ChevronRight className="w-3 h-3 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};