// // import React, { useEffect, useMemo, useState } from "react";
// // import { useRouter } from "next/router";
// // import { ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, X } from "lucide-react";
// // import { DashboardLayout } from "@/components/layouts";
// // import { LoadingOverlay } from "@/components/loaders/overlayloader";
// // import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
// // import { getloiDataAsync } from "@/services/dashboard/asyncThunk"

// // type SortBy = "title" | "propertyAddress" | "status" | "updatedAt";
// // type SortDir = "asc" | "desc";

// // const DEFAULT_LIMIT = 10;

// // // Small pill helper
// // const StatusPill: React.FC<{ value?: string }> = ({ value }) => {
// //   const s = (value || "").toLowerCase();
// //   const base = "inline-flex px-2 py-1 text-xs font-medium rounded-full";
// //   const map: Record<string, string> = {
// //     available: `${base} bg-green-100 text-green-800`,
// //     pending: `${base} bg-yellow-100 text-yellow-800`,
// //     active: `${base} bg-blue-100 text-blue-800`,
// //     "in review": `${base} bg-purple-100 text-purple-800`,
// //     terminated: `${base} bg-red-100 text-red-800`,
// //   };
// //   return <span className={map[s] || `${base} bg-gray-100 text-gray-800`}>{value || "Active"}</span>;
// // };

// // const truncateWords = (text?: string, limit = 4) => {
// //   if (!text) return "—";
// //   const words = text.trim().split(/\s+/);
// //   return words.length > limit ? words.slice(0, limit).join(" ") + "…" : text;
// // };

// // // Compact reusable pagination
// // const Pager: React.FC<{
// //   page: number; total: number; limit: number; onPage: (p: number) => void;
// // }> = ({ page, total, limit, onPage }) => {
// //   const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || DEFAULT_LIMIT)));
// //   return (
// //     <div className="flex items-center justify-between gap-3 flex-wrap">
// //       <div className="text-sm text-gray-500">Page {page} of {totalPages} • {total} items</div>
// //       <div className="flex items-center gap-2">
// //         <button
// //           onClick={() => onPage(Math.max(1, page - 1))}
// //           disabled={page <= 1}
// //           className="px-3 py-1.5 border rounded disabled:opacity-50"
// //         >
// //           Prev
// //         </button>
// //         <button
// //           onClick={() => onPage(Math.min(totalPages, page + 1))}
// //           disabled={page >= totalPages}
// //           className="px-3 py-1.5 border rounded disabled:opacity-50"
// //         >
// //           Next
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // const SortIcon: React.FC<{ active: boolean; dir: SortDir }> = ({ active, dir }) => {
// //   if (!active) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
// //   return dir === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
// // };

// // export default function LoiListPage() {
// //   const router = useRouter();
// //   const dispatch = useAppDispatch();

// //   // ----- read from QS (bookmarks/sharing) -----
// //   const qsPage = Number(router.query.page ?? 1);
// //   const qsQ = (router.query.q as string) || "";
// //   const qsStatus = (router.query.status as string) || "";
// //   const qsSortBy = (router.query.sortBy as SortBy) || "updatedAt";
// //   const qsSortDir = (router.query.sortDir as SortDir) || "desc";
// //   const qsLimit = Number(router.query.limit ?? DEFAULT_LIMIT);

// //   // ----- local UI state -----
// //   const [page, setPage] = useState(qsPage);
// //   const [q, setQ] = useState(qsQ);
// //   // const [debouncedQ, setDebouncedQ] = useState(qsQ); // debounce search
// //   const [status, setStatus] = useState(qsStatus);
// //   const [sortBy, setSortBy] = useState<SortBy>(qsSortBy);
// //   const [sortDir, setSortDir] = useState<SortDir>(qsSortDir);
// //   const [limit, setLimit] = useState(qsLimit);

// //   const { myLOIs, isLoading, } =
// //     useAppSelector((state) => state.dashboard); 

// // const total = (myLOIs ?? []).length;

// //   // ----- fetch when params change -----
// //   useEffect(() => {
// //     dispatch(getloiDataAsync());
// //   }, [dispatch]);

// //   const onHeaderSort = (key: SortBy) => {
// //     if (key === sortBy) {
// //       setSortDir(sortDir === "asc" ? "desc" : "asc");
// //     } else {
// //       setSortBy(key);
// //       setSortDir("asc");
// //     }
// //     setPage(1);
// //   };

