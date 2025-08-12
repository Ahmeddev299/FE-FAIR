// components/dashboard/QuickActions.tsx
import React from 'react';
import Image from "next/image";

interface QuickActionsProps {
  onStartNewLOI: () => void;
  onUploadLease: () => void;
  onTerminateLease: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onStartNewLOI,
  onUploadLease,
  onTerminateLease
}) => {
  return (
    <div className="bg-white rounded-xl shadow lg:p-4 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-5">Quick Actions</h3>
      <div className="space-y-5">
        {/* Start New LOI */}
        <button 
          className="w-full flex items-center justify-start gap-3 bg-[#3B82F6] text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          onClick={onStartNewLOI}
        >
          <Image
            src="/star.png"
            alt="Start New LOI"
            width={30}
            height={24}
            className="w-6 h-4"
          />
          <span>Start New LOI</span>
        </button>

        {/* Upload Lease Document */}
        <button 
          className="w-full flex items-center justify-start gap-3 bg-[#3B82F6] text-white py-2.5 px-4 rounded-lg hover:bg-blue-600 transition text-sm font-medium"
          onClick={onUploadLease}
        >
          <Image
            src="/start-loi-1.png"
            alt="Upload Document"
            width={24}
            height={24}
            className="w-7 h-4"
          />
          <span className="truncate inline-block max-w-[150px]">Upload Lease Document</span>
        </button>

        {/* Terminate Lease */}
        <button 
          className="w-full flex items-center justify-start gap-3 bg-red-500 text-white py-2.5 px-4 rounded-lg hover:bg-red-600 transition text-sm font-medium"
          onClick={onTerminateLease}
        >
          <Image
            src="/start-loi-2.png"
            alt="Terminate Lease"
            width={24}
            height={24}
            className="w-7 h-4"
          />
          <span>Terminate Lease</span>
        </button>
      </div>
    </div>
  );
};