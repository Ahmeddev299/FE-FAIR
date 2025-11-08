// components/dashboard/lease/utils/ClauseCard.tsx
import React from "react";
import { AlertCircle, CheckCircle2, Clock, MessageSquare, XCircle } from "lucide-react";
import { Clause } from "@/types/lease";

// ✅ Updated interface with optional props
interface ClauseCardProps {
  clause: Clause;
  onClick?: () => void;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onComment?: (id: string, text: string) => void;
  accepting?: boolean;
  onOpenDetails?: (clause: Clause) => void;
}

const getStatusStyle = (status?: string) => {
  if (status === "approved") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (status === "pending") return <Clock className="w-4 h-4 text-yellow-500" />;
  if (status === "rejected") return <XCircle className="w-4 h-4 text-rose-500" />;
  if (status === "need-review") return <AlertCircle className="w-4 h-4 text-orange-500" />;
  return <Clock className="w-4 h-4 text-yellow-500" />;
};

export const ClauseCard: React.FC<ClauseCardProps> = ({ 
  clause, 
  onClick,
  onOpenDetails,
  // onAccept, onReject, onComment, accepting can be used if needed
}) => {
  const commentCount = clause.comments?.length || 0;

  // ✅ Handle click with fallback
  const handleClick = () => {
    if (onOpenDetails) {
      onOpenDetails(clause);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="border hover:border-[#EFF6FF] border-gray-200 rounded-lg p-4 hover:shadow-md hover:bg-[#EFF6FF] transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            {clause.title || clause.name || "Untitled Clause"}
          </h3>
        </div>

        <div className="flex items-start justify-between mb-3">
          {getStatusStyle(clause.status)}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {commentCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{commentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};