// //   const clearFilters = () => {
// //     setQ("");
// //     setStatus("");
// //     setSortBy("updatedAt");
// //     setSortDir("desc");
// //     setPage(1);
// //   };

// //   const openDetail = (id?: string) => {
// //     if (!id) return;
// //     router.push(`/dashboard/pages/loi/view/${id}`);
// //   };

// //   const tableRows = useMemo(() => myLOIs || [], [myLOIs]);

// //   return (
// //     <DashboardLayout>
// //       {isLoading ? <LoadingOverlay isVisible /> : (
// //         <div className="p-4 sm:p-6">
// //           {/* Header */}
// //           <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
// //             <div>
// //               <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Letters of Intent</h1>
// //               <p className="text-sm text-gray-500">Search, filter, and sort your LOIs.</p>
// //             </div>
// //             <div className="flex items-center gap-2">
// //               <button
// //                 onClick={() => router.push("/dashboard/pages/createform")}
// //                 className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
// //               >
// //                 + New LOI
// //               </button>
// //             </div>
// //           </div>

// //           {/* Filters */}
// //           <div className="mb-4 bg-white  rounded p-3 sm:p-4">
// //             <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
// //               {/* Search */}
// //               <div className="md:col-span-2">
// //                 <div className="relative">
// //                   <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
// //                   <input
// //                     value={q}
// //                     onChange={(e) => { setQ(e.target.value); setPage(1); }}
// //                     placeholder="Search by title or address..."
// //                     className="w-full pl-9 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   />
// //                   {q && (
// //                     <button
// //                       onClick={() => { setQ(""); setPage(1); }}
// //                       className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
// //                     >
// //                       <X className="w-4 h-4" />
// //                     </button>
// //                   )}
// //                 </div>
// //               </div>

// //               {/* Status */}
// //               <div>
// //                 <div className="relative">
// //                   <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
// //                   <select
// //                     value={status}
// //                     onChange={(e) => { setStatus(e.target.value); setPage(1); }}
// //                     className="w-full pl-9 pr-3 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   >
// //                     <option value="">All Status</option>
// //                     <option value="Available">Available</option>
// //                     <option value="Pending">Pending</option>
// //                     <option value="Active">Active</option>
// //                     <option value="In Review">In Review</option>
// //                     <option value="Terminated">Terminated</option>
// //                   </select>
// //                 </div>
// //               </div>

// //               {/* Page size */}
// //               <div className="flex items-center gap-2">
// //                 <label className="text-sm text-gray-500">Rows</label>
// //                 <select
// //                   value={limit}
// //                   onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
// //                   className="border rounded-lg px-2 py-2"
// //                 >
// //                   {[10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
// //                 </select>
// //                 {(q || status || sortBy !== "updatedAt" || sortDir !== "desc") && (
// //                   <button onClick={clearFilters} className="ml-auto text-sm text-gray-600 hover:underline">
// //                     Reset
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Table card */}
// //           <div className="bg-white  rounded">
// //             {/* Desktop table */}
// //             <div className="hidden lg:block overflow-x-auto">
// //               <table className="min-w-full divide-y divide-gray-100">
// //                 <thead>
// //                   <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
// //                     <th className="px-5 py-3 cursor-pointer select-none" onClick={() => onHeaderSort("title")}>
// //                       <div className="inline-flex items-center gap-1">
// //                         LOI Title
// //                         <SortIcon active={sortBy === "title"} dir={sortDir} />
// //                       </div>
// //                     </th>
// //                     <th className="px-5 py-3 cursor-pointer select-none" onClick={() => onHeaderSort("propertyAddress")}>
// //                       <div className="inline-flex items-center gap-1">
// //                         Property Address
// //                         <SortIcon active={sortBy === "propertyAddress"} dir={sortDir} />
// //                       </div>
// //                     </th>
// //                     <th className="px-5 py-3 cursor-pointer select-none" onClick={() => onHeaderSort("status")}>
// //                       <div className="inline-flex items-center gap-1">
// //                         Status
// //                         <SortIcon active={sortBy === "status"} dir={sortDir} />
// //                       </div>
// //                     </th>
// //                     {/* <th className="px-5 py-3 cursor-pointer select-none" onClick={() => onHeaderSort("updatedAt")}>
// //                       <div className="inline-flex items-center gap-1">
// //                         Last Updated
// //                         <SortIcon active={sortBy === "updatedAt"} dir={sortDir} />
// //                       </div>
// //                     </th> */}
// //                     <th className="px-5 py-3" />
// //                   </tr>
// //                 </thead>

