// components/dashboard/PriorityBadge.tsx
import React from 'react';

type Priority = 'high' | 'urgent' | 'medium';

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityColor = (priority: Priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getPriorityColor(priority)}`}>
      {priority}
    </span>
  );
};