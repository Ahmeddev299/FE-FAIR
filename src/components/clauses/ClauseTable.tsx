import React, { useMemo, useState } from 'react';
import type { Clause } from '@/types/loi';
import { StatusBadge } from '../dashboard/StatusBadge';
import RiskBadge from './RiskBadge';
import CommentPill from './CommenPill';
import { Check, Eye, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

type ClauseLike = Clause & {
  id?: string | number;
  title?: string;
  status?: string;
  risk?: string;
  comment?: unknown; // array on some backends
};

type Props = {
  clauses: ClauseLike[];
  onViewDetails(clause: ClauseLike): void;
  onApprove?(clause: ClauseLike): void;
  onAcceptAI?(clause: ClauseLike): void;

  /** Optional: controlled pagination (server-side). If omitted, component paginates locally. */
  page?: number; // 1-based
  pageSize?: number;
  total?: number; // total rows across all pages (server)
  onPageChange?(page: number): void;
  onPageSizeChange?(size: number): void;
};

/* ---------------- helpers ---------------- */
const extractRiskValue = (riskString?: string): number => {
  if (!riskString) return 2;
  const m = riskString.match(/\((\d+)\/10\)/);
  if (m) return parseInt(m[1], 10);
  const r = riskString.toLowerCase();
  if (r.includes('high')) return 8;
  if (r.includes('medium')) return 5;
  if (r.includes('low')) return 2;
  return 2;
};
const getRiskCategory = (value: number): 'High' | 'Medium' | 'Low' =>
  value >= 8 ? 'High' : value >= 5 ? 'Medium' : 'Low';

const getStatusPriority = (status?: string): number => {
  if (!status) return 1;
  const s = status.toLowerCase();
  return { pending: 1, review: 2, edited: 3, suggested: 4, approved: 5 }[s] ?? 1;
};

const getCommentsCount = (c: ClauseLike): number => {
  const { comment } = c;
  return Array.isArray(comment) ? comment.length : 0;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max));

const buildPageList = (current: number, totalPages: number): (number | '…')[] => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const list: (number | '…')[] = [1];
  const start = clamp(current - 1, 2, totalPages - 3);
  const end = clamp(current + 1, 4, totalPages - 1);
  if (start > 2) list.push('…');
  for (let p = start; p <= end; p++) list.push(p);
  if (end < totalPages - 1) list.push('…');
  list.push(totalPages);
  return list;
};