// //                 <tbody className="divide-y divide-gray-100">
// //                   {/* skeleton */}
// //                   {/* {isLoading && <LoadingOverlay isVisible />} */}

// //                   {!isLoading && tableRows.length === 0 && (
// //                     <tr>

// //                       <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-500">
// //                         <LoadingOverlay isVisible />
// //                       </td>

// //                     </tr>
// //                   )}

// //                   {tableRows.map((row) => (
// //                     <tr key={row._id || row.id} className="hover:bg-gray-50">
// //                       <td className="px-5 py-4 text-sm font-medium text-gray-900">
// //                         {truncateWords(row.title, 4)}
// //                       </td>
// //                       <td className="px-5 py-4 text-sm text-gray-600">
// //                         {truncateWords(row.propertyAddress, 5)}
// //                       </td>
// //                       <td className="px-5 py-4"><StatusPill value={row.status} /></td>
// //                       {/* <td className="px-5 py-4 text-sm text-gray-600">
// //                         {row.updatedAt ? new Date(row.updatedAt).toLocaleString() : "—"}
// //                       </td> */}
// //                       <td className="px-5 py-4 text-right">
// //                         <button
// //                           onClick={() => openDetail(row._id || row.id)}
// //                           className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-50"
// //                         >
// //                           See details
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>

// //             {/* Mobile cards */}
// //             <div className="lg:hidden p-3 space-y-3">


// //               {tableRows.length === 0 && (
// //                 <div className="text-center text-sm text-gray-500 py-6">No records found</div>
// //               )}

// //               {tableRows.map((row) => (
// //                 <tr key={row._id || row.id} className="hover:bg-gray-50">
// //                   <td className="px-5 py-4 text-sm font-medium text-gray-900">
// //                     {truncateWords(row.title, 4)}
// //                   </td>
// //                   <td className="px-5 py-4 text-sm text-gray-600">
// //                     {truncateWords(row.propertyAddress, 5)}
// //                   </td>
// //                   <td className="px-5 py-4"><StatusPill value={row.status} /></td>
// //                   <td className="px-5 py-4 text-right">
// //                     <button
// //                       onClick={() => openDetail(row._id || row.id)}
// //                       className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-50"
// //                     >
// //                       See details
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))}

// //             </div>

// //             {/* Footer / Pager */}
// //             <div className="px-4 py-3 border-t">
// //               <Pager
// //                 page={page}
// //                 total={total || 0}
// //                 limit={limit}
// //                 onPage={(p) => setPage(p)}
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       )
// //       }

// //     </DashboardLayout>
// //   );
// // }


// import React, { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/router";
// import { ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, X } from "lucide-react";
// import { DashboardLayout } from "@/components/layouts";
// import { LoadingOverlay } from "@/components/loaders/overlayloader";
// import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
// import { getloiDataAsync } from "@/services/dashboard/asyncThunk";

// type SortBy = "title" | "propertyAddress" | "status" | "updatedAt";
// type SortDir = "asc" | "desc";

// const DEFAULT_LIMIT = 10;

// const StatusPill: React.FC<{ value?: string }> = ({ value }) => {
//   const s = (value || "").toLowerCase();
//   const base = "inline-flex px-2 py-1 text-xs font-medium rounded-full";
//   const map: Record<string, string> = {
//     available: `${base} bg-green-100 text-green-800`,
//     pending: `${base} bg-yellow-100 text-yellow-800`,
//     active: `${base} bg-blue-100 text-blue-800`,
//     "in review": `${base} bg-purple-100 text-purple-800`,
//     terminated: `${base} bg-red-100 text-red-800`,
//   };
//   return <span className={map[s] || `${base} bg-gray-100 text-gray-800`}>{value || "Active"}</span>;
// };

// const truncateWords = (text?: string, limit = 4) => {
//   if (!text) return "—";
//   const words = text.trim().split(/\s+/);
//   return words.length > limit ? words.slice(0, limit).join(" ") + "…" : text;
// };

