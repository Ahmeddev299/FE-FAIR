import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, X } from "lucide-react";
import { DashboardLayout } from "@/components/layouts";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getUserLeasesAsync } from "@/services/lease/asyncThunk"; // you already have this

type SortBy = "lease_title" | "property_address" | "status" | "updatedAt";
type SortDir = "asc" | "desc";

const DEFAULT_LIMIT = 10;

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

  const { leaseList, isLoading, leaseError } = useAppSelector((s: any) => s.lease);
  console.log("leaseList", leaseList)

  // QS-aware UI state
  const qsPage = Number(router.query.page ?? 1);
  const qsQ = (router.query.q as string) || "";
  const qsStatus = (router.query.status as string) || "";
  const qsSortBy = (router.query.sortBy as SortBy) || "updatedAt";
  const qsSortDir = (router.query.sortDir as SortDir) || "desc";
  const qsLimit = Number(router.query.limit ?? DEFAULT_LIMIT);

  const [page, setPage] = useState(qsPage);
  const [q, setQ] = useState(qsQ);
  const [debouncedQ, setDebouncedQ] = useState(qsQ);
  const [status, setStatus] = useState(qsStatus);
  const [sortBy, setSortBy] = useState<SortBy>(qsSortBy);
  const [sortDir, setSortDir] = useState<SortDir>(qsSortDir);
  const [limit, setLimit] = useState(qsLimit);

  useEffect(() => {
    // fetch full list once; pagination/search/sort happen client-side
    dispatch(getUserLeasesAsync());
  }, [dispatch]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  // filter + sort client-side (adjust to server params when your API supports it)
  const filtered = useMemo(() => {
    const needle = debouncedQ.toLowerCase();
    return (leaseList.data || [])
      .filter((row: any) => {
        const title = (row.lease_title || row.title || "").toLowerCase();
        const addr = (row.property_address || row.propertyAddress || "").toLowerCase();
        const okSearch = !needle || title.includes(needle) || addr.includes(needle);
        const s = (row.status || "").toLowerCase();
        const okStatus = !status || s === status.toLowerCase();
        return okSearch && okStatus;
      })
      .sort((a: any, b: any) => {
        const A =
          sortBy === "lease_title" ? (a.lease_title || a.title || "") :
            sortBy === "property_address" ? (a.property_address || a.propertyAddress || "") :
              sortBy === "status" ? (a.status || "") :
                new Date(a.updatedAt || a.endDate || a.startDate || 0).getTime();
        const B =
          sortBy === "lease_title" ? (b.lease_title || b.title || "") :
            sortBy === "property_address" ? (b.property_address || b.propertyAddress || "") :
              sortBy === "status" ? (b.status || "") :
                new Date(b.updatedAt || b.endDate || b.startDate || 0).getTime();

        if (typeof A === "number" && typeof B === "number") {
          return sortDir === "asc" ? A - B : B - A;
        }
        return sortDir === "asc"
          ? String(A).localeCompare(String(B))
          : String(B).localeCompare(String(A));
      });
  }, [leaseList.data, debouncedQ, status, sortBy, sortDir]);

  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const pageRows = filtered.slice(start, end);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    // keep QS in sync
    router.replace({
      pathname: "/dashboard/pages/lease/view",
      query: {
        page, limit,
        q: debouncedQ || undefined,
        status: status || undefined,
        sortBy, sortDir,
      },
    }, undefined, { shallow: true });
  }, [page, limit, debouncedQ, status, sortBy, sortDir]);

  const onHeaderSort = (key: SortBy) => {
    if (key === sortBy) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortBy(key); setSortDir("asc"); }
    setPage(1);
  };

  const clearFilters = () => {
    setQ(""); setStatus(""); setSortBy("updatedAt"); setSortDir("desc"); setPage(1);
  };

  const openDetail = (id?: | number) => {
    console.log("id", id)
    if (!id) return; // guard
    router.push({ pathname: "/dashboard/pages/lease/view/[id]", query: { id } });
  };
  return (
    <DashboardLayout>
      {isLoading ? (<LoadingOverlay isVisible message="Loading leases..." size="large" />) : (

        <div className="p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Leases</h1>
              <p className="text-sm text-gray-500">Search, filter, and sort your leases.</p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-4 bg-white rounded  p-3 sm:p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={q}
                    onChange={(e) => { setQ(e.target.value); setPage(1); }}
                    placeholder="Search by lease title or address..."
                    className="w-full pl-9 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {q && (
                    <button onClick={() => { setQ(""); setPage(1); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className="relative">
                  <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                    className="w-full pl-9 pr-3 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="In Review">In Review</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500">Rows</label>
                <select
                  value={limit}
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                  className="border rounded-lg px-2 py-2"
                >
                  {[10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                {(q || status || sortBy !== "updatedAt" || sortDir !== "desc") && (
                  <button onClick={clearFilters} className="ml-auto text-sm text-gray-600 hover:underline">
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Error */}
          {leaseError && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {String(leaseError)}
            </div>
          )}

          {/* Table */}
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
                    <th className="px-5 py-3 cursor-pointer select-none" onClick={() => onHeaderSort("property_address")}>
                      <div className="inline-flex items-center gap-1">
                        Property Address <SortIcon active={sortBy === "property_address"} dir={sortDir} />
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
                  {isLoading && Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`sk-${i}`}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className={`h-${j === 4 ? 8 : 4} ${j === 4 ? 'w-20' : ''} bg-gray-100 rounded animate-pulse`} />
                        </td>
                      ))}
                    </tr>
                  ))}

                  {!isLoading && pageRows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-500">
                        <LoadingOverlay isVisible message="Loading leases..." />
                      </td>
                    </tr>
                  )}

                  {!isLoading && pageRows.map((row: any) => {
                    const id = row._id || row.lease_id;
                    const title = row.lease_title || row.title;
                    const addr = row.property_addess || row.propertyAddress;
                    const updated = row.last_uppdated_date || row.endDate || row.startDate;
                    return (
                      <tr key={id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 text-sm font-medium text-gray-900">{truncateWords(title, 4)}</td>
                        <td className="px-5 py-4 text-sm text-gray-600">{truncateWords(addr, 5)}</td>
                        <td className="px-5 py-4"><StatusPill value={row.status} /></td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {updated ? new Date(updated).toLocaleString() : "—"}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button onClick={() => openDetail(id)} className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-50">
                            See details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden p-3 space-y-3">
              {!isLoading && pageRows.length === 0 && (
                <div className="text-center text-sm text-gray-500 py-6">No records found</div>
              )}
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <div key={`msk-${i}`} className="p-4 border rounded-lg">
                  <div className="h-4 bg-gray-100 rounded animate-pulse mb-2" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
                </div>
              ))}
              {!isLoading && pageRows.map((row: any) => {
                const id = row.lease_id ?? row._id ?? row.id;
                console.log("id", id)
                const title = row.lease_title || row.title;
                const addr = row.property_address || row.propertyAddress;
                const updated = row.updatedAt || row.endDate || row.startDate;
                return (
                  <div key={id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium text-gray-900">{truncateWords(title, 6)}</div>
                      <StatusPill value={row.status} />
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{truncateWords(addr, 10)}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {updated ? new Date(updated).toLocaleString() : "—"}
                    </div>
                    <div className="mt-3">
                      <button onClick={() => openDetail(id)} className="w-full px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
                        See details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pager */}
            <div className="px-4 py-3 border-t flex items-center justify-between">
              <div className="text-sm text-gray-500">Page {page} of {totalPages} • {total} items</div>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1.5 border rounded disabled:opacity-50">Prev</button>
                <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1.5 border rounded disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
