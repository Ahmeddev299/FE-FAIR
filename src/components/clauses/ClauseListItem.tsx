import React from "react";
import { ClauseData } from "@/types/loi";
import { RiskPill, StatusBadge, getRiskColor, getRiskIcon } from "./ui";

type Props = {
  name: string;
  clause: ClauseData;
  selected: boolean;
  onClick: () => void;
};

const ClauseListItem: React.FC<Props> = ({ name, clause, selected, onClick }) => {
  const tone = getRiskColor(clause.risk);
  const Icon = getRiskIcon(clause.risk);
  const iconTone = tone === "red" ? "text-red-500" : tone === "yellow" ? "text-yellow-500" : "text-green-500";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left group rounded-lg p-3 border transition-all flex flex-col gap-2
        ${selected ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50 border-gray-200"}`}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white ring-2 ring-gray-100">
          <Icon className={`w-4 h-4 ${iconTone}`} />
        </span>
        <span className={`truncate text-sm ${selected ? "text-blue-700" : "text-gray-800"}`}>{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <RiskPill risk={clause.risk} />
        <StatusBadge status={clause.status} />
      </div>
    </button>
  );
};

export default ClauseListItem;
