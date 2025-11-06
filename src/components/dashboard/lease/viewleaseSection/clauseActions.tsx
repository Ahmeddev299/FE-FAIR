// components/ClauseActions.tsx
import React from "react";
import { FileText } from "lucide-react";

interface ClauseActionsProps {
  clause: any;
  isEditing: boolean;
  loading: boolean;
  onAccept: () => void;
  onReject: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ClauseActions: React.FC<ClauseActionsProps> = ({
  clause,
  isEditing,
  loading,
  onAccept,
  onReject,
  onEdit,
  onSave,
  onCancel,
}) => {
  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <>
          <button
            onClick={onSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onAccept}
            disabled={loading || clause.status === "approved"}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {clause.status === "approved" ? "✓ Accepted" : "Accept"}
          </button>
          <button
            onClick={onReject}
            disabled={loading}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
          >
            ✕ Reject
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Edit
          </button>
        </>
      )}
    </div>
  );
};