// src/components/clauses/ClauseSidebar.tsx
import { AlertTriangle, Eye } from 'lucide-react';
import ManagementProgress from './ManagementProgress';

export default function ClauseSidebar({
  approved,
  total,
  unresolved,
  onPreview,
}: {
  approved: number; total: number; unresolved: number;
  onPreview(): void;
}) {
  return (
    <div className="w-full xl:w-80 space-y-6">
      <div className="xl:hidden">
        <ManagementProgress approved={approved} total={total} unresolved={unresolved} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <h3 className="font-medium text-gray-900">Unresolved Comments</h3>
        </div>
        <p className="text-sm text-gray-600">{unresolved} clause(s) with open comments</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-medium text-gray-900 mb-4">Document Preview</h3>
        <button
          onClick={onPreview}
          className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <Eye className="h-4 w-4 text-gray-600" />
          <span>Preview Updated Document</span>
        </button>
        <p className="text-xs text-gray-500 mt-2">See how changes look in the final lease</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <h3 className="font-medium text-yellow-800">Ready to Proceed?</h3>
        </div>
        <p className="text-sm text-yellow-700">Please approve or reject all clauses before signature.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-medium text-gray-900 mb-4">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Clauses:</span>
            <span className="text-sm font-medium text-gray-900">{total}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Completion Rate:</span>
            <span className="text-sm font-medium text-gray-900">
              {total ? Math.round((approved / total) * 100) : 0}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Open Comments:</span>
            <span className="text-sm font-medium text-gray-900">{unresolved}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
