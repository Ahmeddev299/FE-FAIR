import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import {
  ArrowLeft, Check, X, MessageSquare, ChevronDown, ChevronUp,
  AlertTriangle, Info, Clock, CheckCircle2, XCircle,
  FileText, Calendar, DollarSign, MapPin, Building2, User,
  Send, Filter, Search, Loader2
} from "lucide-react";
import { DashboardLayout } from "@/components/layouts";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectLease } from "@/redux/slices/leaseSlice";
import { getLeaseDetailsById, acceptClauseSuggestionAsync } from "@/services/lease/asyncThunk";
import { commentOnClauseAsync } from "@/services/clause/asyncThunk";

/* ---------------- Types ---------------- */
interface ClauseComment {
  author?: string;
  text: string;
  resolved?: boolean;
  created_at?: string;
}

interface Clause {
  id?: string;
  title?: string;
  name?: string;             // <== used as clause_key with API
  category?: string;
  clause_details?: string;   // original clause text
  status?: string;           // pending | approved | rejected
  risk?: string;             // High | Medium | Low
  ai_confidence_score?: number;
  ai_suggested_clause_details?: string;
  comments?: ClauseComment[];
  comment?: ClauseComment[]; // some payloads use "comment"
  current_version?: string;
  updated_at?: string | number | Date;
}

interface LeaseData {
  _id?: string;
  id?: string;
  title?: string;
  lease_title?: string;
  propertyAddress?: string;
  property_address?: string;
  leaseType?: string;
  submitStatus?: string;
  submit_status?: string;
  squareFootage?: number;
  termDisplay?: string;
  startDate?: string | number | Date;
  endDate?: string | number | Date;
  rentAmount?: string;
  securityDeposit?: string;
  BASIC_INFORMATION?: {
    landlord_legal_name?: string;
    landlord_notice_email?: string;
    tenant_legal_name?: string;
    tenant_notice_email?: string;
    lease_type?: string;
    party_posture?: string;
    title?: string;
  };
  PREMISES_PROPERTY_DETAILS?: {
    property_address_line1?: string;
    property_address_line2?: string;
    property_city?: string;
    property_state?: string;
    property_zip?: number;
    rentable_sf?: number;
    property_size?: number;
  };
  TERM_TIMING_TRIGGERS?: {
    initial_term_years?: number;
    commencement_date_certain?: string;
  };
  template_data?: {
    header?: {
      landlord_name?: string;
      tenant_name?: string;
    };
    premises?: {
      square_footage?: string;
      street_address?: string;
      city_state_zip?: string;
    };
    lease_terms?: {
      base_rent_monthly?: string;
      term_display?: string;
      rent_commencement_date?: string;
      termination_date?: string;
      security_deposit?: string;
    };
    clauses?: {
      data?: {
        [category: string]: {
          [key: string]: string;
        };
      };
    };
  };
  clauses?: Record<string, Clause> | Clause[];
}

/* ---------------- Small UI bits ---------------- */
const StatusBadge = ({ status }: { status?: string }) => {
  const s = (status || "pending").toLowerCase();
  const configs: Record<string, { bg: string; text: string; border: string; icon: any }> = {
    approved: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle2 },
    rejected: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: XCircle },
    pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: Clock },
    submitted: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: CheckCircle2 },
  };
  const config = configs[s] || configs.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-3.5 h-3.5" />
      {status?.charAt(0).toUpperCase() + status?.slice(1) || "Pending"}
    </span>
  );
};

const RiskBadge = ({ risk }: { risk?: string }) => {
  if (!risk) return null;

  const configs: Record<string, { bg: string; text: string; border: string }> = {
    High: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
    Medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    Low: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  };
  const config = configs[risk] || configs.Low;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      <AlertTriangle className="w-3 h-3" />
      {risk} Risk
    </span>
  );
};

const InfoCard = ({ icon: Icon, label, value, className = "" }: { icon: any; label: string; value?: React.ReactNode; className?: string }) => (
  <div className={`p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 ${className}`}>
    <div className="flex items-center gap-2 text-gray-600 text-xs font-medium mb-1">
      <Icon className="w-4 h-4" />
      {label}
    </div>
    <div className="text-sm font-semibold text-gray-900">{value || "—"}</div>
  </div>
);