/* ---------------- component ---------------- */
export default function ClauseTable(props: Props) {
  const {
    clauses,
    onViewDetails,
    onApprove,
    onAcceptAI,
    page: pageProp,
    pageSize: pageSizeProp,
    total: totalProp,
    onPageChange,
    onPageSizeChange,
  } = props;

  // if parent didn’t provide pagination props, manage locally
  const isControlled = !!(pageProp && pageSizeProp);
  const [localPage, setLocalPage] = useState(1);
  const [localPageSize, setLocalPageSize] = useState(10);

  const page = isControlled ? pageProp! : localPage;
  const pageSize = isControlled ? pageSizeProp! : localPageSize;

  // totals: server total if provided, else full array length
  const totalRows = typeof totalProp === 'number' ? totalProp : clauses.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

  // rows visible on current page
  const visibleRows = useMemo(() => {
    if (isControlled) return clauses; // server passes only current page rows
    const start = (page - 1) * pageSize;
    return clauses.slice(start, start + pageSize);
  }, [clauses, page, pageSize, isControlled]);

  // Overall metrics (based on *visible* rows; switch to clauses for global)
  const { overallRisk, overallStatus } = useMemo(() => {
    if (!visibleRows || visibleRows.length === 0) {
      return { overallRisk: 'Low (2/10)', overallStatus: 'pending' };
    }
    let totalRisk = 0;
    let riskCount = 0;
    let highest = 0;
    let highestStatus = 'pending';

    visibleRows.forEach((c) => {
      if (c.risk) {
        totalRisk += extractRiskValue(c.risk);
        riskCount++;
      }
      const pr = getStatusPriority(c.status);
      if (pr > highest) {
        highest = pr;
        highestStatus = c.status ?? 'pending';
      }
    });

    const avg = riskCount ? Math.round(totalRisk / riskCount) : 2;
    const cat = getRiskCategory(avg);
    return { overallRisk: `${cat} (${avg}/10)`, overallStatus: highestStatus };
  }, [visibleRows]);

  const handlePageChange = (next: number) => {
    const clamped = clamp(next, 1, totalPages);
    if (isControlled) onPageChange?.(clamped);
    else setLocalPage(clamped);
  };

  const handlePageSizeChange = (size: number) => {
    if (isControlled) onPageSizeChange?.(size);
    else {
      setLocalPageSize(size);
      setLocalPage(1); // reset to first page when size changes
    }
  };

  return (
    <>
      {/* Overall Risk and Status */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Overall Risk:</span>
              <RiskBadge risk={overallRisk} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Overall Status:</span>
              <StatusBadge status={overallStatus} />
            </div>
          </div>

          {/* Page size */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value, 10))}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 20, 50].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* header row */}
        <div className="hidden md:block px-4 xl:px-6 py-3 bg-white border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 xl:gap-6 text-sm font-medium text-gray-700">
            <div className="col-span-3">Clause</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Risk</div>
            <div className="col-span-3">Comments</div>
            <div className="col-span-3">Actions</div>
          </div>
        </div>

        {/* rows */}
        <div className="divide-y divide-gray-200">
          {visibleRows.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No clause data available.</div>
          ) : (
            visibleRows.map((clause, idx) => {
              const status = clause.status ?? 'pending';
              const risk = clause.risk ?? 'Low (2/10)';
              const commentsCount = getCommentsCount(clause);

              return (
                <div key={(clause.id ?? idx).toString()} className="p-4 xl:pl-6 xl:py-5 hover:bg-gray-50 transition">
                  <div className="grid grid-cols-1 md:grid-cols-12 md:gap-4 xl:gap-6 gap-y-3 md:items-center">
                    <div className="md:col-span-3 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        {clause.name ?? clause.title ?? `Clause #${idx + 1 + (page - 1) * pageSize}`}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <StatusBadge status={status} />
                    </div>

                    <div className="md:col-span-1">
                      <RiskBadge risk={risk} />
                    </div>

                    <div className="md:col-span-3">
                      <CommentPill count={commentsCount} />
                    </div>

                    <div className="md:col-span-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {status === 'Suggested' && onAcceptAI && (
                          <button
                            onClick={() => onAcceptAI(clause)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 flex items-center gap-1"
                          >
                            <Sparkles className="h-4 w-4" />
                            <span>Accept AI</span>
                          </button>
                        )}
                        {(status === 'Edited' || status === 'Review') && onApprove && (
                          <button
                            onClick={() => onApprove(clause)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 flex items-center gap-1"
                          >
                            <Check className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                        )}
                        <button
                          onClick={() => onViewDetails(clause)}
                          className="px-3 py-1.5 text-sm rounded-lg border flex items-center gap-1 hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4" /> View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* footer / pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 xl:px-6 py-3 border-t bg-white">
          <div className="text-xs text-gray-600">
            Showing{' '}
            <span className="font-medium">
              {totalRows === 0 ? 0 : (page - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(page * pageSize, totalRows)}
            </span>{' '}
            of <span className="font-medium">{totalRows}</span> clauses
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-sm rounded-md border disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>

            {buildPageList(page, totalPages).map((p, i) =>
              p === '…' ? (
                <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => handlePageChange(p as number)}
                  className={`min-w-[36px] h-8 rounded-md text-sm ${
                    p === page
                      ? 'bg-blue-600 text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-sm rounded-md border disabled:opacity-50 hover:bg-gray-50"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
