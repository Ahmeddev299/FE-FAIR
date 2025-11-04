import React from "react";
import Pill from "@/components/ui/Pill";
import Card from "@/components/ui/Card";
import type { UILeaseBrief } from "@/types/loi";
import { Eye, MoreHorizontal } from "lucide-react";

type Props = {
  leases: UILeaseBrief[];
  onRowClick: (leaseId: string) => void;
  isLoading?: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onFiltersChange?: (filters: { type?: string; date?: string; tag?: string }) => void;
};

const TypeTone: Record<UILeaseBrief["type"], "gray" | "blue" | "yellow" | "red"> = {
  Lease: "gray",
  LOI: "blue",
  Notice: "yellow",
  Termination: "red",
};

const StatusTone: Record<
  "Signed" | "Draft" | "Received" | "Expiring" | "Pending",
  "green" | "yellow" | "blue" | "red" | "purple" | "gray"
> = {
  Signed: "green",
  Draft: "yellow",
  Received: "blue",
  Expiring: "red",
  Pending: "purple",
};

const pageSizeOptions = [10, 20, 50] as const;

/* ---------- helpers ---------- */

function getStringProp(obj: unknown, key: string): string | undefined {
  if (obj && typeof obj === "object") {
    const v = (obj as Record<string, unknown>)[key];
    return typeof v === "string" ? v : undefined;
  }
  return undefined;
}

function getUpdatedMs(l: UILeaseBrief): number | undefined {
  const candidates = [
    getStringProp(l, "updatedAt"),
    getStringProp(l, "lastUpdatedAt"),
    getStringProp(l, "createdAt"),
    getStringProp(l, "lastUpdated"),
  ].filter((v): v is string => typeof v === "string" && v.length > 0);

  for (const c of candidates) {
    const t = Date.parse(c);
    if (!Number.isNaN(t)) return t;
  }
  return undefined;
}

function dateInRange(ms: number, bucket: string): boolean {
  const now = new Date();
  const end = now.getTime();

  if (bucket === "Last 7 days") {
    const start = end - 7 * 24 * 60 * 60 * 1000;
    return ms >= start && ms <= end;
  }
  if (bucket === "Last 30 days") {
    const start = end - 30 * 24 * 60 * 60 * 1000;
    return ms >= start && ms <= end;
  }
  if (bucket === "This year") {
    const start = new Date(now.getFullYear(), 0, 1).getTime();
    return ms >= start && ms <= end;
  }
  if (bucket === "Last year") {
    const start = new Date(now.getFullYear() - 1, 0, 1).getTime();
    const stop = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999).getTime();
    return ms >= start && ms <= stop;
  }
  return true;
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-9 text-sm bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="__all">{label}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.114l3.71-3.882a.75.75 0 111.08 1.04l-4.24 4.44a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
      </svg>
    </div>
  );
}

/* ---------- component ---------- */

