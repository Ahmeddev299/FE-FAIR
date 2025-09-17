// src/pages/dashboard/pages/lease/view/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { DashboardLayout } from "@/components/layouts";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getUserLeasesAsync } from "@/services/lease/asyncThunk";
import { selectLease } from "@/redux/slices/leaseSlice";

type SortBy = "lease_title" | "property_address" | "status" | "updatedAt";
type SortDir = "asc" | "desc";
const DEFAULT_LIMIT = 20;

type LeaseRow = {
  _id?: string;
  id?: string;
  lease_id?: string;

  lease_title?: string;
  title?: string;

  property_address?: string;
  propertyAddress?: string;

  status?: string;

  updatedAt?: string | number | Date;
  last_uppdated_date?: string | number | Date; // backend typo safeguard
  startDate?: string | number | Date;
  endDate?: string | number | Date;
};

const StatusPill: React.FC<{ value?: string }> = ({ value }) => {
  const s = (value || "").toLowerCase();
  const base = "inline-flex px-2 py-1 text-xs font-medium rounded-full";
  const map: Record<string, string> = {
    available: `${base} bg-green-100 text-green-800`,
    pending: `${base} bg-yellow-100 text-yellow-800`,
    active: `${base} bg-blue-100 text-blue-800`,
    "in review": `${base} bg-purple-100 text-purple-800`,
    terminated: `${base} bg-red-100 text-red-800`,
  };
  return <span className={map[s] || `${base} bg-gray-100 text-gray-800`}>{value || "Active"}</span>;
};

const SortIcon: React.FC<{ active: boolean; dir: SortDir }> = ({ active, dir }) => {
  if (!active) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
  return dir === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
};

const truncateWords = (text?: string, limit = 4) => {
  if (!text) return "—";
  const words = text.trim().split(/\s+/);
  return words.length > limit ? words.slice(0, limit).join(" ") + "…" : text;
};

