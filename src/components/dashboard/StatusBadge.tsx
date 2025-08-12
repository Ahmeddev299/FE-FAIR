// components/dashboard/StatusBadge.tsx
import React from 'react';

type Status = 'available' | 'pending' | 'active' | 'in review' | 'terminated';

interface StatusBadgeProps {
  status: Status;
  fallback?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, fallback = "Active" }) => {
  const getStatusColor = (status: Status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'in review': return 'bg-purple-100 text-purple-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
      {status || fallback}
    </span>
  );
};