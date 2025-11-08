/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/SectionClausesPage.tsx
import React, { useState, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import {  ChevronLeft, DownloadIcon } from "lucide-react";
import axios from "axios";
import { DashboardLayout } from "@/components/layouts";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectLease } from "@/redux/slices/leaseSlice";
import { useClauseActions } from "@/hooks/useClauseActions";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import { ClauseReviewPanel } from "@/components/dashboard/lease/viewleaseSection/clauseReviewPanel";
import { CommentsPanel } from "@/components/dashboard/lease/viewleaseSection/commentsPanel";
import { useSectionClauses } from "@/hooks/useSectionClauses";
import { ClausesList } from "@/components/dashboard/lease/viewleaseSection/clauseList";
import Config from "@/config/index";
import ls from "localstorage-slim";
import Toast from "@/components/Toast";

export default function SectionClausesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentLease } = useAppSelector(selectLease);

  const [localClauses, setLocalClauses] = useState<Record<string, any>>({});
  const [isSubmittingLoi, setIsSubmittingLoi] = useState(false);
  const [isDownloadingLoi, setIsDownloadingLoi] = useState(false);

  const submittingLoi = useRef(false);
  const downloadingRef = useRef(false);
  const isMountedRef = useRef(true);

  const { id, section, displayClauses: originalClauses } = useSectionClauses(
    router,
    dispatch,
    currentLease
  );

  const displayClauses = useMemo(() => {
    return originalClauses.map(clause => {
      const localUpdate = localClauses[clause.id];
      return localUpdate ? { ...clause, ...localUpdate } : clause;
    });
  }, [originalClauses, localClauses]);

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
    setIsEditing,
    setEditedText,
    setCommentText,
    handleClauseClick,
    handleAccept,
    handleReject,
    handleSaveEdit,
    handleAddComment,
  } = useClauseActions(currentLease, handleClauseUpdate);

  const onClauseClickWrapper = useCallback((clause: any) => {
    const updatedClause = localClauses[clause.id] || clause;
    handleClauseClick(updatedClause);
  }, [handleClauseClick, localClauses]);


  const handleSubmitLOI = async () => {
    if (submittingLoi.current) return;
    submittingLoi.current = true;
    setIsSubmittingLoi(true);

    try {
      const token = ls.get("access_token", { decrypt: true });
      if (!token) throw new Error("Authentication token not found");

      const resp = await axios.put(
        `${Config.API_ENDPOINT}/leases/submit_clauses`,
        { lease_id: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      const maybe = resp as { data?: { success?: boolean; message?: string } };
      if (maybe?.data?.success === false) {
        throw new Error(maybe.data.message || "Failed to submit LOI");
      }

      const msg = maybe?.data?.message || "LOI submitted successfully";
      Toast.fire({ icon: "success", title: msg });

    } catch (err: unknown) {
      console.error("Submit LOI error:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to submit LOI";
      Toast.fire({ icon: "error", title: errorMsg });
    } finally {
      submittingLoi.current = false;
      setIsSubmittingLoi(false);
    }
  };

  const handleDownload = async () => {
    if (downloadingRef.current) return;
    downloadingRef.current = true;
    setIsDownloadingLoi(true);

    try {
      const token = ls.get("access_token", { decrypt: true });
      if (!token) throw new Error("Authentication token not found");

      const resp = await axios.post(
        `${Config.API_ENDPOINT}/leases/download`,
        { doc_id: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      const maybe = resp as {
        data?: {
          success?: boolean;
          message?: string;
          data?: {
            link?: {
              pdf_url?: string
            }
          }
        }
      };

      if (maybe?.data?.success === false) {
        throw new Error(maybe.data.message || "Failed to download LOI");
      }

      const msg = maybe?.data?.message || "Lease downloaded successfully";

      Toast.fire({ icon: "success", title: msg });

      const pdfUrl = maybe?.data?.data?.link?.pdf_url;

      if (!pdfUrl) {
        throw new Error("PDF URL not found in response");
      }

      const link = document.createElement('a');
      link.href = pdfUrl;
      link.target = '_blank';
      link.download = `LOI_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to download LOI";
      Toast.fire({ icon: "error", title: errorMsg });
    } finally {
      downloadingRef.current = false;
      setIsDownloadingLoi(false);
    }
  };

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  if (!currentLease) {
    return (
      <DashboardLayout>
        <LoadingOverlay />
      </DashboardLayout>
    );
  }

  // const handleBack = () => router.push(`/dashboard/pages/lease/view/${id}`);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">

        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border-b border-gray-200">

            <div className="px-6 h-20 pb-1 flex items-center gap-3">
              <button
                onClick={() => {
                  router.push("/landlordDashboard/pages/mainpage");
                }}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Dashboard
              </button>

              <span className="h-10 w-px bg-gray-200" />

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloadingLoi || downloadingRef.current}
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-50 text-sm"
                >
                  Download
                  <DownloadIcon className="w-4 h-4" />
                  {isDownloadingLoi && (<LoadingOverlay visible />)}
                </button>

                <button
                  onClick={handleSubmitLOI}
                  disabled={isSubmittingLoi || submittingLoi.current}
                  className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700"
                >
                  Finalize Lease
                  {isSubmittingLoi && (<LoadingOverlay visible fullscreen />)}

                </button>
              </div>
            </div>

          </div>

          <ClausesList
            clauses={displayClauses}
            section={section}
            onClauseClick={onClauseClickWrapper}
          />

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

      {/* Loading overlays */}
      {isDownloadingLoi && <LoadingOverlay visible />}
      {isSubmittingLoi && <LoadingOverlay visible fullscreen />}
    </DashboardLayout>
  );
}