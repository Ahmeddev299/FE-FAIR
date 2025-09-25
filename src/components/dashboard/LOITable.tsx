import React, { useEffect, useRef, useState } from "react";
import { Eye, FileDown } from "lucide-react";
import { useRouter } from "next/router";
import { formatDate } from "@/utils/dateFormatter";
import { LoadingOverlay } from "../loaders/overlayloader";
import Toast from "../Toast";
import { LoiServerData } from "@/services/dashboard/asyncThunk";
import { exportLoiToDocx } from "@/utils/exportDocx";
import { normalizeLoiResponse } from "@/pages/dashboard/pages/loi/view/[id]";
import ls from "localstorage-slim";
import { Letter } from "@/types/loi";
import axios from "axios";
import Config from "@/config/index";


type ClauseBlock = { status?: string };
type LoiItem = {
  updated_at?: string;
  id?: string;
  _id?: string;
  title?: string;
  propertyAddress?: string;
  status?: string;
  lastUpdate?: string;
  clauses?: Record<string, ClauseBlock>;
};

interface LOITableProps {
  lois: LoiItem[] | null;
  isLoading?: boolean;
  error?: string | null;
  onViewAll?: () => void;
  onAddNew?: () => void;
  onClearError?: () => void;
}

const norm = (s?: string) => (s || "").trim().toLowerCase();


/** Keys we want to strip before sending to the API */
type SanitizableKeys =
  | "file_url"
  | "file_size"
  | "template_url"
  | "created_at"
  | "updated_at"
  | "clauses";

/** Remove only those top-level keys; keep strong typing (no any) */
const sanitizeLoiPayload = <T extends object>(row: T): Omit<T, SanitizableKeys> => {
  if (!row) return row as Omit<T, SanitizableKeys>;
  const safe = { ...(row as Record<string, unknown>) };
  const keys: readonly SanitizableKeys[] = [
    "file_url",
    "file_size",
    "template_url",
    "created_at",
    "updated_at",
    "clauses",
  ];

  // delete on an index signature
  const working = safe as { [key: string]: unknown };
  keys.forEach((k) => {
    if (k in working) delete working[k];
  });

  return working as Omit<T, SanitizableKeys>;
};


const deriveStatusFromClauses = (row: LoiItem) => {
  const blocks = row?.clauses ? Object.values(row.clauses) : [];
  if (!blocks.length) return norm(row.status) || "in review";
  const statuses = blocks.map((b) => norm(b.status)).filter(Boolean);
  if (!statuses.length) return norm(row.status) || "in review";
  const allApproved = statuses.every((s) => s === "approved");
  const anyInProgress = statuses.some((s) => s === "in progress");
  const allPending = statuses.every((s) => s === "pending");
  if (allApproved) return "approved";
  if (anyInProgress) return "in progress";
  if (allPending) return "pending";
  return "in review";
};

const getStatusPill = (status?: string) => {
  const s = norm(status);
  const base = "inline-flex px-2 py-1 text-xs font-medium rounded-full";
  if (s === "active") return `${base} bg-amber-100 text-amber-800`;
  if (s === "sent") return `${base} bg-purple-100 text-purple-800`;
  if (s === "in review") return `${base} bg-yellow-100 text-yellow-800`;
  if (s === "in progress") return `${base} bg-indigo-100 text-indigo-800`;
  if (s === "approved") return `${base} bg-green-100 text-green-800`;
  if (s === "terminated") return `${base} bg-red-100 text-red-800`;
  if (s === "pending") return `${base} bg-blue-100 text-blue-800`;
  return `${base} bg-gray-100 text-gray-800`;
};

