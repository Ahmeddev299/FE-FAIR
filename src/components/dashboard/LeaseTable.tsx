"use client";

import React, { useState, useRef } from "react";
import { Eye, FileDown, MoreVertical, Trash2, Signature, ViewIcon, DownloadIcon, SignalIcon, DeleteIcon } from "lucide-react";
import { useRouter } from "next/router";
import axios from "axios";
import { formatDate } from "@/utils/dateFormatter";
import Toast from "../Toast";
import { LoadingOverlay } from "../loaders/overlayloader";
import Config from "@/config/index";
import ls from "localstorage-slim";

/* ---------- types ---------- */
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
  BASIC_INFORMATION?: { title?: string };
  PREMISES_PROPERTY_DETAILS?: { property_address_line2?: string };
};

interface LeaseTableProps {
  leases: Lease[] | null;
  isLoading?: boolean;
  error?: string | null;
  onViewAll?: () => void;
  onAddNew?: () => void;
  onClearError?: () => void;
  onDelete?: (id: string) => void;
  onSendForSign?: (id: string) => void;
}

const getRowId = (row: Lease) => row._id || row.id;

/* ---------- utils ---------- */
const norm = (s?: string) => (s || "").trim().toLowerCase();

const getStatusPill = (status?: string) => {
  const s = norm(status);
  const base = "inline-flex px-3 py-1 text-xs font-medium rounded-full";
  if (s === "signed") return `${base} bg-green-100 text-green-800`;
  if (s === "expiring") return `${base} bg-orange-100 text-orange-800`;
  if (s === "in review") return `${base} bg-yellow-100 text-yellow-800`;
  if (s === "terminated") return `${base} bg-red-100 text-red-800`;
  return `${base} bg-gray-100 text-gray-800`;
};

const statusLabel = (s?: string) => {
  const key = norm(s);
  const map: Record<string, string> = {
    signed: "Signed",
    expiring: "Expiring",
    "in review": "In Review",
    terminated: "Terminated",
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
    const statuses = blocks.map((b) => norm(b.status)).filter(Boolean);
    if (statuses.length) {
      if (statuses.some((s) => ["terminated", "rejected", "declined"].includes(s))) return "terminated";
      if (statuses.every((s) => s === "approved")) return "signed";
      if (statuses.some((s) => ["in review", "in progress", "pending", "draft"].includes(s))) return "in review";
    }
  }
  return "in review";
};

const truncateWords = (text: string | undefined, limit: number) => {
  if (!text) return "—";
  const words = text.trim().split(/\s+/);
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
};

const RowActionMenu: React.FC<{
  open: boolean;
  x: number;
  y: number;
  onClose: () => void;
  onView: () => void;
  onDownload: () => void;
  onSendForSign: () => void;
  onDelete: () => void;
}> = ({ open, x, y, onClose, onView, onDownload, onSendForSign, onDelete }) => {
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("mousedown", onDocClick);
    window.addEventListener("keydown", onEsc);
    window.addEventListener("scroll", onClose, { passive: true });
    window.addEventListener("resize", onClose);
    return () => {
      window.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("keydown", onEsc);
      window.removeEventListener("scroll", onClose);
      window.removeEventListener("resize", onClose);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      style={{ position: "fixed", top: y + 8, left: x - 8, zIndex: 50 }}
      className="w-[176px] rounded-[6px] border border-slate-200 bg-white shadow-[0_6px_18px_rgba(15,23,42,0.08)] antialiased"
      role="menu"
      aria-label="Actions"
    >
      <div className="px-[10px] py-[6px] text-[11px] font-semibold text-slate-500">
        Actions
      </div>

      <button
        role="menuitem"
        className="flex w-full items-center gap-[10px] px-[10px] py-[6px] text-[13px] leading-[18px] text-slate-800 hover:bg-slate-50"
        onClick={() => { onView(); onClose(); }}
      >
        <ViewIcon className="w-[14px] h-[14px]" />
        View
      </button>

      <div className="mx-[6px] h-px bg-slate-100" />

      <button
        role="menuitem"
        className="flex w-full items-center gap-[10px] px-[10px] py-[6px] text-[13px] leading-[18px] text-slate-800 hover:bg-slate-50"
        onClick={() => { onDownload(); onClose(); }}
      >
        <DownloadIcon className="w-[14px] h-[14px]" />
        Download
      </button>

      <div className="mx-[6px] h-px bg-slate-100" />

      <button
        role="menuitem"
        className="flex w-full items-center gap-[10px] px-[10px] py-[6px] text-[13px] leading-[18px] text-slate-800 hover:bg-slate-50"
        onClick={() => { onSendForSign(); onClose(); }}
      >
        <SignalIcon className="w-[14px] h-[14px]" />
        Send for Sign
      </button>

      <div className="mx-[6px] h-px bg-slate-100" />

      <button
        role="menuitem"
        className="flex w-full items-center gap-[10px] px-[10px] py-[6px] text-[13px] leading-[18px] text-rose-600 hover:bg-rose-50"
        onClick={() => { onDelete(); onClose(); }}
      >
        <DeleteIcon className="w-[14px] h-[14px]" />
        Delete
      </button>
    </div>
  );
};

