// components/modals/DeleteLoiModal.tsx
import React from "react";

interface DeleteLoiModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

export const DeleteLoiModal: React.FC<DeleteLoiModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Delete this LOI?",
  message = "This action cannot be undone."
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
        {/* Header icon */}
        <div className="flex items-center justify-center pt-6 pb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none">
              <path d="M6 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M9 7v-.5a2.5 2.5 0 0 1 2.5-2.5h1A2.5 2.5 0 0 1 15 6.5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7 7l1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{title}</h3>
          <p className="text-sm text-gray-600 text-center mb-6">{message}</p>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onConfirm}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Delete
            </button>
            <button
              onClick={onCancel}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