// const Pager: React.FC<{
//   page: number; total: number; limit: number; onPage: (p: number) => void;
// }> = ({ page, total, limit, onPage }) => {
//   const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || DEFAULT_LIMIT)));
//   return (
//     <div className="flex items-center justify-between gap-3 flex-wrap">
//       <div className="text-sm text-gray-500">Page {page} of {totalPages} • {total} items</div>
//       <div className="flex items-center gap-2">
//         <button
//           onClick={() => onPage(Math.max(1, page - 1))}
//           disabled={page <= 1}
//           className="px-3 py-1.5 border rounded disabled:opacity-50"
//         >
//           Prev
//         </button>
//         <button
//           onClick={() => onPage(Math.min(totalPages, page + 1))}
//           disabled={page >= totalPages}
//           className="px-3 py-1.5 border rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// const SortIcon: React.FC<{ active: boolean; dir: SortDir }> = ({ active, dir }) => {
//   if (!active) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
//   return dir === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
// };

// export default function LoiListPage() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();

//   // ----- read from QS (bookmarks/sharing) -----
//   const qsPage = Number(router.query.page ?? 1);
//   const qsQ = (router.query.q as string) || "";
//   const qsStatus = (router.query.status as string) || "";
//   const qsSortBy = (router.query.sortBy as SortBy) || "updatedAt";
//   const qsSortDir = (router.query.sortDir as SortDir) || "desc";
//   const qsLimit = Number(router.query.limit ?? DEFAULT_LIMIT);

//   // ----- local UI state -----
//   const [page, setPage] = useState(qsPage);
//   const [q, setQ] = useState(qsQ);
//   const [status, setStatus] = useState(qsStatus);
//   const [sortBy, setSortBy] = useState<SortBy>(qsSortBy);
//   const [sortDir, setSortDir] = useState<SortDir>(qsSortDir);
//   const [limit, setLimit] = useState(qsLimit);

//   const { myLOIs, isLoading } = useAppSelector((state) => state.dashboard);

//   // Fetch data once
//   useEffect(() => {
//     dispatch(getloiDataAsync());
//   }, [dispatch]);

//   // Keep URL in sync (shallow to avoid full reloads)
//   useEffect(() => {
//     const query = {
//       page: String(page),
//       q: q || undefined,
//       status: status || undefined,
//       sortBy,
//       sortDir,
//       limit: String(limit),
//     };
//     router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
//   }, [page, q, status, sortBy, sortDir, limit]); // eslint-disable-line react-hooks/exhaustive-deps

//   const onHeaderSort = (key: SortBy) => {
//     if (key === sortBy) {
//       setSortDir(sortDir === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(key);
//       setSortDir("asc");
//     }
//     setPage(1);
//   };

//   const clearFilters = () => {
//     setQ("");
//     setStatus("");
//     setSortBy("updatedAt");
//     setSortDir("desc");
//     setPage(1);
//   };

//   const openDetail = (id?: string) => {
//     if (!id) return;
//     router.push(`/dashboard/pages/loi/view/${id}`);
//   };

//   // ---------- core: filter + sort + paginate ----------
//   const { pagedRows, total } = useMemo(() => {
//     const rows = (myLOIs ?? []).slice(); // copy

//     // FILTER
//     const qLower = q.trim().toLowerCase();
//     const filtered = rows.filter((r: any) => {
//       const matchesQ =
//         !qLower ||
//         (r?.title || "").toString().toLowerCase().includes(qLower) ||
//         (r?.propertyAddress || "").toString().toLowerCase().includes(qLower);
//       const matchesStatus = !status || (r?.status || "").toString().toLowerCase() === status.toLowerCase();
//       return matchesQ && matchesStatus;
//     });

//     // SORT
//     const dir = sortDir === "asc" ? 1 : -1;
//     filtered.sort((a: any, b: any) => {
//       const va =
//         sortBy === "updatedAt"
//           ? new Date(a?.updatedAt || 0).getTime()
//           : (a?.[sortBy] ?? "").toString().toLowerCase();
//       const vb =
//         sortBy === "updatedAt"
//           ? new Date(b?.updatedAt || 0).getTime()
//           : (b?.[sortBy] ?? "").toString().toLowerCase();

//       if (va < vb) return -1 * dir;
//       if (va > vb) return 1 * dir;
//       return 0;
//     });