export default function LeaseListPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { leaseList, isLoading } = useAppSelector(selectLease);

  // read QS
  const qsPage = Number(router.query.page ?? 1);
  const qsQ = (router.query.q as string) || "";
  const qsStatus = (router.query.status as string) || "";
  const qsSortBy = (router.query.sortBy as SortBy) || "updatedAt";
  const qsSortDir = (router.query.sortDir as SortDir) || "desc";
  const qsLimit = Number(router.query.limit ?? DEFAULT_LIMIT);

  // state
  const [page, setPage] = useState(qsPage);
  const [q, setQ] = useState(qsQ);
  const [debouncedQ, setDebouncedQ] = useState(qsQ);
  const [status, setStatus] = useState(qsStatus);
  const [sortBy, setSortBy] = useState<SortBy>(qsSortBy);
  const [sortDir, setSortDir] = useState<SortDir>(qsSortDir);
  const [limit, setLimit] = useState(qsLimit);

  // data fetch
  useEffect(() => {
    dispatch(getUserLeasesAsync());
  }, [dispatch]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  // filter/sort
  const filtered = useMemo<LeaseRow[]>(() => {
    const data: LeaseRow[] = (leaseList?.data as LeaseRow[]) || [];
    const needle = debouncedQ.toLowerCase();

    return data
      .filter((row) => {
        const title = (row.lease_title || row.title || "").toLowerCase();
        const addr = (row.property_address || row.propertyAddress || "").toLowerCase();
        const okSearch = !needle || title.includes(needle) || addr.includes(needle);
        const s = (row.status || "").toLowerCase();
        const okStatus = !status || s === status.toLowerCase();
        return okSearch && okStatus;
      })
      .sort((a, b) => {
        const A: string | number =
          sortBy === "lease_title"
            ? (a.lease_title || a.title || "")
            : sortBy === "property_address"
              ? (a.property_address || a.propertyAddress || "")
              : sortBy === "status"
                ? (a.status || "")
                : new Date(a.updatedAt || a.last_uppdated_date || a.endDate || a.startDate || 0).getTime();

        const B: string | number =
          sortBy === "lease_title"
            ? (b.lease_title || b.title || "")
            : sortBy === "property_address"
              ? (b.property_address || b.propertyAddress || "")
              : sortBy === "status"
                ? (b.status || "")
                : new Date(b.updatedAt || b.last_uppdated_date || b.endDate || b.startDate || 0).getTime();

        if (typeof A === "number" && typeof B === "number") {
          return sortDir === "asc" ? A - B : B - A;
        }
        return sortDir === "asc" ? String(A).localeCompare(String(B)) : String(B).localeCompare(String(A));
      });
  }, [leaseList?.data, debouncedQ, status, sortBy, sortDir]);

  // paging
  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const pageRows = filtered.slice(start, end);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // sync QS
  useEffect(() => {
    router.replace("/dashboard/pages/lease/view", undefined, { shallow: true });
  }, [page, limit, debouncedQ, status, sortBy, sortDir, router]);


  // handlers
  const onHeaderSort = (key: SortBy) => {
    if (key === sortBy) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortBy(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const openDetail = (id: string | number) => {
    if (!id) return;
    router.push(`/dashboard/pages/lease/view/${id}`);
  };

  const resetAll = () => {
    setQ("");
    setStatus("");
    setSortBy("updatedAt");
    setSortDir("desc");
    setLimit(DEFAULT_LIMIT);
    setPage(1);
  };

  return (
    <DashboardLayout>
      {isLoading ? (
        <LoadingOverlay visible />
      ) : (
        <div className="p-4 sm:p-6">
          {/* SIMPLE HEADER */}
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Leases</h1>
          </div>

          {/* SIMPLE FILTER BAR */}
          <div className="mb-4 bg-white rounded p-3 sm:p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* Search */}
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by lease title or address..."
                className="md:col-span-3 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Status */}
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="Available">Available</option>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="In Review">In Review</option>
                <option value="Terminated">Terminated</option>
              </select>

              {/* Rows */}
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Rows per page"
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset link (small, optional) */}
            {(q || status || sortBy !== "updatedAt" || sortDir !== "desc" || limit !== DEFAULT_LIMIT) && (
              <div className="mt-2">
                <button onClick={resetAll} className="text-sm text-gray-600 hover:underline">
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* TABLE */}
          <div className="bg-white rounded">
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
                    <th className="px-5 py-3 cursor-pointer select-none" onClick={() => onHeaderSort("lease_title")}>
                      <div className="inline-flex items-center gap-1">
                        Lease Title <SortIcon active={sortBy === "lease_title"} dir={sortDir} />
                      </div>
                    </th>
                    <th className="px-5 py-3 cursor-pointer select-none" onClick={() => onHeaderSort("status")}>
                      <div className="inline-flex items-center gap-1">
                        Status <SortIcon active={sortBy === "status"} dir={sortDir} />
                      </div>
                    </th>
                    <th className="px-5 py-3 cursor-pointer select-none" onClick={() => onHeaderSort("updatedAt")}>
                      <div className="inline-flex items-center gap-1">
                        Last Updated <SortIcon active={sortBy === "updatedAt"} dir={sortDir} />
                      </div>
                    </th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {!isLoading && pageRows.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-500">
                        No records found
                      </td>
                    </tr>
                  )}

                  {!isLoading &&
                    pageRows.map((row) => {
                      const id = row._id || row.lease_id || row.id || "";
                      const title = row.lease_title || row.title || "";
                      const updated = row.updatedAt || row.last_uppdated_date || row.endDate || row.startDate;

                      return (
                        <tr key={id} className="hover:bg-gray-50">
                          <td className="px-5 py-4 text-sm font-medium text-gray-900">{truncateWords(title, 6)}</td>
                          <td className="px-5 py-4">
                            <StatusPill value={row.status} />
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600">
                            {updated ? new Date(updated).toLocaleString() : "—"}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => openDetail(id)}
                              className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-50"
                            >
                              See details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* MOBILE LIST */}
            <div className="lg:hidden p-3 space-y-3">
              {!isLoading && pageRows.length === 0 && (
                <div className="text-center text-sm text-gray-500 py-6">No records found</div>
              )}
              {!isLoading &&
                pageRows.map((row) => {
                  const id = row.lease_id ?? row._id ?? row.id ?? "";
                  const title = row.lease_title || row.title || "";
                  const updated = row.updatedAt || row.last_uppdated_date || row.endDate || row.startDate;

                  return (
                    <div key={id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-medium text-gray-900">{truncateWords(title, 8)}</div>
                        <StatusPill value={row.status} />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{updated ? new Date(updated).toLocaleString() : "—"}</div>
                      <div className="mt-3">
                        <button
                          onClick={() => openDetail(id)}
                          className="w-full px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
                        >
                          See details
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* PAGER */}
            <div className="px-4 py-3 border-t flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Page {page} of {totalPages} • {total} items
              </div>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
