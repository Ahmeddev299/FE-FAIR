// components/ClauseHeader.tsx
import React from "react";
import { calculateAiScore, getRiskColor } from "../utils/viewleaseSectionHelpers/clauseHelpers";

interface ClauseHeaderProps {
  clause: any;
}

export const ClauseHeader: React.FC<ClauseHeaderProps> = ({ clause }) => {
  const aiScore = calculateAiScore(clause);
  const riskColor = getRiskColor(clause.risk);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Clause Review</h2>
        {clause.keyType === 'descriptive' && (
          <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded">
            Section Heading
          </span>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {clause.keyType === 'descriptive' 
                ? clause.title
                : clause.current_version}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${riskColor}`}>
              {clause.risk?.toLowerCase() || "low"}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              AI Score: {aiScore}%
            </span>
          </div>
        </div>
      </div>
    </>
  );
};