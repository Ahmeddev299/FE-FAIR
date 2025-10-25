// components/dashboard/DashboardHeader.tsx
import React from 'react';

interface DashboardHeaderProps {
  userName?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  return (
    <header className="h-[100px] mx-auto bg-white rounded-lg border-1 px- border-[#E5E7EB] sm:px-6 lg:px-8 p-4">
      <div className="flex items-center justify-between h-16 sm:h-20">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back, {userName}!</h1>
          <p className="text-[16px] sm:text-base text-[#4B5563] mt-1">
            Here is what is happening with your leases and LOIs today.
          </p>
        </div>
      </div>
    </header> 
  );
};