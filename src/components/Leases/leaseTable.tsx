import React from 'react';
import Pill from '@/components/ui/Pill';
import Card from '@/components/ui/Card';
import Kebab from '@/components/ui/Kebab';
import type { UILeaseBrief } from '@/types/loi';

type Props = {
  leases: UILeaseBrief[];
  onRowClick: (leaseId: string) => void;
  isLoading?: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number; // accepted but not required in render; kept for API compatibility
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onFiltersChange?: (filters: { type?: string; date?: string; tag?: string }) => void;
};

const TypeTone: Record<UILeaseBrief['type'], 'gray' | 'blue' | 'yellow' | 'red'> = {
  Lease: 'gray',
  LOI: 'blue',
  Notice: 'yellow',
  Termination: 'red',
};

const StatusTone: Record<'Signed' | 'Draft' | 'Received' | 'Expiring' | 'Pending', 'green' | 'yellow' | 'blue' | 'red' | 'purple' | 'gray'> = {
  Signed: 'green',
  Draft: 'yellow',
  Received: 'blue',
  Expiring: 'red',
  Pending: 'purple',
};

const pageSizeOptions = [10, 20, 50] as const;

/** Safe string prop read without `any` */
function getStringProp(obj: unknown, key: string): string | undefined {
  if (obj && typeof obj === 'object') {
    const v = (obj as Record<string, unknown>)[key];
    return typeof v === 'string' ? v : undefined;
  }
  return undefined;
}

/** Pull a timestamp from known optional fields (if present) */
function getUpdatedMs(l: UILeaseBrief): number | undefined {
  const candidates = [
    getStringProp(l, 'updatedAt'),
    getStringProp(l, 'lastUpdatedAt'),
    getStringProp(l, 'createdAt'),
    getStringProp(l, 'lastUpdated'),
  ].filter((v): v is string => typeof v === 'string' && v.length > 0);

  for (const c of candidates) {
    const t = Date.parse(c);
    if (!Number.isNaN(t)) return t;
  }
  return undefined;
}

function dateInRange(ms: number, bucket: string): boolean {
  const now = new Date();
  const end = now.getTime();

  if (bucket === 'Last 7 days') {
    const start = end - 7 * 24 * 60 * 60 * 1000;
    return ms >= start && ms <= end;
  }
  if (bucket === 'Last 30 days') {
    const start = end - 30 * 24 * 60 * 60 * 1000;
    return ms >= start && ms <= end;
  }
  if (bucket === 'This year') {
    const start = new Date(now.getFullYear(), 0, 1).getTime();
    return ms >= start && ms <= end;
  }
  if (bucket === 'Last year') {
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
        className="appearance-none text-sm bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="__all">{label}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.114l3.71-3.882a.75.75 0 111.08 1.04l-4.24 4.44a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
      </svg>
    </div>
  );
}

export default function LeasesTable({
  leases,
  isLoading = false,
  page,
  limit,
  total,
  // totalPages, // not used directly; computed from totals
  onPageChange,
  onLimitChange,
  onRowClick,
  onFiltersChange,
}: Props) {
  const [typeFilter, setTypeFilter] = React.useState('__all');
  const [dateFilter, setDateFilter] = React.useState('__all');
  const [tagFilter, setTagFilter] = React.useState('__all');

  const tagOptions = React.useMemo(() => {
    const s = new Set<string>();
    for (const l of leases) (l.tags ?? []).forEach((t) => s.add(t));
    return Array.from(s).sort();
  }, [leases]);

  const hasActiveFilters =
    typeFilter !== '__all' || dateFilter !== '__all' || tagFilter !== '__all';

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
      if (typeFilter !== '__all' && l.type !== typeFilter) return false;

      if (tagFilter !== '__all') {
        const tags = (l.tags ?? []).map((t) => t.toLowerCase());
        if (!tags.includes(tagFilter.toLowerCase())) return false;
      }

      if (dateFilter !== '__all') {
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
  const rows: UILeaseBrief[] = hasActiveFilters
    ? filtered.slice(startIdx, endIdx)
    : leases;

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
    <Card className="p-0 relative">
      <div className="px-4 py-4 flex flex-wrap items-center gap-3 justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Documents ({effectiveTotal})</h2>

        <div className="flex items-center gap-2">
          <FilterSelect
            label="All Types"
            value={typeFilter}
            onChange={(v) => {
              setTypeFilter(v);
              emitFiltersIfNeeded({ type: v === '__all' ? undefined : v });
            }}
            options={['Lease', 'LOI', 'Notice', 'Termination']}
            disabled={isLoading}
          />
          <FilterSelect
            label="All Dates"
            value={dateFilter}
            onChange={(v) => {
              setDateFilter(v);
              emitFiltersIfNeeded({ date: v === '__all' ? undefined : v });
            }}
            options={['Last 7 days', 'Last 30 days', 'This year', 'Last year']}
            disabled={isLoading}
          />
          <FilterSelect
            label="All Tags"
            value={tagFilter}
            onChange={(v) => {
              setTagFilter(v);
              emitFiltersIfNeeded({ tag: v === '__all' ? undefined : v });
            }}
            options={tagOptions}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600">
            <tr>
              <th className="px-5 py-3">Document Name</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Document ID</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Tags</th>
              <th className="px-5 py-3">Size</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {showLoading &&
              Array.from({ length: 8 }).map((_, i) => (
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

            {rows.map((l) => (
              <tr key={l.id} className="text-sm hover:bg-gray-50">
                <td className="px-5 py-3">
                  <button
                    onClick={() => onRowClick(l.id)}
                    className="text-gray-900 font-medium hover:underline"
                  >
                    {l.title}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <Pill tone={TypeTone[l.type]}>{l.type}</Pill>
                </td>
                <td className="px-5 py-3 text-gray-700">{l.documentId ?? '-'}</td>
                <td className="px-5 py-3">
                  {l.status ? (
                    <Pill tone={StatusTone[l.status as keyof typeof StatusTone] ?? 'gray'}>
                      {l.status}
                    </Pill>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {(l.tags ?? []).map((t) => (
                      <Pill key={t} tone={/risk|urgent|legal/i.test(t) ? 'red' : 'gray'}>
                        {t}
                      </Pill>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-700">{l.sizeLabel ?? '-'}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-start">
                    <Kebab />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-white rounded-b">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{rows.length ? startIdx + 1 : 0}</span> to{' '}
          <span className="font-medium">{rows.length ? endIdx : 0}</span> of{' '}
          <span className="font-medium">{effectiveTotal}</span> results
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Rows per page</label>
          <select
            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
            value={effectiveLimit}
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
              className="inline-flex items-center gap-1 px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
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
              className="inline-flex items-center gap-1 px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
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
