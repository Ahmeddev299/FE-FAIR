// components/dashboard/lease/utils/ClauseCard.tsx
import React from "react";
import { MessageSquare } from "lucide-react";
import { Clause } from "@/types/lease";

interface ClauseCardProps {
  clause: Clause;
  onClick: () => void;
}

const getStatusStyle = (status?: string) => {
  const s = (status || "pending").toLowerCase();
  if (s === "approved") return "bg-green-50 text-green-700 border-green-200";
  if (s === "rejected") return "bg-red-50 text-red-700 border-red-200";
  return "bg-yellow-50 text-yellow-700 border-yellow-200";
};

const getStatusText = (status?: string) => {
  const s = (status || "pending").toLowerCase();
  if (s === "approved") return "approved";
  if (s === "rejected") return "needs review";
  return "pending";
};

const getRiskStyle = (risk?: string) => {
  const r = (risk || "low").toLowerCase();
  if (r === "high") return "bg-red-50 text-red-700";
  if (r === "medium") return "bg-yellow-50 text-yellow-700";
  return "bg-green-50 text-green-700";
};

const getRiskText = (risk?: string) => {
  const r = (risk || "low").toLowerCase();
  return r;
};

export const ClauseCard: React.FC<ClauseCardProps> = ({ clause, onClick }) => {
  const commentCount = clause.comments?.length || 0;
  const aiScore = clause.ai_confidence_score || 0;

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            {clause.title || clause.name || "Untitled Clause"}
          </h3>
          {clause.category && (
            <p className="text-xs text-gray-500">{clause.category}</p>
          )}
        </div>

        {/* Status badge */}
        <div className={`px-2 py-1 rounded text-xs font-medium border ${getStatusStyle(clause.status)}`}>
          {getStatusText(clause.status)}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {aiScore > 0 && (
            <span className="text-xs text-gray-600">AI Score: {aiScore}%</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Risk badge */}
          <div className={`px-2 py-0.5 rounded text-xs font-medium ${getRiskStyle(clause.risk)}`}>
            {getRiskText(clause.risk)}
          </div>
          
          {/* Comment count */}
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