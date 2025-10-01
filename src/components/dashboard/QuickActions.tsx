// components/dashboard/QuickActions.tsx
import React from 'react';
import DocImage from '@/icons/margin.svg'
import UploadImage from '@/icons/upload.svg'
import TermImage from '@/icons/teminate.svg'

interface QuickActionsProps {
  onStartNewLOI: () => void;
  onUploadLease: () => void;
  onTerminateLease: () => void;
  uploadLOI: () => void
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onStartNewLOI,
  onUploadLease,
  uploadLOI,
  onTerminateLease
}) => {
  return (
    <div className="bg-white rounded-xl shadow lg:p-4 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-5">Quick Actions</h3>
      <div className="space-y-5">
        {/* Start New LOI */}
        <button
          className="w-full flex items-center justify-start gap-2 bg-[#3B82F6] text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          onClick={onStartNewLOI}
        >
          <DocImage
            className="w-6 h-4"
          />
          <span className='truncate inline-block text-xs max-w-[150px]'>Start New LOI</span>
        </button>

        {/* Upload LOI */}
        <button
          className="w-full flex items-center justify-start gap-2 bg-[#3B82F6] text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          onClick={uploadLOI}
        >
          <UploadImage
            className="w-6 h-4"
          />
          <span className='truncate inline-block text-xs max-w-[150px]'>Upload LOI</span>
        </button>

        {/* Upload Lease Document */}
        <button
          className="w-full flex items-center justify-start gap-2 bg-[#3B82F6] text-white py-2.5 px-4 rounded-lg hover:bg-blue-600 transition text-sm font-medium"
          onClick={onUploadLease}
        >
          <UploadImage
            className="w-7 h-4"
          />
          <span className="truncate inline-block text-xs max-w-[150px]">Upload Lease Document</span>
        </button>

        {/* Terminate Lease */}
        <button
          className="w-full flex items-center justify-start gap-2 bg-red-500 text-white py-2.5 px-4 rounded-lg hover:bg-red-600 transition text-sm font-medium"
          onClick={onTerminateLease}
        >
          <TermImage
            className="w-7 h-4"
          />
          <span className='truncate inline-block text-xs max-w-[150px]'>Terminate Lease</span>
        </button>

      </div>
    </div>
  );
};