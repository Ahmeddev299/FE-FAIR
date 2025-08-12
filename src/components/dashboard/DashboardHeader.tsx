// components/dashboard/DashboardHeader.tsx
import React from 'react';

interface DashboardHeaderProps {
  userName?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName = "John" }) => {
  return (
    <header className="mx-auto bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 p-4">
      <div className="flex items-center justify-between h-16 sm:h-20">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back, {userName}!</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Here is what is happening with your leases and LOIs today.
          </p>
        </div>
      </div>
    </header>
  );
};