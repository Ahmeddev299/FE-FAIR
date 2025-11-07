/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef, useState } from "react";
import { Eye, FileDown, MoreVertical } from "lucide-react";
import { useRouter } from "next/router";
import { formatDate } from "@/utils/dateFormatter";
import { LoadingOverlay } from "../loaders/overlayloader";
import Toast from "../Toast";
import { getDashboardStatsAsync, LoggedInUser, LoiServerData } from "@/services/dashboard/asyncThunk";
import { exportLoiToDocx } from "@/utils/exportDocx";
import { normalizeLoiResponse } from "@/pages/dashboard/pages/loi/view/[id]";
import ls from "localstorage-slim";
import { Letter } from "@/types/loi";
import axios from "axios";
import Config from "@/config/index";
import { DeleteLoiModal } from "../models/loiDeleteModel";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { deleteLOIAsync } from "@/services/loi/asyncThunk";
import DeleteIcon from '@/icons/delete.svg';
import SignIcon from '@/icons/sign.svg';
import DownloadIcon from '@/icons/download.svg'
import ViewIcon from '@/icons/view.svg'
import { RootState } from "@/redux/store";

type UserRole = "tenant" | "landlord";

type ClauseBlock = { status?: string };

export type LoiItem = {
  id?: string;
  _id?: string;

  title?: string;
  property_address_S1?: string;
  status?: string;
  updated_at?: string;

  relatedUser?: UserRole;

  Clauses?: unknown;
  clauses?: Record<string, ClauseBlock> | string | null | undefined;

  Clauses_id?: string;
  clauses_id?: string;
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

type SanitizableKeys =
  | "file_url"
  | "file_size"
  | "template_url"
  | "created_at"
  | "updated_at"
  | "clauses";

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

  const working = safe as { [key: string]: unknown };
  keys.forEach((k) => {
    if (k in working) delete working[k];
  });

  return working as Omit<T, SanitizableKeys>;
};

const deriveStatusFromClauses = (row: LoiItem) => {
  let blocks: ClauseBlock[] = [];

  if (row?.clauses && typeof row.clauses === "object" && !Array.isArray(row.clauses)) {
    blocks = Object.values(row.clauses as Record<string, ClauseBlock>);
  } else if (row?.Clauses && typeof row.Clauses === "object" && !Array.isArray(row.Clauses)) {
    blocks = Object.values(row.Clauses as Record<string, ClauseBlock>);
  }

  const statuses = blocks.map((b) => norm(b?.status)).filter(Boolean);
  if (!statuses.length) return norm(row?.status) || "pending";
  const allApproved = statuses.every((s) => s === "approved");
  const anyInProgress = statuses.some((s) => s === "in progress");
  const allPending = statuses.every((s) => s === "pending");
  if (allApproved) return "approved";
  if (anyInProgress) return "in progress";
  if (allPending) return "pending";
  return "pending";
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
      className="w-[150px] rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
      role="menu"
      aria-label="Actions"
    >
      <div
        role="menu"
        className="
    w-[176px] rounded-[6px] border border-slate-200 bg-white
    shadow-[0_6px_18px_rgba(15,23,42,0.08)]
    antialiased
  "
      >
        <div className="px-[10px] py-[6px] text-[11px] font-semibold text-slate-500">
          Actions
        </div>

        <button
          role="menuitem"
          className="flex w-full items-center gap-[10px] px-[10px] py-[6px]
               text-[13px] leading-[18px] text-slate-800 hover:bg-slate-50"
          onClick={() => { onView(); onClose(); }}
        >
          <ViewIcon className="w-[14px] h-[14px]" />
          View
        </button>

        <div className="mx-[6px] h-px bg-slate-100" />

        <button
          role="menuitem"
          className="flex w-full items-center gap-[10px] px-[10px] py-[6px]
               text-[13px] leading-[18px] text-slate-800 hover:bg-slate-50"
          onClick={() => { onDownload(); onClose(); }}
        >
          <DownloadIcon className="w-[14px] h-[14px]" />
          Download
        </button>

        <div className="mx-[6px] h-px bg-slate-100" />

        <button
          role="menuitem"
          className="flex w-full items-center gap-[10px] px-[10px] py-[6px]
               text-[13px] leading-[18px] text-slate-800 hover:bg-slate-50"
          onClick={() => { onSendForSign(); onClose(); }}
        >
          <SignIcon className="w-[14px] h-[14px]" />
          Send for Sign
        </button>

        <div className="mx-[6px] h-px bg-slate-100" />

        <button
          role="menuitem"
          className="flex w-full items-center gap-[10px] px-[10px] py-[6px]
               text-[13px] leading-[18px] text-rose-600 hover:bg-rose-50"
          onClick={() => { onDelete(); onClose(); }}
        >
          <DeleteIcon className="w-[14px] h-[14px]" />
          Delete
        </button>

      </div>

    </div>
  );
};