//     // PAGINATE
//     const totalCount = filtered.length;
//     const start = (page - 1) * (limit || DEFAULT_LIMIT);
//     const end = start + (limit || DEFAULT_LIMIT);
//     const slice = filtered.slice(start, end);

//     return { pagedRows: slice, total: totalCount };
//   }, [myLOIs, q, status, sortBy, sortDir, page, limit]);

//   // Ensure page is valid when filters change
//   useEffect(() => {
//     const maxPage = Math.max(1, Math.ceil(total / (limit || DEFAULT_LIMIT)));
//     if (page > maxPage) setPage(maxPage);
//   }, [total, page, limit]);

//   return (
//     <DashboardLayout>
//       {isLoading ? (
//         <LoadingOverlay isVisible />
//       ) : (
//         <div className="p-4 sm:p-6">
//           {/* Header */}
//           <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
//             <div>
//               <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Letters of Intent</h1>
//               <p className="text-sm text-gray-500">Search, filter, and sort your LOIs.</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => router.push("/dashboard/pages/createform")}
//                 className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border border-gray-300 shadow-sm bg-white hover:bg-gray-50 transition"
//               >
//                 + New LOI
//               </button>
//             </div>
//           </div>

//           {/* Filters */}
//           <div className="mb-4 bg-white rounded p-3 sm:p-4">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
//               {/* Search */}
//               <div className="md:col-span-2">
//                 <div className="relative">
//                   <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                   <input
//                     value={q}
//                     onChange={(e) => { setQ(e.target.value); setPage(1); }}
//                     placeholder="Search by title or address..."
//                     className="w-full pl-9 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   {q && (
//                     <button
//                       onClick={() => { setQ(""); setPage(1); }}
//                       className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Status */}
//               <div>
//                 <div className="relative">
//                   <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                   <select
//                     value={status}
//                     onChange={(e) => { setStatus(e.target.value); setPage(1); }}
//                     className="w-full pl-9 pr-3 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">All Status</option>
//                     <option value="Available">Available</option>
//                     <option value="Pending">Pending</option>
//                     <option value="Active">Active</option>
//                     <option value="In Review">In Review</option>
//                     <option value="Terminated">Terminated</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Page size */}
//               <div className="flex items-center gap-2">
//                 <label className="text-sm text-gray-500">Rows</label>
//                 <select
//                   value={limit}
//                   onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
//                   className="border rounded-lg px-2 py-2"
//                 >
//                   {[10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
//                 </select>
//                 {(q || status || sortBy !== "updatedAt" || sortDir !== "desc") && (
//                   <button onClick={clearFilters} className="ml-auto text-sm text-gray-600 hover:underline">
//                     Reset
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Table card */}
//           <div className="bg-white rounded">
//             {/* Desktop table */}
//             <div className="hidden lg:block overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-100">
//                 <thead>
//                   <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
//                     <th className="px-5 py-3 cursor-pointer select-none" onClick={() => onHeaderSort("title")}>
//                       <div className="inline-flex items-center gap-1">
//                         LOI Title
//                         <SortIcon active={sortBy === "title"} dir={sortDir} />
//                       </div>
//                     </th>
//                     <th className="px-5 py-3 cursor-pointer select-none" onClick={() => onHeaderSort("propertyAddress")}>
//                       <div className="inline-flex items-center gap-1">
//                         Property Address
//                         <SortIcon active={sortBy === "propertyAddress"} dir={sortDir} />
//                       </div>
//                     </th>
//                     <th className="px-5 py-3 cursor-pointer select-none" onClick={() => onHeaderSort("status")}>
//                       <div className="inline-flex items-center gap-1">
//                         Status
//                         <SortIcon active={sortBy === "status"} dir={sortDir} />
//                       </div>
//                     </th>
//                     <th className="px-5 py-3" />
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-100">
//                   {pagedRows.length === 0 && (
//                     <tr>
//                       <td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-500">
//                         No records found
//                       </td>
//                     </tr>
//                   )}

