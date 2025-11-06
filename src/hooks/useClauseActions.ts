// hooks/useClauseActions.ts
import { useState, useCallback } from "react";
import { useAppDispatch } from "@/hooks/hooks";
import {
  approveRejectBulletAsync,
  addBulletCommentAsync,
  changeBulletTextAsync,
} from "@/services/clause/asyncThunk";
import { bulletKeyFromClause, getLeaseId } from "@/components/dashboard/lease/utils/viewleaseSectionHelpers/clauseHelpers";

export const useClauseActions = (currentLease: any, onClauseUpdate?: (updatedClause: any) => void) => {
  const dispatch = useAppDispatch();
  const [selectedClause, setSelectedClause] = useState<any>(null);
  console.log("selectedClause", selectedClause)
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState("");

  const updateClauseState = useCallback((updatedClause: any) => {
    setSelectedClause(updatedClause);
    if (onClauseUpdate) {
      onClauseUpdate(updatedClause);
    }
  }, [onClauseUpdate]);

  const handleClauseClick = useCallback((clause: any) => {
    setSelectedClause(clause);
    setEditedText(clause.clause_details || clause.current_version || "");
    setIsEditing(false);
  }, []);

  const handleAccept = async () => {
    if (!selectedClause || !currentLease) return;
    setLoading(true);

    try {
      const { section, bullet_number } = bulletKeyFromClause(selectedClause);
      await dispatch(
        approveRejectBulletAsync({
          leaseId: getLeaseId(currentLease),
          section,
          bullet_number,
          action: "approved",
        })
      ).unwrap();

      const updatedClause = { ...selectedClause, status: "approved" };
      updateClauseState(updatedClause);
    } catch (error) {
      console.error("Failed to approve clause:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedClause || !currentLease) return;
    setLoading(true);
    
    try {
      const { section, bullet_number } = bulletKeyFromClause(selectedClause);
      await dispatch(
        approveRejectBulletAsync({
          leaseId: getLeaseId(currentLease),
          section,
          bullet_number,
          action: "rejected",
        })
      ).unwrap();

      const updatedClause = { ...selectedClause, status: "rejected" };
      updateClauseState(updatedClause);
    } catch (error) {
      console.error("Failed to reject clause:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedClause || !currentLease) return;
    setLoading(true);
    
    try {
      const { section, bullet_number } = bulletKeyFromClause(selectedClause);
      await dispatch(
        changeBulletTextAsync({
          leaseId: getLeaseId(currentLease),
          section,
          bullet_number,
          text: editedText,
        })
      ).unwrap();

      const updatedClause = {
        ...selectedClause,
        clause_details: editedText,
        current_version: editedText
      };
      updateClauseState(updatedClause);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save edit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!selectedClause || !currentLease || !commentText.trim()) return;
    setLoading(true);
    
    try {
      const { section, bullet_number } = bulletKeyFromClause(selectedClause);
      await dispatch(
        addBulletCommentAsync({
          leaseId: getLeaseId(currentLease),
          section,
          bullet_number,
          text: commentText,
        })
      ).unwrap();

      const newComment = {
        text: commentText,
        author: "You",
        created_at: new Date().toISOString(),
      };
      
      const updatedClause = {
        ...selectedClause,
        comments: [...(selectedClause.comments || []), newComment]
      };
      
      updateClauseState(updatedClause);
      setCommentText("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};