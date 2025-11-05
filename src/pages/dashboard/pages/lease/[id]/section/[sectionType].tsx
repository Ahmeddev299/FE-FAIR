// pages/lease/[id]/section/[sectionType].tsx - FIXED SECTION PAGE
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import { ArrowLeft, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/layouts";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectLease } from "@/redux/slices/leaseSlice";
import { getLeaseDetailsById } from "@/services/lease/asyncThunk";
import {
  approveRejectBulletAsync,
  addBulletCommentAsync,
  changeBulletTextAsync,
} from "@/services/clause/asyncThunk";
import { ClauseCard } from "@/components/dashboard/lease/utils/ClauseCard";

const bulletKeyFromClause = (clause: any) => {
  const section = clause.section || clause.category || "Tenant agrees to";
  const bn = clause.bullet_number || clause.id || "1";
  return { section, bullet_number: String(bn) };
};

export default function SectionClausesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentLease } = useAppSelector(selectLease);
  
  const [selectedClause, setSelectedClause] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState("");

  // Get route params
  const leaseId = router.query.id;
  const sectionType = router.query.sectionType;

  const id = useMemo(() => {
    const raw = leaseId;
    const s = Array.isArray(raw) ? raw[0] : raw || "";
    return s.trim().replace(/[{}]/g, "");
  }, [leaseId]);

  const section = useMemo(() => {
    const raw = sectionType;
    return Array.isArray(raw) ? raw[0] : raw || "";
  }, [sectionType]);

  useEffect(() => {
    if (!router.isReady || !id) return;
    if (currentLease?._id === id || currentLease?.id === id) return;
    dispatch(getLeaseDetailsById(id));
  }, [dispatch, router.isReady, id, currentLease?._id, currentLease?.id]);

  // Parse clauses from API data structure - SAME AS MAIN PAGE
  const clausesData = useMemo(() => {
    if (!currentLease?.clauses?.history) {
      return { tenantAgreesTo: [], tenantNotAgreesTo: [] };
    }

    const history = currentLease.clauses.history;
    
    // Parse "Tenant agrees to"
    const tenantAgreesTo = history["Tenant agrees to"] 
      ? Object.entries(history["Tenant agrees to"]).map(([key, clause]: [string, any]) => ({
          id: key,
          bullet_number: key,
          title: `Tenant agrees to - Clause ${key}`,
          category: "Tenant agrees to",
          section: "Tenant agrees to",
          status: clause.status || "pending",
          ai_confidence_score: Math.round((clause.ai_confidence_score || 0) * 100),
          ai_score: Math.round((clause.ai_confidence_score || 0) * 100),
          risk: clause.risk || "Low",
          risk_level: clause.risk || "Low",
          comments: clause.comment || [],
          clause_details: clause.clause_details || "",
          current_version: clause.current_version || clause.clause_details || "",
          ...clause
        }))
      : [];

    // Parse "Tenant agrees not to"
    const tenantNotAgreesTo = history["Tenant agrees not to"]
      ? Object.entries(history["Tenant agrees not to"]).map(([key, clause]: [string, any]) => ({
          id: key,
          bullet_number: key,
          title: `Tenant agrees not to - Clause ${key}`,
          category: "Tenant agrees not to",
          section: "Tenant agrees not to",
          status: clause.status || "pending",
          ai_confidence_score: Math.round((clause.ai_confidence_score || 0) * 100),
          ai_score: Math.round((clause.ai_confidence_score || 0) * 100),
          risk: clause.risk || "Low",
          risk_level: clause.risk || "Low",
          comments: clause.comment || [],
          clause_details: clause.clause_details || "",
          current_version: clause.current_version || clause.clause_details || "",
          ...clause
        }))
      : [];

    return { tenantAgreesTo, tenantNotAgreesTo };
  }, [currentLease]);

  // Get the right clauses based on section type
  const displayClauses = useMemo(() => {
    console.log("Section type:", section);
    console.log("Clauses data:", clausesData);
    
    if (section === 'agrees') {
      console.log("Showing Tenant Agrees To:", clausesData.tenantAgreesTo.length);
      return clausesData.tenantAgreesTo;
    } else if (section === 'notAgrees') {
      console.log("Showing Tenant Not Agrees To:", clausesData.tenantNotAgreesTo.length);
      return clausesData.tenantNotAgreesTo;
    }
    return [];
  }, [clausesData, section]);

  const title = section === 'agrees' ? 'Tenant Agrees To' : 'Tenant Not Agrees To';

  const handleBack = () => router.push(`/dashboard/pages/lease/view/${id}`);

  const handleClauseClick = (clause: any) => {
    setSelectedClause(clause);
    setEditedText(clause.clause_details || clause.current_version || "");
    setIsEditing(false);
  };

  const handleAccept = async () => {
    if (!selectedClause || !currentLease) return;
    setLoading(true);
    try {
      const { section, bullet_number } = bulletKeyFromClause(selectedClause);
      await dispatch(
        approveRejectBulletAsync({
          leaseId: currentLease.lease_data._id || currentLease.lease_data.id || "",
          section,
          bullet_number,
          action: "approved",
        })
      ).unwrap();
      
      setSelectedClause({ ...selectedClause, status: "approved" });
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
          leaseId: currentLease.lease_data._id || currentLease.lease_data.id || "",
          section,
          bullet_number,
          action: "rejected",
        })
      ).unwrap();
      
      setSelectedClause({ ...selectedClause, status: "rejected" });
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
          leaseId: currentLease.lease_data._id || currentLease.lease_data.id || "",
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
      setSelectedClause(updatedClause);
      setIsEditing(false);
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
          leaseId: currentLease.lease_data._id || currentLease.lease_data.id || "",
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
      setSelectedClause(updatedClause);
      setCommentText("");
    } finally {
      setLoading(false);
    }
  };

  if (!currentLease) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const aiScore = selectedClause?.ai_confidence_score || selectedClause?.ai_score || 0;
  const commentCount = selectedClause?.comments?.length || 0;

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

          {/* Clauses Grid */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Lease Clauses</h2>
            <p className="text-sm text-gray-500 mb-6">{displayClauses.length} clauses</p>

            {displayClauses.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Clauses Found</h3>
                <p className="text-gray-600">This section doesn't have any clauses yet.</p>
                <p className="text-sm text-gray-500 mt-2">Section: {section}</p>
                <p className="text-sm text-gray-500">Available clauses: Agrees={clausesData.tenantAgreesTo.length}, Not Agrees={clausesData.tenantNotAgreesTo.length}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayClauses.map((clause) => (
                  <ClauseCard
                    key={clause.id}
                    clause={clause}
                    onClick={() => handleClauseClick(clause)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Selected Clause Detail Section */}
          {selectedClause && (
            <div className="flex gap-6">
              {/* Main Content */}
              <div className="flex-1">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Clause Review</h2>
                   
                  </div>

                  {/* Clause Details */}
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">
                          {selectedClause.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{selectedClause.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedClause.risk?.toLowerCase() === "high" ? "bg-red-50 text-red-700" :
                          selectedClause.risk?.toLowerCase() === "medium" ? "bg-yellow-50 text-yellow-700" :
                          "bg-green-50 text-green-700"
                        }`}>
                          {selectedClause.risk?.toLowerCase() || "low"}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          AI Score: {aiScore}%
                        </span>
                      </div>
                    </div>

                    {/* Clause Text */}
                    {isEditing ? (
                      <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 min-h-[100px]"
                      />
                    ) : (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedClause.clause_details || selectedClause.current_version}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          disabled={loading}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditedText(selectedClause.clause_details || selectedClause.current_version || "");
                          }}
                          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleAccept}
                          disabled={loading || selectedClause.status === "approved"}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                          {selectedClause.status === "approved" ? "✓ Accepted" : "Accept"}
                        </button>
                        <button
                          onClick={handleReject}
                          disabled={loading}
                          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                        >
                          ✕ Reject
                        </button>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Comments Sidebar */}
              <div className="w-80">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Comments</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {commentCount} comments on this clause
                  </p>

                  {/* Comment List */}
                  <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                    {selectedClause.comments?.map((comment: any, idx: number) => (
                      <div key={idx} className="text-sm">
                        <p className="font-medium text-gray-900">{comment.author}</p>
                        <p className="text-gray-600 mt-1">{comment.text}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment */}
                  <div>
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none"
                      rows={3}
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={loading || !commentText.trim()}
                      className="mt-2 w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Add Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}