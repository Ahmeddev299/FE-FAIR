import clsx from "clsx";
import { AlertTriangle, CheckCircle2, MessageSquare } from "lucide-react";
import { Clause } from "../types";
import { RiskDot } from "../ui/RiskBadge";

export default function ClauseCard({ c, active, onClick }: { c: Clause; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx("text-left rounded-lg border p-3 transition bg-white hover:border-blue-300",
        active ? "border-blue-400 ring-1 ring-blue-400" : "border-gray-200")}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="font-medium text-gray-900 text-sm">{c.title}</div>
        <RiskDot risk={c.risk} />
      </div>
      <div className="flex items-center gap-3 text-xs">
        {typeof c.approved === "number" && (
          <span className="inline-flex items-center gap-1 text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" /> {c.approved}
          </span>
        )}
        {typeof c.comments === "number" && c.comments > 0 && (
          <span className="inline-flex items-center gap-1 text-sky-600">
            <MessageSquare className="h-3.5 w-3.5" /> {c.comments}
          </span>
        )}
        {c.issue && (
          <span className="inline-flex items-center gap-1 text-rose-600 text-[11px]">
            <AlertTriangle className="h-3.5 w-3.5" /> {c.issue}
          </span>
        )}
      </div>
    </button>
  );
}