//                   {pagedRows.map((row: any) => (
//                     <tr key={row._id || row.id} className="hover:bg-gray-50">
//                       <td className="px-5 py-4 text-sm font-medium text-gray-900">
//                         {truncateWords(row.title, 4)}
//                       </td>
//                       <td className="px-5 py-4 text-sm text-gray-600">
//                         {truncateWords(row.propertyAddress, 5)}
//                       </td>
//                       <td className="px-5 py-4"><StatusPill value={row.status} /></td>
//                       <td className="px-5 py-4 text-right">
//                         <button
//                           onClick={() => openDetail(row._id || row.id)}
//                           className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-50"
//                         >
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Mobile list (fix: no <tr>/<td> outside table) */}
//             <div className="lg:hidden p-3 space-y-3">
//               {pagedRows.length === 0 && (
//                 <div className="text-center text-sm text-gray-500 py-6">No records found</div>
//               )}
//               {pagedRows.map((row: any) => (
//                 <div key={row._id || row.id} className="border rounded p-3">
//                   <div className="flex items-start justify-between gap-3">
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">{truncateWords(row.title, 6)}</div>
//                       <div className="text-sm text-gray-600">{truncateWords(row.propertyAddress, 8)}</div>
//                       <div className="mt-1"><StatusPill value={row.status} /></div>
//                     </div>
//                     <button
//                       onClick={() => openDetail(row._id || row.id)}
//                       className="h-8 px-3 border rounded-md text-sm hover:bg-gray-50"
//                     >
//                       View
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Footer / Pager */}
//             <div className="px-4 py-3 border-t">
//               <Pager page={page} total={total} limit={limit} onPage={setPage} />
//             </div>
//           </div>
//         </div>
//       )}
//     </DashboardLayout>
//   );
// }

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, X } from "lucide-react";
import { DashboardLayout } from "@/components/layouts";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getloiDataAsync } from "@/services/dashboard/asyncThunk";
import type { LoiSummary } from "@/redux/slices/dashboardSlice";

type SortBy = "title" | "propertyAddress" | "status" | "updatedAt";
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

