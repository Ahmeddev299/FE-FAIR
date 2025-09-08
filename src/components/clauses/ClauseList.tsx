import React from "react";
import { Card } from "./ui";
import { HistoryMap } from "@/types/loi";
import ClauseListItem from "./ClauseListItem";

type Props = {
  categories: Record<string, string[]>;
  categoryFilter: string;
  filterFn: (names: string[]) => string[];
  history: HistoryMap;
  selectedClause: string | null;
  onSelect: (name: string) => void;
};

const ClauseList: React.FC<Props> = ({
  categories,
  categoryFilter,
  filterFn,
  history,
  selectedClause,
  onSelect,
}) => {
  return (
    <Card className="p-4">
      <h3 className="text-xs font-semibold text-gray-500 tracking-wide uppercase mb-3">Lease Clauses</h3>
      <div className="space-y-4">
        {Object.entries(categories).map(([category, clauses]) => {
          if (categoryFilter !== "All Categories" && categoryFilter !== category) return null;
          const filtered = filterFn(clauses);
          if (!filtered.length) return null;
          return (
            <section key={category} className="space-y-2">
              <h4 className="text-[11px] font-semibold text-gray-500 uppercase px-1">{category}</h4>
              <div className="space-y-2">
                {filtered.map((clauseName) => {
                  const clause = history[clauseName];
                  if (!clause) return null;
                  return (
                    <ClauseListItem
                      key={clauseName}
                      name={clauseName}
                      clause={clause}
                      selected={selectedClause === clauseName}
                      onClick={() => onSelect(clauseName)}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </Card>
  );
};

export default ClauseList;
