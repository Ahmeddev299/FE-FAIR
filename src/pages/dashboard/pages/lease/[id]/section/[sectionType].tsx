// pages/SectionClausesPage.tsx
import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layouts";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectLease } from "@/redux/slices/leaseSlice";
import { useClauseActions } from "@/hooks/useClauseActions";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import { ClauseReviewPanel } from "@/components/dashboard/lease/viewleaseSection/clauseReviewPanel";
import { CommentsPanel } from "@/components/dashboard/lease/viewleaseSection/commentsPanel";
import { useSectionClauses } from "@/hooks/useSectionClauses";
import { ClausesList } from "@/components/dashboard/lease/viewleaseSection/clauseList";


export default function SectionClausesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentLease } = useAppSelector(selectLease);
  
  // Local state to manage updated clauses
  const [localClauses, setLocalClauses] = useState<Record<string, any>>({});
  
  const { id, section, displayClauses: originalClauses, title } = useSectionClauses(
    router,
    dispatch,
    currentLease
  );

  // Merge original clauses with local updates
  const displayClauses = useMemo(() => {
    return originalClauses.map(clause => {
      const localUpdate = localClauses[clause.id];
      return localUpdate ? { ...clause, ...localUpdate } : clause;
    });
  }, [originalClauses, localClauses]);

  // Handle clause updates
  const handleClauseUpdate = useCallback((updatedClause: any) => {
    setLocalClauses(prev => ({
      ...prev,
      [updatedClause.id]: updatedClause
    }));
  }, []);

  const {
    selectedClause,
    isEditing,
    editedText,
    loading,
    commentText,
    setSelectedClause,
    setIsEditing,
    setEditedText,
    setCommentText,
    handleClauseClick,
    handleAccept,
    handleReject,
    handleSaveEdit,
    handleAddComment,
  } = useClauseActions(currentLease, handleClauseUpdate);

  // Wrapper to handle clause click with updated data
  const onClauseClickWrapper = useCallback((clause: any) => {
    const updatedClause = localClauses[clause.id] || clause;
    handleClauseClick(updatedClause);
  }, [handleClauseClick, localClauses]);

  if (!currentLease) {
    return (
      <DashboardLayout>
        <LoadingOverlay />
      </DashboardLayout>
    );
  }

  const handleBack = () => router.push(`/dashboard/pages/lease/view/${id}`);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Lease
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {displayClauses.length} {displayClauses.length === 1 ? 'clause' : 'clauses'}
            </p>
          </div>

          {/* Clauses List */}
          <ClausesList
            clauses={displayClauses}
            section={section}
            onClauseClick={onClauseClickWrapper}
          />

          {/* Selected Clause Details */}
          {selectedClause && (
            <div className="flex gap-6">
              <ClauseReviewPanel
                clause={selectedClause}
                isEditing={isEditing}
                editedText={editedText}
                loading={loading}
                onEditChange={setEditedText}
                onAccept={handleAccept}
                onReject={handleReject}
                onEdit={() => setIsEditing(true)}
                onSave={handleSaveEdit}
                onCancel={() => {
                  setIsEditing(false);
                  setEditedText(selectedClause.clause_details || selectedClause.current_version || "");
                }}
              />

              <CommentsPanel
                comments={selectedClause.comments || []}
                commentText={commentText}
                loading={loading}
                onCommentChange={setCommentText}
                onAddComment={handleAddComment}
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}