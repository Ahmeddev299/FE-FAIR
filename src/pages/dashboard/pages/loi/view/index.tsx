"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter as Funnel,
  ChevronDown,
  MoreVertical,
  Eye,
  Send,
  Trash2,
  X,
} from "lucide-react";

import { DashboardLayout } from "@/components/layouts";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

// DASHBOARD fetch (your existing async thunk)
import { getDashboardStatsAsync, getloiDataAsync } from "@/services/dashboard/asyncThunk";
// LOI thunks for delete & refresh list in its slice
import { deleteLOIAsync } from "@/services/loi/asyncThunk";

import Toast from "@/components/Toast";

// -------------------- types --------------------

type SortBy = "title" | "propertyAddress" | "status" | "updatedAt";
type SortDir = "asc" | "desc";

type LoiRow = {
  _id?: string;
  id?: string;
  title?: string;
  propertyAddress?: string;
  property_address?: string;
  status?: string;
  updatedAt?: string | number;
};

const DEFAULT_LIMIT = 10;

// -------------------- tiny UI atoms --------------------

const Pill: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = "", children }) => (
  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${className}`}>
    {children}
  </span>
);

const StatusPill: React.FC<{ value?: string }> = ({ value }) => {
  const s = (value || "Active").toLowerCase();
  const map: Record<string, string> = {
    available: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
    pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
    active: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
    "in review": "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200",
    terminated: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
    approved: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
    sent: "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-200",
  };
  return <Pill className={map[s] || "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-200"}>{value || "Active"}</Pill>;
};

const SortIcon: React.FC<{ active: boolean; dir: SortDir }> = ({ active, dir }) => {
  if (!active) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
  return dir === "asc" ? <ArrowUp className="w-4 h-4 text-gray-600" /> : <ArrowDown className="w-4 h-4 text-gray-600" />;
};

const ChipSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = "", children, ...rest }) => (
  <div className="relative">
    <select
      {...rest}
      className={`h-10 rounded-xl border border-gray-300 bg-white pl-3 pr-8 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${className}`}
    >
      {children}
    </select>
    <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
  </div>
);

const FilterLabel: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center text-sm text-gray-600">
    <Funnel className="w-4 h-4 mr-1.5 text-gray-500" />
    {children ?? "Filters:"}
  </span>
);

const truncateWords = (text?: string, limit = 6) => {
  if (!text) return "—";
  const words = text.trim().split(/\s+/);
  return words.length > limit ? words.slice(0, limit).join(" ") + "…" : text;
};

const Pager: React.FC<{
  page: number;
  total: number;
  limit: number;
  onPage: (p: number) => void;
}> = ({ page, total, limit, onPage }) => {
  const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || DEFAULT_LIMIT)));
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm text-gray-500">
        Page {page} of {totalPages} • {total} items
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="h-9 px-3 rounded-md border border-gray-300 bg-white text-sm disabled:opacity-50 hover:bg-gray-50"
        >
          Prev
        </button>
        <button
          onClick={() => onPage(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="h-9 px-3 rounded-md border border-gray-300 bg-white text-sm disabled:opacity-50 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// -------------------- Row Action Menu --------------------

const RowActionMenu: React.FC<{
  open: boolean;
  x: number;
  y: number;
  onClose: () => void;
  onView: () => void;
  onSendForSign: () => void;
  onDelete: () => void;
}> = ({ open, x, y, onClose, onView, onSendForSign, onDelete }) => {
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

  const item = "flex items-center gap-3 px-3 py-2 text-[15px] text-slate-800 hover:bg-slate-50 transition";

  return (
    <div
      ref={menuRef}
      style={{ position: "fixed", top: y + 8, left: x - 8, zIndex: 50 }}
      className="w-[200px] rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
      role="menu"
      aria-label="Actions"
    >
      <div className="px-3 py-2 text-xs font-semibold text-slate-500">Actions</div>
      <button className={item} onClick={() => { onView(); onClose(); }}>
        <Eye className="w-4 h-4" /> View
      </button>
      <div className="h-px bg-slate-100" />
   
      <div className="h-px bg-slate-100" />
      <button className={item} onClick={() => { onSendForSign(); onClose(); }}>
        <Send className="w-4 h-4" /> Send for Sign
      </button>
      <div className="h-px bg-slate-100" />
      <button className={`${item} text-rose-600 hover:bg-rose-50`} onClick={() => { onDelete(); onClose(); }}>
        <Trash2 className="w-4 h-4" /> Delete
      </button>
    </div>
  );
};

// -------------------- Delete Modal --------------------

const DeleteLoiModal: React.FC<{
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}> = ({ isOpen, onConfirm, onCancel, title = "Delete this LOI?", message = "This action cannot be undone." }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="flex items-center justify-center pt-6 pb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none">
              <path d="M6 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M9 7v-.5a2.5 2.5 0 0 1 2.5-2.5h1A2.5 2.5 0 0 1 15 6.5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M7 7l1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{title}</h3>
          <p className="text-sm text-gray-600 text-center mb-6">{message}</p>
          <div className="space-y-3">
            <button
              onClick={onConfirm}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Delete
            </button>
            <button
              onClick={onCancel}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------- Page --------------------

export default function LoiListPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // ---- read from QS ----
  const qsPage = Number(router.query.page ?? 1);
  const qsQ = (router.query.q as string) || "";
  const qsStatus = (router.query.status as string) || "";
  const qsSortBy = (router.query.sortBy as SortBy) || "updatedAt";
  const qsSortDir = (router.query.sortDir as SortDir) || "desc";
  const qsLimit = Number(router.query.limit ?? DEFAULT_LIMIT);

  // ---- UI state ----
  const [page, setPage] = useState<number>(qsPage);
  const [q, setQ] = useState<string>(qsQ);
  const [status, setStatus] = useState<string>(qsStatus);
  const [sortBy, setSortBy] = useState<SortBy>(qsSortBy);
  const [sortDir, setSortDir] = useState<SortDir>(qsSortDir);
  const [limit, setLimit] = useState<number>(qsLimit);
  const [menuState, setMenuState] = useState<{ id: string | null; x: number; y: number }>({ id: null, x: 0, y: 0 });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

  // SOURCE: dashboard slice
  const { myLOIs, isLoading } = useAppSelector((s) => s.dashboard);

  // fetch
  useEffect(() => {
    dispatch(getloiDataAsync());
  }, [dispatch]);

  // keep QS in sync
  useEffect(() => {
    const query: Record<string, string | SortBy | SortDir | undefined> = {
      page: String(page),
      q: q || undefined,
      status: status || undefined,
      sortBy,
      sortDir,
      limit: String(limit),
    };
    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, q, status, sortBy, sortDir, limit]);

  const onHeaderSort = (key: SortBy) => {
    if (key === sortBy) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortBy(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const clearFilters = () => {
    setQ("");
    setStatus("");
    setSortBy("updatedAt");
    setSortDir("desc");
    // if you added router.query date/type, clear them too:
    const {  ...rest } = router.query;
    router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
    setPage(1);
  };

  const openDetail = (id?: string) => {
    if (!id) return;
    router.push(`/dashboard/pages/loi/view/${id}`);
  };

  // ---------- core: compute rows ----------
  const { pagedRows, total } = useMemo(() => {
    const rows: LoiRow[] = Array.isArray(myLOIs) ? (myLOIs as LoiRow[]) : [];

    const qLower = q.trim().toLowerCase();
    const filtered = rows.filter((r) => {
      const matchesQ =
        !qLower ||
        (r?.title ?? "").toString().toLowerCase().includes(qLower) ||
        (r?.propertyAddress ?? r?.property_address ?? "").toString().toLowerCase().includes(qLower);
      const matchesStatus = !status || (r?.status ?? "").toString().toLowerCase() === status.toLowerCase();
      return matchesQ && matchesStatus;
    });

    const dir = sortDir === "asc" ? 1 : -1;
    const getSortValue = (r: LoiRow): string | number => {
      switch (sortBy) {
        case "updatedAt":
          return new Date(r?.updatedAt ?? 0).getTime();
        case "title":
          return (r?.title ?? "").toString().toLowerCase();
        case "propertyAddress":
          return (r?.propertyAddress ?? r?.property_address ?? "").toString().toLowerCase();
        case "status":
        default:
          return (r?.status ?? "").toString().toLowerCase();
      }
    };
    filtered.sort((a, b) => {
      const va = getSortValue(a);
      const vb = getSortValue(b);
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });

    const totalCount = filtered.length;
    const start = (page - 1) * (limit || DEFAULT_LIMIT);
    const end = start + (limit || DEFAULT_LIMIT);
    return { pagedRows: filtered.slice(start, end), total: totalCount };
  }, [myLOIs, q, status, sortBy, sortDir, page, limit]);

  // ensure page valid
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(total / (limit || DEFAULT_LIMIT)));
    if (page > maxPage) setPage(maxPage);
  }, [total, page, limit]);

  const handleSendForSign = async (row: LoiRow) => {
    // route to your e-sign flow with id param
    const id = row._id || row.id;
    if (!id) return;
    Toast.fire({ icon: "success", title: "Sent for signature (demo)" });
    // router.push(`/dashboard/e-signature/start?loiId=${id}`)
  };
  const handleDelete = (row: LoiRow) => {
    const id = row._id || row.id;
    if (!id) return;
    setDeleteModal({ open: true, id });
  };

  return (
    <DashboardLayout>
      {isLoading ? (
        <LoadingOverlay visible />
      ) : (
        <div className="mx-auto max-w-7xl p-4 sm:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Letters of Intent</h1>
              <p className="mt-1 text-sm text-gray-500">Search, filter, and sort your LOIs.</p>
            </div>
            <button
              onClick={() => router.push("/dashboard/pages/createform")}
              className="h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700"
            >
              + New LOI
            </button>
          </div>

          {/* Filters bar */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="w-full lg:max-w-lg">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={q}
                    onChange={(e) => { setQ(e.target.value); setPage(1); }}
                    placeholder="Search by title or address..."
                    className="h-10 w-full rounded-xl border border-gray-300 bg-white pl-9 pr-9 text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {!!q && (
                    <button
                      onClick={() => { setQ(""); setPage(1); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 flex-wrap">
                <FilterLabel>Filters:</FilterLabel>

                <ChipSelect value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                  <option value="">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="In Review">In Review</option>
                  <option value="Terminated">Terminated</option>
                </ChipSelect>

                {/* Date filter placeholder; wire to your real state if needed */}
                <ChipSelect value={(router.query.date as string) || ""} onChange={(e) => {
                  const date = e.target.value || undefined;
                  router.replace({ pathname: router.pathname, query: { ...router.query, date } }, undefined, { shallow: true });
                  setPage(1);
                }}>
                  <option value="">All Dates</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="ytd">Year to date</option>
                </ChipSelect>

                {/* Type filter placeholder */}
                <ChipSelect value={(router.query.type as string) || ""} onChange={(e) => {
                  const type = e.target.value || undefined;
                  router.replace({ pathname: router.pathname, query: { ...router.query, type } }, undefined, { shallow: true });
                  setPage(1);
                }}>
                  <option value="">All Types</option>
                  <option value="LOI">LOI</option>
                  <option value="Lease">Lease</option>
                  <option value="Notice">Notice</option>
                  <option value="Termination">Termination</option>
                </ChipSelect>

                <div className="flex items-center gap-2 ml-1">
                  <span className="text-sm text-gray-600">Rows</span>
                  <ChipSelect value={String(limit)} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="w-[76px] text-center">
                    {[10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                  </ChipSelect>
                </div>

                {(q || status || sortBy !== "updatedAt" || sortDir !== "desc" || router.query.date || router.query.type) && (
                  <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline ml-auto">
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table card */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Desktop */}
            <div className="hidden lg:block">
              <div className="max-h-[60vh] overflow-auto rounded-xl">
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-gray-50 text-gray-600">
                    <tr className="uppercase text-xs font-semibold">
                      <th className="px-5 py-3 text-left cursor-pointer select-none" onClick={() => onHeaderSort("title")}>
                        <div className="inline-flex items-center gap-1">
                          LOI Title <SortIcon active={sortBy === "title"} dir={sortDir} />
                        </div>
                      </th>
                      <th className="px-5 py-3 text-left cursor-pointer select-none" onClick={() => onHeaderSort("propertyAddress")}>
                        <div className="inline-flex items-center gap-1">
                          Property Address <SortIcon active={sortBy === "propertyAddress"} dir={sortDir} />
                        </div>
                      </th>
                      <th className="px-5 py-3 text-left cursor-pointer select-none" onClick={() => onHeaderSort("status")}>
                        <div className="inline-flex items-center gap-1">
                          Status <SortIcon active={sortBy === "status"} dir={sortDir} />
                        </div>
                      </th>
                  
                      <th className="px-5 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pagedRows.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                          No records found
                        </td>
                      </tr>
                    ) : (
                      pagedRows.map((row, idx) => {
                        const rowId = String(row._id || row.id || idx);
                        const id = row._id || row.id;

                        return (
                          <tr key={rowId} className="hover:bg-gray-50">
                            <td className="px-5 py-4 font-medium text-gray-900">{truncateWords(row.title, 8)}</td>
                            <td className="px-5 py-4 text-gray-700">{truncateWords(row.propertyAddress ?? row.property_address, 10)}</td>
                            <td className="px-5 py-4"><StatusPill value={row.status} /></td>
                     
                            <td className="px-5 py-4">
                              <div className="relative">
                                <button
                                  className="h-9 w-9 inline-flex items-center justify-center rounded-md  border-slate-200 hover:bg-slate-50"
                                  aria-haspopup="menu"
                                  aria-expanded={menuState.id === id}
                                  onClick={(e) => {
                                    const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                                    setMenuState((cur) =>
                                      cur.id === id ? { id: null, x: 0, y: 0 } : { id: id ?? rowId, x: r.left, y: r.bottom }
                                    );
                                  }}
                                >
                                  <MoreVertical className="w-4 h-4 text-slate-600" />
                                </button>
                                <RowActionMenu
                                  open={menuState.id === (id ?? rowId)}
                                  x={menuState.x}
                                  y={menuState.y}
                                  onClose={() => setMenuState({ id: null, x: 0, y: 0 })}
                                  onView={() => openDetail(id)}
                                  onSendForSign={() => handleSendForSign(row)}
                                  onDelete={() => handleDelete(row)}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile list */}
            <div className="lg:hidden p-3 space-y-3">
              {pagedRows.length === 0 ? (
                <div className="text-center text-sm text-gray-500 py-6">No records found</div>
              ) : (
                pagedRows.map((row, idx) => {
                  const id = row._id || row.id;
                  return (
                    <div key={String(id ?? idx)} className="rounded-lg border border-gray-200 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">{truncateWords(row.title, 8)}</div>
                          <div className="text-sm text-gray-700">{truncateWords(row.propertyAddress ?? row.property_address, 10)}</div>
                          <StatusPill value={row.status} />
                        </div>
                        <button
                          className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50"
                          onClick={(e) => {
                            const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                            setMenuState({ id: id ?? String(idx), x: r.left, y: r.bottom });
                          }}
                        >
                          <MoreVertical className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-200">
              <Pager page={page} total={total} limit={limit} onPage={(p) => setPage(p)} />
            </div>
          </div>

          {/* Delete modal */}
          <DeleteLoiModal
            isOpen={deleteModal.open}
            onCancel={() => setDeleteModal({ open: false, id: null })}
            onConfirm={async () => {
              const id = deleteModal.id;
              if (!id) return;
              try {
                await dispatch(deleteLOIAsync(id)).unwrap();
                // refresh the dashboard list (and any other slice that needs it)
                await dispatch(getDashboardStatsAsync()).unwrap().catch(() => {});
                Toast.fire({ icon: "success", title: "LOI deleted" });
              } catch (err: any) {
                Toast.fire({ icon: "error", title: err?.message || "Delete failed" });
              } finally {
                setDeleteModal({ open: false, id: null });
              }
            }}
            title="Delete this LOI?"
            message="This will permanently remove the LOI and cannot be undone."
          />

        </div>
      )}
    </DashboardLayout>
  );
}
