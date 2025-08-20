import React from "react";
import { Eye } from "lucide-react";
import { useRouter } from "next/router";

// Reuse if you already have these; otherwise the inline UI below works too
// import { EmptyState } from "./EmptyState";
// import { ErrorMessage } from "./ErrorMessage";

type LoiItem = {
  id?: string;
  _id?: string;
  title?: string;
  propertyAddress?: string;
  status?: string;
  lastUpdate?: string;
};

interface LOITableProps {
  lois: LoiItem[];
  isLoading?: boolean;
  error?: string | null;
  onViewAll?: () => void;
  onAddNew?: () => void;
  onClearError?: () => void;
}

const getStatusPill = (status?: string) => {
  const s = (status || "").toLowerCase();
  const base = "inline-flex px-2 py-1 text-xs font-medium rounded-full";
  if (s === "available") return `${base} bg-green-100 text-green-800`;
  if (s === "pending") return `${base} bg-yellow-100 text-yellow-800`;
  if (s === "active") return `${base} bg-blue-100 text-blue-800`;
  if (s === "in review") return `${base} bg-purple-100 text-purple-800`;
  if (s === "terminated") return `${base} bg-red-100 text-red-800`;
  return `${base} bg-gray-100 text-gray-800`;
};

const truncateWords = (text: string | undefined, limit: number) => {
  if (!text) return "—";
  const words = text.trim().split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
};

export const LOITable: React.FC<LOITableProps> = ({
  lois,
  isLoading,
  error,
  onViewAll,
  onAddNew,
  onClearError,
}) => {
  const router = useRouter();
  const view = (row: LoiItem) => {
    const id = row._id || row.id;
    if (!id) return;
    router.push(`/dashboard/pages/loi/view/${id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">My LOIs</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
            {isLoading ? "…" : lois?.length || 0}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onAddNew && (
            <button
              onClick={onAddNew}
              className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50"
            >
              + New LOI
            </button>
          )}
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50"
            >
              View All
            </button>
          )}
        </div>
      </div>

      {/* Error */}
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

      {/* Table */}
      <div className="p-6">
        <div className="hidden lg:block">
          <table className="min-w-full divide-y divide-gray-100 table-fixed">
            <thead>
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/4">
                  LOI Title
                </th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/3">
                  Property Address
                </th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/6">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/6">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {/* Loading skeleton */}
              {isLoading &&
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

              {/* No records */}
              {!isLoading && (!lois || lois.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-500 text-sm">
                    No records found
                  </td>
                </tr>
              )}

              {/* Rows */}
              {!isLoading &&
                lois?.map((row) => (
                  <tr key={row._id || row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">
                      {truncateWords(row.title, 3)}
                    </td>
                    <td className="px-2 py-4 text-sm text-gray-500">
                      {truncateWords(row.propertyAddress, 3)}
                    </td>
                    <td className="px-2 py-4">
                      <span className={getStatusPill(row.status)}>{row.status || "Active"}</span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => view(row)}
                        className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                        disabled={!row._id && !row.id}
                        title={!row._id && !row.id ? "Missing ID" : "View"}
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Mobile (simple) */}
        <div className="lg:hidden space-y-3">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={`msk-${i}`} className="p-4 border rounded-lg">
                <div className="h-4 bg-gray-100 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
              </div>
            ))}

          {!isLoading && (!lois || lois.length === 0) && (
            <div className="text-center text-sm text-gray-500 py-6">No records found</div>
          )}

          {!isLoading &&
            lois?.map((row) => (
              <div key={row._id || row.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {truncateWords(row.title, 3)}
                  </h3>
                  <span className={getStatusPill(row.status)}>{row.status || "Active"}</span>
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  {truncateWords(row.propertyAddress, 4)}
                </div>
                <button
                  onClick={() => view(row)}
                  className="flex items-center gap-1 px-3 py-1 border rounded-md text-sm"
                  disabled={!row._id && !row.id}
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
