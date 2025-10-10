import { Clause } from "../types";
import ClauseCard from "./ClauseCard";

export default function ClausesGrid({
  clauses, selectedId, onSelect,
}: { clauses: Clause[]; selectedId?: string | null; onSelect: (c: Clause) => void; }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Clauses</h3>
        <div className="text-xs text-gray-500">
          <span className="text-emerald-600 font-medium">1 approved</span>
          <span className="mx-2">•</span>
          <span className="text-amber-600 font-medium">2 pending</span>
          <span className="mx-2">•</span>
          <span className="text-rose-600 font-medium">1 need review</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {clauses.map((c) => (
          <ClauseCard key={c.id} c={c} active={c.id === selectedId ?? undefined} onClick={() => onSelect(c)} />
        ))}
      </div>
    </div>
  );
}