const truncateWords = (text?: string, limit = 4) => {
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
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="text-sm text-gray-500">
        Page {page} of {totalPages} • {total} items
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-3 py-1.5 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => onPage(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="px-3 py-1.5 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const SortIcon: React.FC<{ active: boolean; dir: SortDir }> = ({ active, dir }) => {
  if (!active) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
  return dir === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
};

export default function LoiListPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // ----- read from QS (bookmarks/sharing) -----
  const qsPage = Number(router.query.page ?? 1);
  const qsQ = (router.query.q as string) || "";
  const qsStatus = (router.query.status as string) || "";
  const qsSortBy = (router.query.sortBy as SortBy) || "updatedAt";
  const qsSortDir = (router.query.sortDir as SortDir) || "desc";
  const qsLimit = Number(router.query.limit ?? DEFAULT_LIMIT);

  // ----- local UI state -----
  const [page, setPage] = useState<number>(qsPage);
  const [q, setQ] = useState<string>(qsQ);
  const [status, setStatus] = useState<string>(qsStatus);
  const [sortBy, setSortBy] = useState<SortBy>(qsSortBy);
  const [sortDir, setSortDir] = useState<SortDir>(qsSortDir);
  const [limit, setLimit] = useState<number>(qsLimit);

  const { myLOIs, isLoading } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getloiDataAsync());
  }, [dispatch]);

  // Keep URL in sync (shallow to avoid full reloads)
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
  }, [page, q, status, sortBy, sortDir, limit]); // eslint-disable-line react-hooks/exhaustive-deps

  const onHeaderSort = (key: SortBy) => {
    if (key === sortBy) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
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
    setPage(1);
  };

  const openDetail = (id?: string) => {
    if (!id) return;
    router.push(`/dashboard/pages/loi/view/${id}`);
  };

  // ---------- core: filter + sort + paginate ----------
  const { pagedRows, total } = useMemo(() => {
    const rows: LoiSummary[] = (myLOIs ?? []) as LoiSummary[];

    // FILTER
    const qLower = q.trim().toLowerCase();
    const filtered = rows.filter((r) => {
      const matchesQ =
        !qLower ||
        (r?.title ?? "").toString().toLowerCase().includes(qLower) ||
        (r?.propertyAddress ?? r?.property_address ?? "").toString().toLowerCase().includes(qLower);
      const matchesStatus =
        !status || (r?.status ?? "").toString().toLowerCase() === status.toLowerCase();
      return matchesQ && matchesStatus;
    });

    // SORT
    const dir = sortDir === "asc" ? 1 : -1;
    const getSortValue = (r: LoiSummary): string | number => {
      switch (sortBy) {
        case "updatedAt":
          return new Date(r?.updatedAt ?? 0).getTime();
        case "title":
          return (r?.title ?? "").toString().toLowerCase();
        case "propertyAddress":
          return (r?.propertyAddress ?? r?.property_address ?? "")
            .toString()
            .toLowerCase();
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

    // PAGINATE
    const totalCount = filtered.length;
    const start = (page - 1) * (limit || DEFAULT_LIMIT);
    const end = start + (limit || DEFAULT_LIMIT);
    const slice = filtered.slice(start, end);

    return { pagedRows: slice, total: totalCount };
  }, [myLOIs, q, status, sortBy, sortDir, page, limit]);

  // Ensure page is valid when filters change
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(total / (limit || DEFAULT_LIMIT)));
    if (page > maxPage) setPage(maxPage);
  }, [total, page, limit]);

  return (
    <DashboardLayout>
      {isLoading ? (
        <LoadingOverlay isVisible />
      ) : (
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Letters of Intent</h1>
              <p className="text-sm text-gray-500">Search, filter, and sort your LOIs.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/dashboard/pages/createform")}
                className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border border-gray-300 shadow-sm bg-white hover:bg-gray-50 transition"
              >
                + New LOI
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-4 bg-white rounded p-3 sm:p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={q}
                    onChange={(e) => {
                      setQ(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search by title or address..."
                    className="w-full pl-9 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {q && (
                    <button
                      onClick={() => {
                        setQ("");
                        setPage(1);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <div className="relative">
                  <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setPage(1);
                    }}
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

              {/* Page size */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500">Rows</label>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="border rounded-lg px-2 py-2"
                >
                  {[10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                {(q || status || sortBy !== "updatedAt" || sortDir !== "desc") && (
                  <button onClick={clearFilters} className="ml-auto text-sm text-gray-600 hover:underline">
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table card */}
          <div className="bg-white rounded">
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
                    <th className="px-5 py-3 cursor-pointer select-none" onClick={() => onHeaderSort("title")}>
                      <div className="inline-flex items-center gap-1">
                        LOI Title
                        <SortIcon active={sortBy === "title"} dir={sortDir} />
                      </div>
                    </th>
                    <th
                      className="px-5 py-3 cursor-pointer select-none"
                      onClick={() => onHeaderSort("propertyAddress")}
                    >
                      <div className="inline-flex items-center gap-1">
                        Property Address
                        <SortIcon active={sortBy === "propertyAddress"} dir={sortDir} />
                      </div>
                    </th>
                    <th className="px-5 py-3 cursor-pointer select-none" onClick={() => onHeaderSort("status")}>
                      <div className="inline-flex items-center gap-1">
                        Status
                        <SortIcon active={sortBy === "status"} dir={sortDir} />
                      </div>
                    </th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {pagedRows.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-500">
                        No records found
                      </td>
                    </tr>
                  )}

                  {pagedRows.map((row, idx) => (
                    <tr key={String(row._id ?? row.id ?? idx)} className="hover:bg-gray-50">
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">
                        {truncateWords(row.title, 4)}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {truncateWords(row.propertyAddress ?? row.property_address, 5)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusPill value={row.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => openDetail(row._id || row.id)}
                          className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-50"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile list */}
            <div className="lg:hidden p-3 space-y-3">
              {pagedRows.length === 0 && (
                <div className="text-center text-sm text-gray-500 py-6">No records found</div>
              )}
              {pagedRows.map((row, idx) => (
                <div key={String(row._id ?? row.id ?? idx)} className="border rounded p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{truncateWords(row.title, 6)}</div>
                      <div className="text-sm text-gray-600">
                        {truncateWords(row.propertyAddress ?? row.property_address, 8)}
                      </div>
                      <div className="mt-1">
                        <StatusPill value={row.status} />
                      </div>
                    </div>
                    <button
                      onClick={() => openDetail(row._id || row.id)}
                      className="h-8 px-3 border rounded-md text-sm hover:bg-gray-50"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer / Pager */}
            <div className="px-4 py-3 border-t">
              <Pager page={page} total={total} limit={limit} onPage={(p) => setPage(p)} />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
