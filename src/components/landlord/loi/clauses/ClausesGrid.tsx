import React, { useMemo } from "react";
import { Clause } from "../types";
import ClauseCard from "./ClauseCard";

type Props = {
  clauses: Clause[];
  selectedId?: string | null;
  onSelect: (c: Clause) => void;
};

type ClauseStatus = "approved" | "pending" | "need-review" | "rejected";

/** Try common keys and normalize to a ClauseStatus, without using `any`. */
function extractStatus(c: Clause): ClauseStatus | undefined {
  const obj = c as unknown as Record<string, unknown>;
  const possible = [
    obj["status"],
    obj["status_landlord"],
    obj["statusTenant"],
    obj["decision"],
  ];

  const val = possible.find((v) => typeof v === "string") as string | undefined;
  if (!val) return undefined;

  // normalize minor variations if needed (e.g., "need_review" → "need-review")
  const normalized = val.replace(/_/g, "-").toLowerCase();

  if (
    normalized === "approved" ||
    normalized === "pending" ||
    normalized === "need-review" ||
    normalized === "rejected"
  ) {
    return normalized as ClauseStatus;
  }
  return undefined;
}

export default function ClausesGrid({ clauses, selectedId, onSelect }: Props) {
  const { approved, pending, needReview } = useMemo(() => {
    let a = 0,
      p = 0,
      r = 0;
    for (const c of clauses) {
      const st = extractStatus(c);
      switch (st) {
        case "approved":
          a++;
          break;
        case "pending":
          p++;
          break;
        case "need-review":
        case "rejected":
          r++;
          break;
        default:
          break;
      }
    }
    return { approved: a, pending: p, needReview: r };
  }, [clauses]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Clauses</h3>
        <div className="text-xs text-gray-500">
          <span className="text-emerald-600 font-medium">{approved} approved</span>
          <span className="mx-2">•</span>
          <span className="text-amber-600 font-medium">{pending} pending</span>
          <span className="mx-2">•</span>
          <span className="text-rose-600 font-medium">{needReview} need review</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {clauses.map((c) => {
          const isActive = selectedId != null ? c.id === selectedId : false;
          return (
            <ClauseCard
              key={c.id}
              c={c}
              active={isActive || undefined}
              onClick={() => onSelect(c)}
            />
          );
        })}
      </div>
    </div>
  );
}