export default function LeasesTable({
  leases,
  isLoading = false,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  onRowClick,
  onFiltersChange,
}: Props) {
  const [typeFilter, setTypeFilter] = React.useState("__all");
  const [dateFilter, setDateFilter] = React.useState("__all");
  const [tagFilter, setTagFilter] = React.useState("__all");

  const tagOptions = React.useMemo(() => {
    const s = new Set<string>();
    for (const l of leases) (l.tags ?? []).forEach((t) => s.add(t));
    return Array.from(s).sort();
  }, [leases]);

  const hasActiveFilters =
    typeFilter !== "__all" || dateFilter !== "__all" || tagFilter !== "__all";

  const [localPage, setLocalPage] = React.useState(page);
  const [localLimit, setLocalLimit] = React.useState(limit);

  React.useEffect(() => {
    if (!hasActiveFilters) {
      setLocalPage(page);
      setLocalLimit(limit);
    } else {
      setLocalPage(1);
    }
  }, [typeFilter, dateFilter, tagFilter, page, limit, hasActiveFilters]);

  const filtered = React.useMemo(() => {
    if (!hasActiveFilters) return leases;
    return leases.filter((l) => {
      if (typeFilter !== "__all" && l.type !== typeFilter) return false;

      if (tagFilter !== "__all") {
        const tags = (l.tags ?? []).map((t) => t.toLowerCase());
        if (!tags.includes(tagFilter.toLowerCase())) return false;
      }

      if (dateFilter !== "__all") {
        const ms = getUpdatedMs(l);
        if (ms === undefined) return false;
        if (!dateInRange(ms, dateFilter)) return false;
      }

      return true;
    });
  }, [leases, hasActiveFilters, typeFilter, tagFilter, dateFilter]);

  const effectiveLimit = hasActiveFilters ? localLimit : limit;
  const effectivePage = hasActiveFilters ? localPage : page;
  const effectiveTotal = hasActiveFilters ? filtered.length : total;
  const effectiveTotalPages = Math.max(1, Math.ceil(effectiveTotal / effectiveLimit));

  const startIdx = (effectivePage - 1) * effectiveLimit;
  const endIdx = Math.min(startIdx + effectiveLimit, effectiveTotal);
  const rows: UILeaseBrief[] = hasActiveFilters ? filtered.slice(startIdx, endIdx) : leases;

  const goToPage = (p: number) => {
    if (p < 1 || p > effectiveTotalPages) return;
    if (hasActiveFilters) setLocalPage(p);
    else onPageChange(p);
  };

  const changeLimit = (n: number) => {
    if (hasActiveFilters) {
      setLocalLimit(n);
      setLocalPage(1);
    } else {
      onLimitChange(n);
    }
  };

  const emitFiltersIfNeeded = (next: { type?: string; date?: string; tag?: string }) => {
    onFiltersChange?.(next);
  };

  const showLoading = Boolean(isLoading);

  return (
    <Card className="p-0 overflow-hidden border border-gray-200 bg-white">
      {/* Header / Filters */}
      <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">Documents ({effectiveTotal})</h2>

        <div className="flex items-center gap-2">
          <FilterSelect
            label="All Types"
            value={typeFilter}
            onChange={(v) => {
              setTypeFilter(v);
              emitFiltersIfNeeded({ type: v === "__all" ? undefined : v });
            }}
            options={["Lease", "LOI", "Notice", "Termination"]}
            disabled={isLoading}
          />
          <FilterSelect
            label="All Dates"
            value={dateFilter}
            onChange={(v) => {
              setDateFilter(v);
              emitFiltersIfNeeded({ date: v === "__all" ? undefined : v });
            }}
            options={["Last 7 days", "Last 30 days", "This year", "Last year"]}
            disabled={isLoading}
          />
          <FilterSelect
            label="All Tags"
            value={tagFilter}
            onChange={(v) => {
              setTagFilter(v);
              emitFiltersIfNeeded({ tag: v === "__all" ? undefined : v });
            }}
            options={tagOptions}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-5">
        <table className="w-full text-sm border rounded-xl p-4 border-gray-200">

          <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
            <th className="px-6 py-3">Document Name</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Document ID</th>
            <th className="px-6 py-3">Status</th>
        <th className="px-6 py-3 text-right">Actions</th>
          </tr>


          <tbody>
            {showLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={`sk-${i}`} className="border-b border-gray-100">
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-14 bg-gray-100 rounded animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="h-4 w-8 bg-gray-100 rounded animate-pulse ml-auto" />
                  </td>
                </tr>
              ))}

            {rows.map((l) => (
              console.log("1",l),

              <tr key={l.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <button
                    onClick={() => onRowClick(l.id)}
                    className="text-gray-900 font-medium hover:underline"
                  >
                    {l.documentName}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <Pill tone={TypeTone[l.type]}>{l.type}</Pill>
                </td>
                <td className="px-6 py-4 text-gray-700">{l.id ?? "-"}</td>
                <td className="px-6 py-4">
                  {l.status ? (
                    <Pill tone={StatusTone[l.status as keyof typeof StatusTone] ?? "gray"}>
                      {l.status}
                    </Pill>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
               
                 <td className="px-5 py-3 text-right">
                    <KebabMenu
                      onView={() => onRowClick(l.id)}
                      disabled={isLoading}
                    />
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pager */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 border-t border-gray-200 bg-white">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{rows.length ? startIdx + 1 : 0}</span> to{" "}
          <span className="font-medium">{rows.length ? endIdx : 0}</span> of{" "}
          <span className="font-medium">{effectiveTotal}</span> results
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Rows per page</label>
          <select
            className="h-9 text-sm border border-gray-300 rounded-md px-2 bg-white"
            value={hasActiveFilters ? localLimit : limit}
            onChange={(e) => changeLimit(Number(e.target.value))}
            disabled={isLoading}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            <button
              className="inline-flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
              onClick={() => goToPage(effectivePage - 1)}
              disabled={isLoading || effectivePage <= 1}
              aria-label="Previous page"
            >
              ‹ Prev
            </button>
            <span className="px-2 text-sm text-gray-700">
              {effectivePage} / {effectiveTotalPages}
            </span>
            <button
              className="inline-flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
              onClick={() => goToPage(effectivePage + 1)}
              disabled={isLoading || effectivePage >= effectiveTotalPages}
              aria-label="Next page"
            >
              Next ›
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function KebabMenu({
  onView,
  disabled,
}: {
  onView: () => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node | null;
      if (btnRef.current && !btnRef.current.contains(t)) {
        const panel = document.getElementById("actions-popover");
        if (panel && !panel.contains(t)) setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((s) => !s)}
        className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600"
        disabled={disabled}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div
          id="actions-popover"
          role="menu"
          className="absolute right-0 mt-2 w-36 origin-top-right rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none z-20"
        >
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onView();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 text-gray-600" />
            View
          </button>
        </div>
      )}
    </div>
  );
}