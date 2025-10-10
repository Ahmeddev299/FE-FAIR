import clsx from "clsx";
import { LOI } from "../types";
import { StatusPill } from "../ui/StatusPill";

export default function LOICard({
  loi, active, onClick,
}: { loi: LOI; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full text-left rounded-lg border p-3 transition bg-white hover:border-blue-300",
        active ? "border-blue-400 ring-1 ring-blue-400" : "border-gray-200"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0 flex-1">
          <div className="font-medium text-gray-900 text-sm mb-1">{loi.title}</div>
          <div className="text-xs text-gray-600">{loi.company}</div>
        </div>
        <StatusPill s={loi.status} />
      </div>

      <div className="text-xs text-gray-500 mb-1">{loi.address}</div>
      <div className="text-blue-600 font-semibold text-sm mb-2">{loi.rent}</div>
      <div className="text-xs text-gray-400">{loi.date}</div>

      <div className="flex items-center gap-3 text-xs mt-3 pt-2 border-t border-gray-100">
        <span className="text-emerald-600 font-medium">{loi.approved} approved</span>
        <span className="text-amber-600 font-medium">{loi.pending} pending</span>
      </div>
    </button>
  );
}
