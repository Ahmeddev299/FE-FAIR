import React from "react";
import { Eye } from "lucide-react";
import { useRouter } from "next/router";
import { formatDate } from "@/utils/dateFormatter";

type ClauseBlock = { status?: string };

type Lease = {
  updated_at?: string;
  id?: string;
  _id?: string;
  lease_title?: string;
  title?: string;
  property_address?: string;
  propertyAddress?: string;
  status?: string;
  clauses?: Record<string, ClauseBlock>;
  updatedAt?: string;
  lastUpdate?: string;
  startDate?: string;
  endDate?: string;
};

interface LeaseTableProps {
  leases: Lease[] | null;
  isLoading?: boolean;
  error?: string | null;
  onViewAll?: () => void;
  onAddNew?: () => void;
  onClearError?: () => void;
}

const norm = (s?: string) => (s || "").trim().toLowerCase();

// ----- Status helpers -----
const getStatusPill = (status?: string) => {
  const s = norm(status);
  const base = "inline-flex px-3 py-1 text-xs font-medium rounded-full";
  if (s === "signed") return `${base} bg-green-100 text-green-800`;
  if (s === "expiring") return `${base} bg-orange-100 text-orange-800`;
  if (s === "in review") return `${base} bg-yellow-100 text-yellow-800`;
  if (s === "terminated") return `${base} bg-red-100 text-red-800`;
  return `${base} bg-gray-100 text-gray-800`; // fallback
};

const statusLabel = (s?: string) => {
  const key = norm(s);
  const map: Record<string, string> = {
    "signed": "Signed",
    "expiring": "Expiring",
    "in review": "In Review",
    "terminated": "Terminated",
  };
  return map[key] ?? (key ? key.charAt(0).toUpperCase() + key.slice(1) : "—");
};

const willExpireWithin = (end?: string, days = 30) => {
  if (!end) return false;
  const endMs = new Date(end).getTime();
  if (Number.isNaN(endMs)) return false;
  const now = Date.now();
  const diffDays = (endMs - now) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= days;
};

const deriveLeaseStatus = (row: Lease): string => {
  const top = norm(row.status);
  const allowed = new Set(["signed", "expiring", "in review", "terminated"]);

  if (top === "terminated") return "terminated";

  if (willExpireWithin(row.endDate)) return "expiring";

  if (allowed.has(top)) return top;

  const blocks = row?.clauses ? Object.values(row.clauses) : [];
  if (blocks.length) {
    const statuses = blocks.map(b => norm(b.status)).filter(Boolean);

    if (statuses.length) {

      const anyTerminated = statuses.some(s => s === "terminated" || s === "rejected" || s === "declined");
      if (anyTerminated) return "terminated";

      const allApproved = statuses.every(s => s === "approved");
      if (allApproved) return "signed";

      const anyNotFinal =
        statuses.some(s =>
          ["in review", "in progress", "pending", "draft"].includes(s)
        );
      if (anyNotFinal) return "in review";
    }
  }
  return "in review";
};

const truncateWords = (text: string | undefined, limit: number) => {
  if (!text) return "—";
  const words = text.trim().split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
};

export const LeaseTable: React.FC<LeaseTableProps> = ({
  leases,
  isLoading,
  error,
  onViewAll,
  onAddNew,
  onClearError,
}) => {
  const router = useRouter();
  const view = (row: Lease) => {
    const id = (row as Lease)._id || row.id;
    if (!id) return;
    router.push(`/dashboard/pages/lease/view/${id}`);
  };

  const showLoading = isLoading || leases == null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-5  border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">My Leases</h2>
        </div>
        <div className="flex items-center gap-2">
          {onAddNew && (
            <button
              onClick={onAddNew}
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border border-gray-300 shadow-sm bg-white hover:bg-gray-50 transition"
            >
              + Upload Lease
            </button>
          )}
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border border-gray-300 shadow-sm bg-white hover:bg-gray-50 transition"
            >
              View All
            </button>
          )}
        </div>

      </div>

      {error && (
        <div className="px-6 py-3 text-sm text-red-700 bg-red-50 border-b border-red-100 flex items-start justify-between">
          <span>{error}</span>
          {onClearError && (
            <button onClick={onClearError} className="text-red-600 hover:underline">
              Dismiss
            </button>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="hidden lg:block">
          <table className="min-w-full divide-y divide-gray-100 table-fixed">
            <thead>
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/4">
                  Lease Title
                </th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/3">
                  Property Address
                </th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/6">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Last Updated
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/6">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {showLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={`sk-${i}`}>
                    <td className="px-5 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                    <td className="px-2 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                    <td className="px-2 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-8 w-20 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))}

              {!showLoading && Array.isArray(leases) && leases.length === 0 && (
                <div className="text-center text-sm text-gray-500 py-6">No records found</div>
              )}

              {!showLoading &&
                leases?.map((row) => {
                  const title = row.lease_title || row.title;
                  const addr = row.property_address || row.propertyAddress;
                  const derived = deriveLeaseStatus(row);
                  return (
                    <tr key={(row as Lease)._id || row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-gray-900" title={title || "N/A"}>
                        {truncateWords(title, 3)}
                      </td>
                      <td className="px-2 py-4 text-sm text-gray-500" title={addr}>
                        {truncateWords(addr, 3)}
                      </td>
                      <td className="px-2 py-4">
                        <span className={getStatusPill(derived)}>{statusLabel(derived)}</span>
                      </td>
                      <td className="py-4 text-sm text-gray-700 w-1/2">
                        <span>{row?.updated_at && formatDate(row.updated_at)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => view(row)}
                          className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"

                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden space-y-3">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={`msk-${i}`} className="p-4 border border-gray-100  rounded-lg">
                <div className="h-4 bg-gray-100 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
              </div>
            ))}

          {!isLoading && (!leases || leases.length === 0) && (
            <div className="text-center text-sm text-gray-500 py-6">No records found</div>
          )}

          {!isLoading && Array.isArray(leases) && leases.length > 0 &&
            leases?.map((row) => {
              const title = row.lease_title || row.title;
              const addr = row.property_address || row.propertyAddress;
              const derived = deriveLeaseStatus(row);
              return (
                <div key={(row as Lease)._id || row.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="mr-2 text-sm font-medium text-gray-900">
                      {truncateWords(title, 3)}
                    </h3>
                    <span className={getStatusPill(derived)}>{statusLabel(derived)}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">{truncateWords(addr, 4)}</div>
                  <button
                    onClick={() => view(row)}
                    className="flex items-center gap-1 px-3 py-1 border rounded-md text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
