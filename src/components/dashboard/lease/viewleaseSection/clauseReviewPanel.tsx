/* eslint-disable @typescript-eslint/no-explicit-any */

// components/ClauseReviewPanel.tsx
import React from "react";
import { ClauseHeader } from "./clauseHeader";
import { ClauseContent } from "./clauseContent";
import { ClauseActions } from "./clauseActions";

interface ClauseReviewPanelProps {
  clause: any;
  isEditing: boolean;
  editedText: string;
  loading: boolean;
  onEditChange: (text: string) => void;
  onAccept: () => void;
  onReject: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ClauseReviewPanel: React.FC<ClauseReviewPanelProps> = ({
  clause,
  isEditing,
  editedText,
  loading,
  onEditChange,
  onAccept,
  onReject,
  onEdit,
  onSave,
  onCancel,
}) => {
  return (
    <div className="flex-1">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ClauseHeader clause={clause} />
        
        <ClauseContent
          clause={clause}
          isEditing={isEditing}
          editedText={editedText}
          onEditChange={onEditChange}
        />

        <ClauseActions
          clause={clause}
          isEditing={isEditing}
          loading={loading}
          onAccept={onAccept}
          onReject={onReject}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};