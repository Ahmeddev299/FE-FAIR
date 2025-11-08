import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { ClauseCard } from "./ClauseCard";
import { Clause } from "@/types/lease";

interface ClauseCategoryProps {
  category: string;
  clauses: Clause[]; // ✅ Strongly type this
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onComment: (id: string, text: string) => void;
  acceptingId: string | null;
  onOpenDetails: (clause: Clause) => void;
}

export const ClauseCategory: React.FC<ClauseCategoryProps> = ({
  category,
  clauses,
  onAccept,
  onReject,
  onComment,
  acceptingId,
  onOpenDetails,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
        type="button"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
            {clauses.length}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {isExpanded && (
        <div className="p-5 pt-0 space-y-4">
          {clauses.map((clause) => ( // ✅ inference: clause is Clause
            <ClauseCard
              key={clause.id}
              clause={clause}
              onAccept={onAccept}
              onReject={onReject}
              onComment={onComment}
              accepting={acceptingId === clause.id}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};
