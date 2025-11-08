/* eslint-disable @typescript-eslint/no-explicit-any */

// components/ClauseContent.tsx
import React from "react";

interface ClauseContentProps {
  clause: any;
  isEditing: boolean;
  editedText: string;
  onEditChange: (text: string) => void;
}

export const ClauseContent: React.FC<ClauseContentProps> = ({
  clause,
  isEditing,
  editedText,
  onEditChange,
}) => {
  return (
    <div className="mb-6">
      {isEditing ? (
        <textarea
          value={editedText}
          onChange={(e) => onEditChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 min-h-[100px]"
        />
      ) : (
        <p className="text-sm text-gray-700 leading-relaxed">
          {clause.clause_details || clause.current_version}
        </p>
      )}
    </div>
  );
};