export const LOITable: React.FC<LOITableProps> = ({
  lois,
  isLoading,
  onViewAll,
  onAddNew,
}) => {

  const router = useRouter();
  const dispatch = useAppDispatch()
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const loggedInUser = useAppSelector((s: RootState) => s.dashboard.loggedInUser) as LoggedInUser | null;
  const [menuState, setMenuState] = useState<{ id: string | null; x: number; y: number }>({
    id: null, x: 0, y: 0
  });
  const [deleteModal, setDeleteModal] = React.useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  const downloadingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      downloadingRef.current = false;
    };
  }, []);

  const normalizeClauses = (row: LoiItem) => {
    const id = row._id ?? row.id ?? "";

    const clausesId = String(row.Clauses_id ?? row.clauses_id ?? "").trim();

    let raw = (row.Clauses ?? row.clauses) as unknown;
    if (typeof raw === "string") {
      try { raw = JSON.parse(raw); } catch { /* leave as string */ }
    }

    const isObj = raw && typeof raw === "object" && !Array.isArray(raw);
    const obj = isObj ? (raw as Record<string, any>) : null;

    const hasObjContent =
      !!obj && Object.keys(obj).length > 0 &&
      Object.values(obj).some(v => {
        if (v == null) return false;
        if (typeof v === "string") return v.trim().length > 0;
        if (Array.isArray(v)) return v.length > 0;
        if (typeof v === "object") return Object.keys(v).length > 0;
        return true;
      });

    const hasClauses = clausesId.length > 0 || hasObjContent;

    return {
      id,
      hasClauses,
      clausesId,
      objKeys: obj ? Object.keys(obj) : [],
      rawType: typeof (row.Clauses ?? row.clauses)
    };
  };

  const routeFor = (id: string, userRole: string | undefined, relatedUser?: UserRole) => {
    const me = userRole ?? "tenant";
    const other = (relatedUser ?? "tenant") as UserRole;

    if (me === "tenant" && other === "tenant") {
      return `/dashboard/pages/loi/view/${id}`;
    }

    if (me === "landlord" && other === "tenant") {
      return `/landlordDashboard/view/${id}`;
    }

    if (me === "landlord" && other === "landlord") {
      return `/dashboard/pages/loi/view/${id}`;
    }
    return `/dashboard/pages/loi/view/${id}`;
  };

  const view = (row: LoiItem) => {
    const n = normalizeClauses(row);
    if (!n.id) return;

    const related = (row.relatedUser ?? "").toLowerCase() as UserRole | undefined;
    const url = routeFor(n.id, loggedInUser?.role, related);

    console.log("[LOI route debug]", {
      id: n.id,
      userRole: loggedInUser?.role,
      relatedUser: related,
      resolved: url,
    });

    router.push(url);
  };

  type DownloadTemplateDataResponse = {
    success: boolean;
    message?: string;
    data?: {
      temp?: boolean;
    };
  };

  const handleDownload = async (row: Letter) => {
    if (downloadingRef.current) return;
    const rowId = row?.id || "";
    if (!rowId) {
      Toast.fire({ icon: "error", title: "Missing LOI ID" });
      return;
    }

    downloadingRef.current = true;
    setDownloadingId(rowId);

    try {
      const token = ls.get("access_token", { decrypt: true });
      if (!token) throw new Error("Authentication token not found");

      const payload = sanitizeLoiPayload(row);

      const resp = await axios.post<DownloadTemplateDataResponse>(
        `${Config.API_ENDPOINT}/dashboard/download_template_data`,
        { ...payload, doc_id: rowId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const body = resp.data; // strongly typed ✅

      if (body.success === false) throw new Error(body.message || "Failed to fetch LOI");
      if (body.message) Toast.fire({ icon: "success", title: body.message });

      const data: LoiServerData = normalizeLoiResponse(body as any);

      const isTemp = !!body.data?.temp;
      await exportLoiToDocx(data, undefined, isTemp);

      if (isMountedRef.current) {
        Toast.fire({ icon: "success", title: "LOI exported successfully" });
      }
    } catch (err) {
      const status = (axios.isAxiosError(err) && err.response?.status)
        ? err.response!.status
        : undefined;

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

    <div className="bg-white rounded-xl border border-[#E5E7EB]">
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
                <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/6">
                  upload By
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
                    <td className="px-0 py-2">
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

                  return (
                    <tr key={rowId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">
                        {truncateWords(row.title, 3)}
                      </td>
                      <td className="px-2 py-4 text-sm text-gray-500">
                        {truncateWords(row.property_address_S1, 3)}
                      </td>
                      <td className="px-2 py-4">
                        <span className={getStatusPill(derived)}>{capitalize(derived)}</span>
                      </td>
                      <td className="py-2 text-sm text-gray-700">
                        {truncateWords(row.relatedUser, 3)}
                      </td>
                      <td className="py-2 text-sm text-gray-700 w-1/2">
                        {row?.updated_at ? formatDate(row.updated_at) : "—"}
                      </td>

                      <td className="px-0 py-4">
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
                            onDownload={() => handleDownload(row as Letter)}
                            onSendForSign={() => {
                              Toast.fire({ icon: "success", title: "Sent for signature (demo)" });
                            }}
                            onDelete={() => {
                              if (!rowId) return;
                              setDeleteModal({ open: true, id: rowId });
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

        <DeleteLoiModal
          isOpen={deleteModal.open}
          onCancel={() => setDeleteModal({ open: false, id: null })}
          onConfirm={async () => {
            if (!deleteModal.id) return;

            try {
              await dispatch(deleteLOIAsync(deleteModal.id)).unwrap();
              await dispatch(getDashboardStatsAsync());
            } finally {
              setDeleteModal({ open: false, id: null });
            }
          }}
          title="Delete this LOI?"
          message="This will permanently remove the LOI and cannot be undone."
        />

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
              const isRowDownloading = downloadingId === rowId;

              return (
                <div key={rowId} className="p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {truncateWords(row.title, 3)}
                    </h3>
                    <span className={getStatusPill(row.status)}>{row.status}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    {truncateWords(row.property_address_S1, 4)}
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
