// src/components/clauses/ClauseRow.tsx
import { Edit as EditIcon, MessageSquare, Check, Sparkles } from 'lucide-react';
import { Clause } from '@/types/loi';
import StatusBadge from './StatusBadge';
import RiskBadge from './RiskBadge';
// FIX: file name typo
import CommentPill from './CommenPill';

// type Props = {
// //   clause: Clause;
//   onEdit(clause: Clause): void;
//   onApprove?(clause: Clause): void;
//   onAcceptAI?(clause: Clause): void;
// };

export default function ClauseRow({ clause, onEdit, onApprove, onAcceptAI }) {
    console.log("clause", clause)
  return (
    <div className="p-4 xl:pl-6 xl:py-5 hover:bg-gray-50 transition">
      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-4 xl:gap-6 gap-y-3 md:items-center">
        <div className="md:col-span-3 truncate">
          <div className="font-medium text-gray-900 truncate">{clause.title}</div>
          {clause.property_address && <div className="text-sm text-gray-500 truncate">{clause.property_address}</div>}
        </div>

        <div className="md:col-span-2">
          {/* default to Review if empty */}
          <StatusBadge status={clause?.status || 'Review'} />
        </div>

        <div className="md:col-span-1">
          {/* default to Low if empty */}
          <RiskBadge risk={clause?.risk || 'Low'} />
        </div>

        <div className="md:col-span-3">
          <CommentPill count={clause?.comments ?? 0} />
        </div>

        <div className="md:col-span-3">
          <div className="flex items-center gap-2 flex-wrap">
            {clause.status === 'Suggested' && onAcceptAI && (
              <button
                onClick={() => onAcceptAI(clause)}
                className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 flex items-center gap-1"
              >
                <Sparkles className="h-4 w-4" />
                <span>Accept AI</span>
              </button>
            )}
            {(clause.status === 'Edited' || clause.status === 'Review') && onApprove && (
              <button
                onClick={() => onApprove(clause)}
                className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 flex items-center gap-1"
              >
                <Check className="h-4 w-4" />
                <span>Approve</span>
              </button>
            )}
            <button
              className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-600 w-[50px] h-[30px] rounded-md flex items-center justify-center"
              onClick={() => onEdit(clause)}
              title="Edit"
            >
              <EditIcon className="h-4 w-4" />
            </button>
            <button
              className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-600 w-[50px] h-[30px] rounded-md flex items-center justify-center"
              title="Comment"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
