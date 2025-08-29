// components/dashboard/StatusBadge.tsx
import React from 'react';

interface StatusBadgeProps {
  /** Any status label, e.g. "Approved", "pending", "In Review", "Suggested" */
  status?: string;
  fallback?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, fallback = 'Active' }) => {
  const key = (status ?? fallback).toLowerCase().trim();

  const getStatusColor = (k: string) => {
    switch (k) {
      // original ones
      case 'available': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'in review': return 'bg-purple-100 text-purple-800';
      case 'terminated': return 'bg-red-100 text-red-800';

      // clause-specific
      case 'approved': return 'bg-green-100 text-green-800';
      case 'review':
      case 'needs review': return 'bg-purple-100 text-purple-800';
      case 'edited': return 'bg-amber-100 text-amber-800';
      case 'suggested':
      case 'ai suggested': return 'bg-blue-100 text-blue-800';

      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(key)}`}>
      {status || fallback}
    </span>
  );
};
