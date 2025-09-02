// src/pages/dashboard/pages/lease/view/[id].tsx
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layouts";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectLease } from "@/redux/slices/leaseSlice";
import { getLeaseDetailsById } from "@/services/lease/asyncThunk";
import { ArrowLeft, Check, Wand2, Edit3, MessageSquare, AlertTriangle } from "lucide-react";
import Image from "next/image";
import ClauseDetailsModel from "@/components/models/clauseDetailsModel";
import { Clause, ClauseStatus, ExtendedClause } from "@/types/loi";

/* -------------------- types -------------------- */
type FileType = "pdf" | "image" | "other";

interface LeaseDoc {
  url?: string;
}

interface ClauseComment {
  text: string;
  resolved?: boolean;
}

interface ClauseRaw {
  clause_details?: string;
  status?: string;
  risk?: string;
  ai_confidence_score?: number;
  ai_suggested_clause_details?: string;
  comment?: ClauseComment[];
  current_version?: string;
  updated_at?: string | number | Date;
  // allow unknown extras without using `any`
  [key: string]: unknown;
}

type ClauseMap = Record<string, ClauseRaw>;

interface Lease {
  _id?: string;
  id?: string;
  lease_title?: string;
  title?: string;
  property_address?: string;
  propertyAddress?: string;
  last_updated_date?: string | number | Date;
  updatedAt?: string | number | Date;
  url?: string;
  document_url?: string;
  documents?: LeaseDoc[];
  startDate?: string | number | Date;
  endDate?: string | number | Date;
  status?: string;
  clauses?: ClauseMap | ClauseRaw[];
}

interface ClauseItem extends ClauseRaw {
  id?: string;                // <-- optional; many APIs DO give per-clause ids
  title: string;
}

/* -------------------- helpers -------------------- */
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

const buildUrl = (u?: string): string => {
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `${API_BASE}${u.startsWith("/") ? "" : "/"}${u}`;
};

const getFileType = (u?: string): FileType => {
  if (!u) return "other";
  const ext = u.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext || "")) return "image";
  return "other";
};

const cleanId = (raw?: string | string[]): string => {
  const s = Array.isArray(raw) ? raw[0] : raw || "";
  return s.trim().replace(/[{}]/g, "");
};