/* ---------------- Clause Card ---------------- */
const ClauseCard = ({
  clause,
  onAccept,
  onReject,
  onComment,
  accepting,
}: {
  clause: Clause & { id: string; name: string };
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onComment: (id: string, text: string) => void;
  accepting?: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);

  const comments = clause.comments || clause.comment || [];
  const unresolvedComments = comments.filter(c => !c.resolved);

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onComment(clause.id, commentText);
      setCommentText("");
      setShowCommentBox(false);
    }
  };

  const isPending = (clause.status || "pending").toLowerCase() === "pending";

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              {clause.title || clause.name || "Untitled Clause"}
            </h3>
            {clause.category && <p className="text-xs text-gray-500">{clause.category}</p>}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <StatusBadge status={clause.status} />
            <RiskBadge risk={clause.risk} />
          </div>
        </div>

        <div className={`text-sm text-gray-700 leading-relaxed ${!expanded && 'line-clamp-2'}`}>
          {clause.clause_details || clause.current_version || "No details available"}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            {typeof clause.ai_confidence_score === "number" && (
              <span className="text-xs text-gray-500">
                Confidence: <span className="font-medium text-gray-700">{(clause.ai_confidence_score * 100).toFixed(0)}%</span>
              </span>
            )}
            {unresolvedComments.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-rose-600 font-medium">
                <MessageSquare className="w-3.5 h-3.5" />
                {unresolvedComments.length} comment{unresolvedComments.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            {expanded ? (
              <>Show less <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>Show more <ChevronDown className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-5 bg-gray-50 space-y-4">
          {clause.ai_suggested_clause_details && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 font-medium text-sm mb-2">
                <Info className="w-4 h-4" />
                AI Suggested Alternative
              </div>
              <p className="text-sm text-blue-900 leading-relaxed">
                {clause.ai_suggested_clause_details}
              </p>
            </div>
          )}

          {comments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900">Comments</h4>
              {comments.map((comment, idx) => (
                <div key={idx} className="p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-900">{comment.author || "Anonymous"}</span>
                    <span className="text-xs text-gray-500">{comment.created_at || ""}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          )}

          {showCommentBox && (
            <div className="space-y-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitComment}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Comment
                </button>
                <button
                  onClick={() => {
                    setShowCommentBox(false);
                    setCommentText("");
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-end gap-2">
        {isPending && (
          <>
            <button
              onClick={() => onReject(clause.id!)}
              className="px-4 py-2 bg-rose-50 text-rose-700 text-sm font-medium rounded-lg hover:bg-rose-100 transition-colors inline-flex items-center gap-2 border border-rose-200"
            >
              <X className="w-4 h-4" />
              Reject
            </button>
            <button
              onClick={() => onAccept(clause.id!)}
              disabled={accepting}
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center gap-2 disabled:opacity-60"
            >
              {accepting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Accept
            </button>
          </>
        )}
        <button
          onClick={() => setShowCommentBox(!showCommentBox)}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Add Comment
        </button>
      </div>
    </div>
  );
};

/* ---------------- Helpers ---------------- */
const cleanId = (raw?: string | string[]): string => {
  const s = Array.isArray(raw) ? raw[0] : raw || "";
  return s.trim().replace(/[{}]/g, "");
};

/* ---------------- Page ---------------- */
export default function LeaseDetailPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, leaseError, currentLease } = useAppSelector(selectLease) as {
    isLoading: boolean;
    leaseError?: string | null;
    currentLease?: LeaseData | null;
  };

  const [clauses, setClauses] = useState<(Clause & { id: string; name: string })[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  // Extract and clean lease ID from URL
  const id = useMemo(() => cleanId(router.query.id), [router.query.id]);

  // Fetch lease data using Redux
  useEffect(() => {
    if (!router.isReady) return;
    if (!id) return;
    if (currentLease?._id === id || currentLease?.id === id) return;
    dispatch(getLeaseDetailsById(id));
  }, [dispatch, router.isReady, id, currentLease?._id, currentLease?.id]);

  // Process clauses from template_data.clauses.data (preferred) / fallback structures
  const processClausesData = (data: LeaseData): (Clause & { id: string; name: string })[] => {
    const clausesList: (Clause & { id: string; name: string })[] = [];

    // If array provided
    if (Array.isArray(data.clauses)) {
      return data.clauses.map((c, idx) => ({
        ...c,
        id: c.id || `clause-${idx}`,
        name: c.name || c.title || `Clause ${idx + 1}`,
        title: c.title || c.name || `Clause ${idx + 1}`,
        status: (c.status || "pending").toLowerCase(),
      }));
    }

    // Preferred: template_data.clauses.data (matches your payload)
    if (data.template_data?.clauses?.data) {
      Object.entries(data.template_data.clauses.data).forEach(([category, categoryData]) => {
        Object.entries(categoryData).forEach(([key, value]) => {
          // Stable ID for card + stable name used by APIs in your other pages
          const id = `${category}::${key}`;
          const name = `${category} #${key}`;

          // If a server-side persisted object exists, merge it (optional, keeps future compat)
          const existing =
            (data.clauses as Record<string, Clause> | undefined)?.[id] ||
            (data.clauses as Record<string, Clause> | undefined)?.[name] ||
            (data.clauses as Record<string, Clause> | undefined)?.[key];

          clausesList.push({
            id,
            name,
            title: key,
            category,
            clause_details: value,
            status: (existing?.status || "pending").toLowerCase(),
            risk: existing?.risk || "Medium",
            ai_confidence_score: existing?.ai_confidence_score,
            ai_suggested_clause_details: existing?.ai_suggested_clause_details,
            comments: existing?.comments || existing?.comment,
            current_version: existing?.current_version,
            updated_at: existing?.updated_at,
          });
        });
      });
      return clausesList;
    }

    // Object map fallback
    if (data.clauses && typeof data.clauses === "object") {
      Object.entries(data.clauses).forEach(([key, value]) => {
        const v = value as Clause;
        const name = v.name || v.title || key;
        clausesList.push({
          id: key,
          name,
          title: v.title || key,
          ...v,
          status: (v.status || "pending").toLowerCase(),
        });
      });
      return clausesList;
    }

    return [];
  };

  // Process clauses when currentLease changes
  useEffect(() => {
    if (currentLease) {
      const processed = processClausesData(currentLease);
      setClauses(processed);
    }
  }, [currentLease]);

  // Extract lease info with fallbacks
  const leaseInfo = useMemo(() => {
    if (!currentLease) return null;

    const template = currentLease.template_data;
    const basicInfo = currentLease.BASIC_INFORMATION;
    const premises = currentLease.PREMISES_PROPERTY_DETAILS;
    const terms = currentLease.TERM_TIMING_TRIGGERS;

    // Build property address
    let propertyAddress = currentLease.property_address || currentLease.propertyAddress || "";
    if (!propertyAddress && premises) {
      const parts = [
        premises.property_address_line1,
        premises.property_address_line2,
        premises.property_city,
        premises.property_state,
        premises.property_zip?.toString(),
      ].filter(Boolean);
      propertyAddress = parts.join(", ");
    }
    if (!propertyAddress && template?.premises) {
      propertyAddress = [
        template.premises.street_address,
        template.premises.city_state_zip,
      ].filter(Boolean).join(", ");
    }

    return {
      title: currentLease.lease_title || basicInfo?.title || currentLease.title || "Untitled Lease",
      leaseType: basicInfo?.lease_type || "N/A",
      propertyAddress: propertyAddress || "—",
      landlordName: template?.header?.landlord_name || basicInfo?.landlord_legal_name || "N/A",
      tenantName: template?.header?.tenant_name || basicInfo?.tenant_legal_name || "N/A",
      submitStatus: currentLease.submit_status || currentLease.submitStatus || "Draft",
      squareFootage: premises?.rentable_sf || premises?.property_size ||
                     template?.premises?.square_footage || currentLease.squareFootage || "N/A",
      termDisplay: template?.lease_terms?.term_display ||
                   currentLease.termDisplay ||
                   `${terms?.initial_term_years || 0} years`,
      startDate: currentLease.startDate ||
                template?.lease_terms?.rent_commencement_date ||
                terms?.commencement_date_certain,
      endDate: currentLease.endDate || template?.lease_terms?.termination_date,
      rentAmount: template?.lease_terms?.base_rent_monthly || currentLease.rentAmount || "N/A",
      securityDeposit: template?.lease_terms?.security_deposit || currentLease.securityDeposit || "N/A",
    };
  }, [currentLease]);

  /* -------- Actions: Accept / Reject / Comment -------- */
  const handleAccept = async (clauseId: string) => {
    // locate clause for payload pieces
    const clause = clauses.find(c => c.id === clauseId);
    if (!clause || !currentLease) return;

    const clause_key = clause.name; // "<category> #<n>" used in your other page's API calls
    const details =
      clause.ai_suggested_clause_details ||
      clause.current_version ||
      clause.clause_details ||
      "";

    try {
      setAcceptingId(clauseId);
      await dispatch(
        acceptClauseSuggestionAsync({
          clauseId: currentLease._id || currentLease.id || "",
          clause_key,
          details,
        })
      ).unwrap();

      // reflect locally
      setClauses(prev =>
        prev.map(c =>
          c.id === clauseId
            ? {
                ...c,
                status: "approved",
                current_version: clause.ai_suggested_clause_details || c.current_version || c.clause_details,
              }
            : c
        )
      );
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = (clauseId: string) => {
    setClauses(prev => prev.map(c =>
      c.id === clauseId ? { ...c, status: "rejected" } : c
    ));
    // If you add a reject API later, call it here.
  };

  const handleComment = async (clauseId: string, text: string) => {
    const clause = clauses.find(c => c.id === clauseId);
    if (!clause || !currentLease) return;

    const clause_key = clause.name;

    // optimistic update
    setClauses(prev => prev.map(c =>
      c.id === clauseId
        ? {
            ...c,
            comments: [
              ...(c.comments || []),
              {
                author: "Current User",
                text,
                resolved: false,
                created_at: new Date().toISOString().split("T")[0],
              },
            ],
          }
        : c
    ));

    try {
      await dispatch(
        commentOnClauseAsync({
          clauseDocId: currentLease._id || currentLease.id || "",
          clause_key,
          comment: text,
        })
      ).unwrap();
    } catch {
      // revert on error if you want; for now we’ll leave optimistic UI
    }
  };

  /* ---------------- Filters & Stats ---------------- */
  const filteredClauses = useMemo(() => {
    return clauses.filter(c => {
      const matchesStatus =
        filterStatus === "all" || (c.status || "pending").toLowerCase() === filterStatus;
      const matchesSearch =
        searchQuery === "" ||
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.clause_details?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [clauses, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: clauses.length,
      approved: clauses.filter(c => (c.status || "pending").toLowerCase() === "approved").length,
      rejected: clauses.filter(c => (c.status || "pending").toLowerCase() === "rejected").length,
      pending: clauses.filter(c => !c.status || c.status.toLowerCase() === "pending").length,
    };
  }, [clauses]);

  /* ---------------- Render ---------------- */
  if (leaseError) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 max-w-md">
            <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-rose-900 text-center mb-2">Error Loading Lease</h2>
            <p className="text-sm text-rose-700 text-center">{leaseError}</p>
            <button
              onClick={() => dispatch(getLeaseDetailsById(id))}
              className="mt-4 w-full px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!leaseInfo) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl p-6 text-gray-500">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading lease…
              </div>
            ) : (
              "No lease data available."
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="W-FULL mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{leaseInfo.title}</h1>
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4" />
                {leaseInfo.propertyAddress}
              </p>
            </div>a
          </div>

          {/* Key Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoCard icon={Building2} label="Lease Type" value={leaseInfo.leaseType} />
            <InfoCard icon={User} label="Landlord" value={leaseInfo.landlordName} />
            <InfoCard icon={User} label="Tenant" value={leaseInfo.tenantName} />
            <InfoCard
              icon={FileText}
              label="Square Footage"
              value={
                typeof leaseInfo.squareFootage === "number"
                  ? `${leaseInfo.squareFootage.toLocaleString()} SF`
                  : leaseInfo.squareFootage
              }
            />
            <InfoCard
              icon={Calendar}
              label="Start Date"
              value={leaseInfo.startDate ? new Date(leaseInfo.startDate).toLocaleDateString() : "—"}
            />
            <InfoCard
              icon={Calendar}
              label="End Date"
              value={leaseInfo.endDate ? new Date(leaseInfo.endDate).toLocaleDateString() : "—"}
            />
            <InfoCard icon={DollarSign} label="Base Rent" value={leaseInfo.rentAmount} />
            <InfoCard icon={DollarSign} label="Security Deposit" value={leaseInfo.securityDeposit} />
          </div>

          {/* Stats Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Clause Review Progress</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600 mt-1">Total Clauses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">{stats.approved}</div>
                <div className="text-sm text-gray-600 mt-1">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-600">{stats.rejected}</div>
                <div className="text-sm text-gray-600 mt-1">Rejected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
                <div className="text-sm text-gray-600 mt-1">Pending</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Review Progress</span>
                <span>
                  {stats.total > 0 ? Math.round(((stats.approved + stats.rejected) / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500"
                  style={{
                    width: `${
                      stats.total > 0 ? ((stats.approved + stats.rejected) / stats.total) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clauses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Clauses List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Lease Clauses ({filteredClauses.length})
            </h2>

            {isLoading && clauses.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-600">
                <Loader2 className="w-6 h-6 mx-auto mb-3 animate-spin" />
                Loading clauses…
              </div>
            ) : (
              <>
                {filteredClauses.map(clause => (
                  <ClauseCard
                    key={clause.id}
                    clause={clause}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onComment={handleComment}
                    accepting={acceptingId === clause.id}
                  />
                ))}

                {filteredClauses.length === 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No clauses found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {searchQuery || filterStatus !== "all"
                        ? "Try adjusting your filters or search query"
                        : "No clauses available for this lease"}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