const capitalize = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
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

  // download guards/state
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const downloadingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      downloadingRef.current = false;
    };
  }, []);

  const view = (row: LoiItem) => {
    const id = row._id || row.id;
    if (!id) return;
    router.push(`/dashboard/pages/loi/view/${id}`);
  };

  // Download selected LOI → sends the selected row as payload
  const handleDownload = async (row: Letter) => {
    if (downloadingRef.current) return;
    downloadingRef.current = true;
    const rowId = row?.id || "";
    setDownloadingId(rowId);

    try {
      const token = ls.get("access_token", { decrypt: true });
      if (!token) throw new Error("Authentication token not found");

      const payload = sanitizeLoiPayload(row);

      const resp = await axios.post(
        `${Config.API_ENDPOINT}/dashboard/download_tempalte_data`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const maybe = resp?.data as { success?: boolean; message?: string } | undefined;
      if (maybe?.success === false) throw new Error(maybe.message || "Failed to fetch LOI");
      if (maybe?.message) Toast.fire({ icon: "success", title: maybe.message });

      const data: LoiServerData = normalizeLoiResponse(resp.data);
      await exportLoiToDocx(data);

      if (isMountedRef.current) {
        Toast.fire({ icon: "success", title: "LOI exported successfully" });
      }
    } catch (err) {
      const status =
        (axios.isAxiosError(err) && err.response?.status) ? err.response!.status : undefined;

      const msg =
        status === 401 ? "Session expired. Please log in again."
          : status === 403 ? "You don't have permission to perform this action."
            : status === 404 ? "Download endpoint not found."
              : typeof status === "number" && status >= 500 ? "Server error. Please try again later."
                : (axios.isAxiosError(err) && (err.response?.data as { message?: string } | undefined)?.message)
                || (err instanceof Error ? err.message : "Failed to export LOI");

      if (isMountedRef.current) Toast.fire({ icon: "error", title: msg });
    } finally {
      downloadingRef.current = false;
      setDownloadingId(null);
    }
  };


  const showLoading = isLoading || lois == null;

  return (

    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-5 border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">My LOIs</h2>
        </div>
        <div className="flex items-center gap-2">
          {onAddNew && (
            <button
              onClick={onAddNew}
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border border-gray-300 shadow-sm bg-white hover:bg-gray-50 transition"
            >
              + New LOI
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
      {(isLoading || downloadingId) && <LoadingOverlay visible />}

      <div className="p-6">
        {/* Desktop */}
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
                    <td className="px-2 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-8 w-24 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))}

              {!showLoading && Array.isArray(lois) && lois.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-sm text-gray-500 py-6">
                    No records found
                  </td>
                </tr>
              )}

              {!showLoading &&
                Array.isArray(lois) &&
                lois.length > 0 &&
                lois.map((row) => {
                  const derived = deriveStatusFromClauses(row);
                  const rowId = row._id || row.id;
                  const isRowDownloading = downloadingId === rowId; // ✅ FIX

                  return (
                    <tr key={rowId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">
                        {truncateWords(row.title, 3)}
                      </td>
                      <td className="px-2 py-4 text-sm text-gray-500">
                        {truncateWords(row.propertyAddress, 3)}
                      </td>
                      <td className="px-2 py-4">
                        <span className={getStatusPill(derived)}>{capitalize(derived)}</span>
                      </td>
                      <td className="py-4 text-sm text-gray-700 w-1/2">
                        {row?.updated_at ? formatDate(row.updated_at) : "—"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-start">
                          {/* button group */}
                          <div className="inline-flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            {/* View (outline blue) */}
                            <button
                              onClick={() => view(row)}
                              disabled={!rowId}
                              title={!rowId ? "Missing ID" : "View"}
                              aria-label="View LOI"
                              className="
          inline-flex h-9 items-center gap-2 px-3
          text-blue-700 hover:bg-blue-50 active:bg-blue-100
          disabled:text-blue-400 disabled:hover:bg-transparent
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60
          transition
        "
                            >
                              <Eye className="w-4 h-4" />
                              <span className="hidden sm:inline text-sm">View</span>
                            </button>

                            {/* divider */}
                            <div className="mx-px my-1 w-px bg-blue-200" aria-hidden />

                            {/* Download (solid blue) */}
                            <button
                              onClick={() => handleDownload(row as Letter)}
                              disabled={!rowId || isRowDownloading}
                              title={!rowId ? "Missing ID" : "Download DOCX"}
                              aria-label="Download LOI"
                              className="
          inline-flex h-9 items-center gap-2 px-3
          bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800
          disabled:bg-blue-400 disabled:cursor-not-allowed
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70
          transition
        "
                            >
                              <FileDown className="w-4 h-4" />
                              <span className="hidden sm:inline text-sm">
                                {isRowDownloading ? "Downloading…" : "Download"}
                              </span>
                            </button>
                          </div>
                        </div>
                      </td>

                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="lg:hidden space-y-3">
          {showLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={`msk-${i}`} className="p-4 border border-gray-100 rounded-lg">
                <div className="h-4 bg-gray-100 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
              </div>
            ))}

          {!showLoading &&
            Array.isArray(lois) &&
            lois.length > 0 &&
            lois.map((row) => {
              const rowId = row._id || row.id;
              const isRowDownloading = downloadingId === rowId; // ✅ same fix

              return (
                <div key={rowId} className="p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {truncateWords(row.title, 3)}
                    </h3>
                    <span className={getStatusPill(row.status)}>{row.status}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    {truncateWords(row.propertyAddress, 4)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => view(row)}
                      className="flex items-center gap-1 px-3 py-1 border rounded-md text-sm"
                      disabled={!rowId}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>

                    {/* ✅ Mobile Download */}
                    <button
                      onClick={() => handleDownload(row as Letter)}
                      className="flex items-center gap-1 px-3 py-1 border rounded-md text-sm disabled:opacity-60"
                      disabled={!rowId || isRowDownloading}
                      title={!rowId ? "Missing ID" : "Download DOCX"}
                    >
                      <FileDown className="w-4 h-4" />
                      {isRowDownloading ? "Downloading..." : "Download"}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