/* ---------- Pills ---------- */
const BasePill: React.FC<{ className: string; children: React.ReactNode }> = ({ className, children }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${className}`}>
    {children}
  </span>
);

const StatusChip: React.FC<{ value?: string }> = ({ value }) => {
  const s = (value || "").toLowerCase();
  if (s === "approved")
    return <BasePill className="bg-green-50 text-green-700 ring-1 ring-green-200"><Check className="w-3.5 h-3.5" /> Approved</BasePill>;
  if (s === "edited")
    return <BasePill className="bg-purple-50 text-purple-700 ring-1 ring-purple-200"><Edit3 className="w-3.5 h-3.5" /> Edited</BasePill>;
  if (s === "ai suggested" || s === "ai_suggested")
    return <BasePill className="bg-blue-50 text-blue-700 ring-1 ring-blue-200"><Wand2 className="w-3.5 h-3.5" /> AI Suggested</BasePill>;
  if (s === "needs review")
    return <BasePill className="bg-amber-50 text-amber-700 ring-1 ring-amber-200"><AlertTriangle className="w-3.5 h-3.5" /> Needs Review</BasePill>;
  if (s === "rejected")
    return <BasePill className="bg-rose-50 text-rose-700 ring-1 ring-rose-200">Rejected</BasePill>;
  if (s === "active")
    return <BasePill className="bg-sky-50 text-sky-700 ring-1 ring-sky-200">Active</BasePill>;
  return <BasePill className="bg-gray-100 text-gray-700 ring-1 ring-gray-200">Pending</BasePill>;
};

const RiskChip: React.FC<{ risk?: string }> = ({ risk }) => {
  if (!risk) return null;
  const text = risk;
  const med = /medium|5\/10|6\/10/i.test(text);
  const high = /high|8\/10|9\/10|10\/10/i.test(text);
  return (
    <BasePill
      className={
        high
          ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
          : med
            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
            : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
      }
    >
      {text}
    </BasePill>
  );
};

const ConfidenceChip: React.FC<{ score?: number }> = ({ score }) => {
  if (typeof score !== "number" || Number.isNaN(score)) return null;
  return (
    <BasePill className="bg-slate-50 text-slate-700 ring-1 ring-slate-200">
      {(score * 100).toFixed(0)}% conf.
    </BasePill>
  );
};

const CommentCountChip: React.FC<{ count?: number }> = ({ count = 0 }) => {
  if (count <= 0) return <BasePill className="bg-slate-50 text-slate-600 ring-1 ring-slate-200">No comments</BasePill>;
  return <BasePill className="bg-rose-50 text-rose-700 ring-1 ring-rose-200">{count} unresolved</BasePill>;
};

/* ---------- Document viewer ---------- */
const DocumentViewer: React.FC<{ url?: string; height?: number }> = ({ url, height = 600 }) => {
  const full = buildUrl(url);
  if (!full) return null;
  const kind = getFileType(full);

  if (kind === "pdf") {
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <a href={full} target="_blank" rel="noreferrer" className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
            View PDF
          </a>
          <a href={full} download className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
            Download
          </a>
        </div>
        <div className="mt-2 border rounded-lg overflow-hidden">
          <iframe src={full} className="w-full" style={{ height }} title="Document" />
        </div>
      </div>
    );
  }

  if (kind === "image") {
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <a href={full} target="_blank" rel="noreferrer" className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
            Open Image
          </a>
          <a href={full} download className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
            Download
          </a>
        </div>
        <div className="mt-2 border rounded-lg overflow-hidden">
          <Image src={full} alt="Attachment" width={1200} height={height} className="w-full h-auto max-h-[600px] object-contain" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <a href={full} target="_blank" rel="noreferrer" className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
        Open File
      </a>
      <a href={full} download className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
        Download
      </a>
    </div>
  );
};

/* ---------- Quick Add Comment Modal (lightweight) ---------- */
const AddCommentModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
}> = ({ open, onClose, onSubmit }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (open) {
      setText("");
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold">Add Comment</h3>
          <textarea
            rows={4}
            className="mt-3 w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your comment…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="mt-3 flex justify-end gap-2">
            <button className="px-3 py-2 text-sm border rounded-md" onClick={onClose}>Cancel</button>
            <button
              className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => {
                const trimmed = text.trim();
                if (trimmed) onSubmit(trimmed);
                onClose();
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/* -------------------- page -------------------- */
export default function LeaseDetailPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, leaseError, currentLease } = useAppSelector(selectLease) as {
    isLoading: boolean;
    leaseError?: string | null;
    currentLease?: Lease | null;
  };

  const [editOpen, setEditOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [selectedClause, setSelectedClause] = useState<ClauseItem | null>(null);
  const [newComment, setNewComment] = useState("");

  const id = useMemo(() => cleanId(router.query.id), [router.query.id]);

  useEffect(() => {
    if (!router.isReady) return;
    if (!id) return;
    if (currentLease?._id === id || currentLease?.id === id) return;
    dispatch(getLeaseDetailsById(id));
  }, [dispatch, router.isReady, id, currentLease?._id, currentLease?.id]);

  const title =
    currentLease?.lease_title ||
    currentLease?.title ||
    "Untitled Lease";

  const address =
    currentLease?.property_address ||
    currentLease?.propertyAddress ||
    "—";

  const docUrl: string | undefined =
    currentLease?.url ||
    currentLease?.document_url ||
    (Array.isArray(currentLease?.documents) ? currentLease?.documents?.[0]?.url : undefined) ||
    undefined;

  const clauses: ClauseItem[] = useMemo(() => {
    const m = currentLease?.clauses;
    if (!m) return [];
    if (Array.isArray(m)) {
      return m.map((v, idx) => {
        const vv = v as ClauseRaw & { title?: string; name?: string };
        return { title: vv.title ?? vv.name ?? `Clause ${idx + 1}`, ...vv };
      });
    }
    // object map
    return Object.entries(m as ClauseMap).map(([title, v]) => ({ title, ...(v as ClauseRaw) }));
  }, [currentLease]);

  /* ----- Actions (wire to API as needed) ----- */
  const handleApprove = (clause: ClauseItem) => {
    // TODO: dispatch(updateClauseStatus({ id, clauseTitle: clause.title, status: 'approved' }))
    console.log("Approve", clause.title);
  };

  const handleAcceptAI = (clause: ClauseItem) => {
    // TODO: dispatch(acceptAISuggestion({ id, clauseTitle: clause.title }))
    console.log("Accept AI", clause.title);
  };

  const handleOpenEdit = (clause: ClauseItem) => {
    setSelectedClause(clause);
    setNewComment("");
    setEditOpen(true);
  };

  const handleOpenComment = (clause: ClauseItem) => {
    setSelectedClause(clause);
    setNewComment("");
    setCommentOpen(true);
  };

  const handleAddComment = (text?: string) => {
    if (!selectedClause) return;
    const payload = (text ?? newComment).trim();
    if (!payload) return;
    // TODO: dispatch(addClauseComment({ id, clauseTitle: selectedClause.title, text: payload }))
    console.log("Add comment", selectedClause.title, payload);
    setNewComment("");
  };


  // helper to create a stable id if the clause doesn't have one
  const makeClauseId = (leaseId: string, c: { id?: string; title?: string }, idx?: number) =>
    c.id || (c.title ? `${leaseId}::${c.title}` : `${leaseId}::idx-${idx ?? 0}`);

  // const normalizeStatus = (value?: string): ClauseStatus => {
  //   const v = (value ?? "Pending").toLowerCase().replace(/\s+/g, "_");
  //   // Adjust this list to exactly match your ClauseStatus union
  //   const allowed: ClauseStatus[] = [
  //     "Approved",
  //     "Edited",
  //     "Suggested",
  //     "Pending"
  //   ];
  //   return (allowed.includes(v as ClauseStatus) ? (v as ClauseStatus) : "Pending");
  // };

  // normalizers
  const normalizeStatus = (value?: string): ClauseStatus => {
    const v = (value ?? "Pending").toLowerCase().replace(/\s+/g, "_");
    const allowed: ClauseStatus[] = [
      "Approved",
      "Edited",
      "Suggested",
      "Pending"
    ];
    return (allowed.includes(v as ClauseStatus) ? (v as ClauseStatus) : "Pending");
  };

  const normalizeRisk = (value?: string): RiskLevel => {
    const v = (value ?? "").toLowerCase();
    if (/high|8\/10|9\/10|10\/10/.test(v)) return "High";
    if (/med|medium|5\/10|6\/10|7\/10/.test(v)) return "Medium";
    return "Low"; // default so it's never undefined
  };


  type RiskLevel = Clause["risk"]; // -> "High" | "Medium" | "Low"


  // your mapper must return an ExtendedClause that satisfies LoiClause
  const toModalClause = (c: ClauseItem, idx?: number): ExtendedClause => ({
    id: makeClauseId(id, c, idx),
    status: normalizeStatus(c.status),     // <- ClauseStatus
    risk: normalizeRisk(c.risk as string), // <- "High" | "Medium" | "Low" (never undefined)

    // extra modal fields
    title: c.title,
    name: c.title,
    originalText: c.clause_details,
    aiSuggestion: c.ai_suggested_clause_details,
    currentVersion: c.current_version,
    editor: "",
  });

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 text-sm inline-flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Loading */}

        {/* Error */}
        {!isLoading && leaseError && (
          <LoadingOverlay isVisible />)}

        {/* Empty */}
        {!isLoading && !leaseError && !currentLease && (
          <div className="bg-white rounded-xl p-6 text-gray-500">No lease found.</div>
        )}

        {/* Content */}
        {!isLoading && !leaseError && currentLease && (
          <div className="bg-white rounded-xl p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</h1>
                <div className="mt-1 text-sm text-gray-500">{address}</div>
              </div>
              <StatusChip value={currentLease?.status || "Active"} />
            </div>

            {/* Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Start Date</div>
                <div className="text-sm">
                  {currentLease?.startDate ? new Date(currentLease.startDate).toLocaleDateString() : "—"}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">End Date</div>
                <div className="text-sm">
                  {currentLease?.endDate ? new Date(currentLease.endDate).toLocaleDateString() : "—"}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Status</div>
                <div className="mt-1">
                  <StatusChip value={currentLease?.status || "Active"} />
                </div>
              </div>
            </div>

            {docUrl && (
              <div>
                <div className="text-sm font-medium mb-2">Lease Document</div>
                <DocumentViewer url={docUrl} />
              </div>
            )}

            {clauses.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">Lease Clauses [{clauses.length}]</h2>
                </div>

                <div className="overflow-hidden">
                  <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-600">
                    <div className="col-span-4">Clause</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Risk / Confidence</div>
                    <div className="col-span-2">Comments</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>

                  <ul className="divide-y divide-gray-200/70 divide-y-[1px]">
                    {clauses.map((c, idx) => {
                      const commentsCount = Array.isArray(c.comment)
                        ? c.comment.filter((x) => !x?.resolved).length
                        : 0;
                      const hasAISuggestion = !!c.ai_suggested_clause_details;

                      return (
                        <li key={c.title || `clause-${idx}`} className="px-4 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                            <div className="md:col-span-4">
                              <div className="font-medium text-gray-900 break-words">{c.title || `Clause ${idx + 1}`}</div>
                              {c.clause_details && (
                                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{c.clause_details as string}</p>
                              )}
                            </div>

                            <div className="md:col-span-2">
                              <StatusChip value={c.status} />
                            </div>

                            <div className="md:col-span-2 flex flex-wrap gap-2">
                              <RiskChip risk={c.risk} />
                              <ConfidenceChip score={typeof c.ai_confidence_score === "number" ? c.ai_confidence_score : undefined} />
                            </div>

                            <div className="md:col-span-2">
                              <CommentCountChip count={commentsCount} />
                            </div>

                            <div className="md:col-span-14 flex md:justify-end gap-2">
                              {hasAISuggestion && (
                                <button
                                  onClick={() => handleAcceptAI(c)}
                                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                                  title="Accept AI suggestion as current"
                                >
                                  <Wand2 className="w-3.5 h-3.5" />
                                  Accept AI
                                </button>
                              )}
                              <button
                                onClick={() => handleApprove(c)}
                                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                                title="Approve"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleOpenEdit(c)}
                                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md border hover:bg-gray-50"
                                title="Edit / View details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleOpenComment(c)}
                                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md border hover:bg-gray-50"
                                title="Add comment"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                Comment
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit / Details Modal (full-screen modal) */}
      {editOpen && selectedClause && (
        <ClauseDetailsModel
          onClose={() => setEditOpen(false)}
          clause={toModalClause(selectedClause, clauses.indexOf(selectedClause))} // <-- ensures `id`
          newComment={newComment}
          setNewComment={setNewComment}
          handleAddComment={() => handleAddComment()}
        />
      )}

      {/* Light "Add Comment" modal */}
      <AddCommentModal
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        onSubmit={(text) => {
          // Use the submitted text directly to avoid stale state issues
          setNewComment(text);
          handleAddComment(text);
        }}
      />
    </DashboardLayout>
  );
}
