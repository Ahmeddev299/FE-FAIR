// src/components/clauses/ManagementProgress.tsx
import { Check, Clock, MessageSquare } from 'lucide-react';

export default function ManagementProgress({
  approved = 0,
  total = 0,
  unresolved = 0,
}: { approved?: number; total?: number; unresolved?: number }) {
  const pct = total ? Math.round((approved / total) * 100) : 0;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Management Progress</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">Clauses Approved</span>
        <span className="text-sm font-semibold text-gray-900">{approved} of {total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-5">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[#F0FDF4] rounded-lg p-3 flex flex-col items-center justify-center shadow-sm">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-1">
            <Check className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-sm font-semibold text-green-700">{approved}</div>
          <div className="text-xs text-green-700">Approved</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 flex flex-col items-center justify-center shadow-sm">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mb-1">
            <Clock className="h-4 w-4 text-orange-600" />
          </div>
          <div className="text-sm font-semibold text-orange-700">{Math.max(total - approved, 0)}</div>
          <div className="text-xs text-orange-700">Pending</div>
        </div>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
        <MessageSquare className="h-4 w-4 text-red-600 mt-1" />
        <div>
          <div className="text-sm font-medium text-red-700">Unresolved Comments</div>
          <div className="text-xs text-red-600">{unresolved} clause(s) with open comments</div>
        </div>
      </div>
    </div>
  );
}
