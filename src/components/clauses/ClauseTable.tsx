import React from 'react';
import Card from '@/components/ui/Card';
import Pill from '@/components/ui/Pill';
import { AlertTriangle, Edit3, MessageSquare } from 'lucide-react';
import { LoadingOverlay } from '@/components/loaders/overlayloader';
import { UIClause } from '@/types/loi';

type Props = {
  clauses: UIClause[];
  filters: { status: string; risk: string; category: string };
  onChangeFilters: (next: Props['filters']) => void;

  onApprove: (clause: UIClause) => void;
  onEdit: (clause: UIClause) => void;
  onComment: (clause: UIClause) => void;
  isLoading?: boolean;
};

export default function ClausesTable({
  clauses,
  filters,
  onChangeFilters,
  onEdit,
  onComment,
  isLoading = false,
}: Props) {
  const filtered = clauses.filter((c) => {
    const okStatus = filters.status === 'All Status' || c.status === filters.status;
    const okRisk = filters.risk === 'All Risk Levels' || c.risk === filters.risk;
    const okCat = filters.category === 'Category' || (c.category || 'Other') === filters.category;
    return okStatus && okRisk && okCat;
  });

  return (
    <Card className="p-0 overflow-hidden relative">
      {isLoading && <div className="absolute inset-0 z-10"><LoadingOverlay isVisible /></div>}

      <div className=" p-4 flex flex-wrap items-center gap-3">
        <select
          value={filters.status}
          onChange={(e) => onChangeFilters({ ...filters, status: e.target.value })}
          className="px-3 py-2 text-sm"
          disabled={isLoading}
        >
          <option>All Status</option>
          <option>AI Suggested</option>
          <option>Edited</option>
          <option>Approved</option>
          <option>Needs Review</option>
          <option>Pending</option>
        </select>

        <select
          value={filters.risk}
          onChange={(e) => onChangeFilters({ ...filters, risk: e.target.value })}
          className="px-3 py-2 text-sm "
          disabled={isLoading}
        >
          <option>All Risk Levels</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) => onChangeFilters({ ...filters, category: e.target.value })}
          className="px-3 py-2 text-sm"
          disabled={isLoading}
        >
          <option>Category</option>
          <option>Rent</option>
          <option>CAM Charges</option>
          <option>Termination</option>
          <option>Indemnity</option>
          <option>Terms & Conditions</option>
          <option>Other</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600">
            <tr>
              <th className="px-4 py-3">Clause</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Last Edited</th>
              <th className="px-4 py-3">Comments</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          {filtered.map((c) => (
            <tr key={c.id} className="text-sm">
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{c.name}</div>
                {c.category && <div className="text-xs text-gray-500">{c.category}</div>}
              </td>

              <td className="px-4 py-3">
                <Pill
                  tone={
                    c.status === 'Approved' ? 'green'
                      : c.status === 'Edited' ? 'yellow'
                        : c.status === 'Needs Review' ? 'red'
                          : 'blue'
                  }
                >
                  {c.status}
                </Pill>
              </td>

              <td className="px-4 py-3">
                <div className="inline-flex items-center gap-1.5">
                  {c.risk === 'High' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                  <Pill tone={c.risk === 'High' ? 'red' : c.risk === 'Medium' ? 'yellow' : 'green'}>
                    {c.risk}
                  </Pill>
                </div>
              </td>

              <td className="px-4 py-3 text-gray-700">
                {c.lastEditedAt
                  ? `${new Date(c.lastEditedAt).toLocaleDateString()} ${new Date(c.lastEditedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : '-'}
                {c.lastEditedBy && <span className="text-xs text-gray-500"> by {c.lastEditedBy}</span>}
              </td>

              <td className="px-4 py-3">
                {c.commentsUnresolved ? <Pill tone="red">{c.commentsUnresolved} unresolved</Pill> : <Pill tone="green">0</Pill>}
              </td>

              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">

                  <button
                    onClick={() => onEdit(c)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-gray-300 hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => onComment(c)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-gray-300 hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Comment
                  </button>
                </div>
              </td>
            </tr>
          ))}

        </table>
      </div>
    </Card>
  );
}