/* ---------- main ---------- */
export const LeaseTable: React.FC<LeaseTableProps> = ({
  leases,
  isLoading,
  error,
  onViewAll,
  onAddNew,
  onClearError,
}) => {
  const router = useRouter();
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [menuState, setMenuState] = useState<{ id: string | null; x: number; y: number }>({
    id: null, x: 0, y: 0
  });
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const downloadingRef = useRef(false);

  const view = React.useCallback((row: Lease) => {
    const id = getRowId(row);
    if (!id) {
      console.warn("Lease id missing for row:", row);
      return;
    }
    router.push(`/dashboard/pages/lease/view/${encodeURIComponent(id)}`);
  }, [router]);

  const handleDownload = async (row: Lease) => {
    const id = getRowId(row);
    if (!id || downloadingRef.current) return;

    downloadingRef.current = true;
    setDownloadingId(id);

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
        throw new Error(maybe.data.message || "Failed to download lease");
      }

      const pdfUrl = maybe?.data?.data?.link?.pdf_url;

      if (!pdfUrl) {
        throw new Error("PDF URL not found in response");
      }

      // Auto-download the PDF
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.target = '_blank';
      link.download = `Lease_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const msg = maybe?.data?.message || "Lease downloaded successfully";
      Toast.fire({ icon: "success", title: msg });

    } catch (err: unknown) {
      console.error("Download lease error:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to download lease";
      Toast.fire({ icon: "error", title: errorMsg });
    } finally {
      downloadingRef.current = false;
      setDownloadingId(null);
    }
  };

  const showLoading = isLoading || leases == null;

  const getTitle = (row: Lease) =>
    row.BASIC_INFORMATION?.title || row.lease_title || row.title;

  const getAddress = (row: Lease) =>
    row.PREMISES_PROPERTY_DETAILS?.property_address_line2 ||
    row.property_address ||
    row.propertyAddress;

  const getUpdated = (row: Lease) =>
    row.updated_at || row.updatedAt || row.lastUpdate;

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB]">
      {/* Header */}
      <div className="px-6 py-5 border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">My Leases</h2>
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

      {/* Global Loading Overlay - shows when downloading */}
      {(isLoading || downloadingId) && <LoadingOverlay visible />}

      <div className="p-6">
        {/* Desktop table */}
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
                <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/6">
                  Upload By
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
                    <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-2 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-2 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-24 bg-gray-100 rounded animate-pulse" /></td>
                    <td className="px-4 py-4"><div className="h-8 w-20 bg-gray-100 rounded animate-pulse" /></td>
                  </tr>
                ))}

              {!showLoading && Array.isArray(leases) && leases.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-sm text-gray-500 py-6">
                    No records found
                  </td>
                </tr>
              )}

              {!showLoading &&
                leases?.map((row) => {
                  const id = row._id || row.id || `${getTitle(row)}-${getAddress(row)}`;
                  const title = getTitle(row);
                  const addr = getAddress(row);
                  const derived = deriveLeaseStatus(row);
                  const updated = getUpdated(row);
                  const isOpen = openId === id;
                  const rowId = row._id || row.id;

                  return (
                    <tr key={id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-gray-900" title={title || "N/A"}>
                        {truncateWords(title, 3)}
                      </td>
                      <td className="px-2 py-4 text-sm text-gray-500" title={addr}>
                        {truncateWords(addr, 3)}
                      </td>
                      <td className="px-2 py-4">
                        <span className={getStatusPill(derived)}>{statusLabel(derived)}</span>
                      </td>
                      <td className="px-2 py-4">
                        <span></span>
                      </td>
                      <td className="py-4 text-sm text-gray-700">
                        {updated ? formatDate(updated) : "—"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="h-9 w-9 inline-flex items-center justify-center border-slate-200 hover:bg-slate-50"
                            aria-haspopup="menu"
                            aria-expanded={menuState.id === rowId}
                            onClick={(e) => {
                              const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                              setMenuState((cur) =>
                                cur.id === rowId ? { id: null, x: 0, y: 0 } : { id: rowId!, x: r.left, y: r.bottom }
                              );
                            }}
                          >
                            <MoreVertical className="w-4 h-4 text-slate-600" />
                          </button>

                          <RowActionMenu
                            open={menuState.id === rowId}
                            x={menuState.x}
                            y={menuState.y}
                            onClose={() => setMenuState({ id: null, x: 0, y: 0 })}
                            onView={() => view(row)}
                            onDownload={() => handleDownload(row)}
                            onSendForSign={() => {
                              Toast.fire({ icon: "success", title: "Sent for signature (demo)" });
                            }}
                            onDelete={() => {
                              Toast.fire({ icon: "info", title: "Delete functionality not implemented" });
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};