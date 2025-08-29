import { useMemo } from 'react';
import type { Clause } from '@/types/loi';
import { StatusBadge } from '../dashboard/StatusBadge';
import RiskBadge from './RiskBadge';
import CommentPill from './CommenPill'; // ✅ fixed filename
import { Check, Eye, Sparkles } from 'lucide-react';

type ClauseLike = Clause & {
  id?: string | number;
  title?: string;
  status?: string;
  risk?: string;
  /** Some backends send "comment" as an array; keep it flexible but typed */
  comment?: unknown;
};

type Props = {
  clauses: ClauseLike[];
  onViewDetails(clause: ClauseLike): void;
  onApprove?(clause: ClauseLike): void;
  onAcceptAI?(clause: ClauseLike): void;
};

// Extract numeric risk from common formats: "High", "Medium", "Low", or "High (8/10)"
const extractRiskValue = (riskString?: string): number => {
  if (!riskString) return 2; // default low
  const match = riskString.match(/\((\d+)\/10\)/);
  if (match) return parseInt(match[1], 10);

  const riskLower = riskString.toLowerCase();
  if (riskLower.includes('high')) return 8;
  if (riskLower.includes('medium')) return 5;
  if (riskLower.includes('low')) return 2;

  return 2;
};

const getRiskCategory = (value: number): 'High' | 'Medium' | 'Low' => {
  if (value >= 8) return 'High';
  if (value >= 5) return 'Medium';
  return 'Low';
};

const getStatusPriority = (status?: string): number => {
  if (!status) return 1;
  const s = status.toLowerCase();
  const priorities: Record<string, number> = {
    pending: 1,
    review: 2,
    edited: 3,
    suggested: 4,
    approved: 5,
  };
  return priorities[s] ?? 1;
};

const getCommentsCount = (c: ClauseLike): number => {
  const { comment } = c as { comment?: unknown };
  return Array.isArray(comment) ? comment.length : 0;
};

export default function ClauseTable({ clauses, onViewDetails, onApprove, onAcceptAI }: Props) {
  // Overall metrics based on visible clauses
  const { overallRisk, overallStatus } = useMemo(() => {
    if (!clauses || clauses.length === 0) {
      return { overallRisk: 'Low (2/10)', overallStatus: 'pending' };
    }

    let totalRisk = 0;
    let riskCount = 0;
    let highestPriority = 0;
    let statusWithHighest: string = 'pending';

    clauses.forEach((c) => {
      if (c.risk) {
        totalRisk += extractRiskValue(c.risk);
        riskCount++;
      }
      const pr = getStatusPriority(c.status);
      if (pr > highestPriority) {
        highestPriority = pr;
        statusWithHighest = c.status ?? 'pending';
      }
    });

    const avg = riskCount ? Math.round(totalRisk / riskCount) : 2;
    const riskCat = getRiskCategory(avg);
    return { overallRisk: `${riskCat} (${avg}/10)`, overallStatus: statusWithHighest };
  }, [clauses]);

  if (!clauses || clauses.length === 0) {
    return (
      <>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
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
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
          No clause data available.
        </div>
      </>
    );
  }

  return (
    <>
      {/* Overall Risk and Status Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
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
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="hidden md:block px-4 xl:px-6 py-3 bg-white border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 xl:gap-6 text-sm font-medium text-gray-700">
            <div className="col-span-3">Clause</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Risk</div>
            <div className="col-span-3">Comments</div>
            <div className="col-span-3">Actions</div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {clauses.map((clause, idx) => {
            const status = clause.status ?? 'pending';
            const risk = clause.risk ?? 'Low (2/10)';
            const commentsCount = getCommentsCount(clause);

            return (
              <div key={(clause.id ?? idx).toString()} className="p-4 xl:pl-6 xl:py-5 hover:bg-gray-50 transition">
                <div className="grid grid-cols-1 md:grid-cols-12 md:gap-4 xl:gap-6 gap-y-3 md:items-center">
                  <div className="md:col-span-3 truncate">
                    <div className="font-medium text-gray-900 truncate">
                      {clause.title ?? `Clause #${idx + 1}`}
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
          })}
        </div>
      </div>
    </>
  );
}
