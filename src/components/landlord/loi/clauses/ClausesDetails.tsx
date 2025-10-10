import { MessageSquare, ShieldCheck, XCircle, CheckCircle } from "lucide-react";
import { Clause } from "../types";
import { RiskBadge } from "../ui/RiskBadge";
import { ChipBtn, IconBtn, PrimaryBtn } from "../ui/Buttons";

export default function ClauseDetail({ clause }: { clause: Clause }) {
  if (!clause) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
        <div className="flex items-center gap-2 min-w-0">
          <div className="font-semibold text-gray-900 text-sm truncate">{clause.title}</div>
          <RiskBadge risk={clause.risk} />
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto [&>*]:shrink-0">
          <ChipBtn label="Compliant" icon={<ShieldCheck className="h-3.5 w-3.5" />} />
          <ChipBtn label="Reject" className="border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
            icon={<XCircle className="h-3.5 w-3.5 text-red-600" />} />
          <PrimaryBtn label="Approve" icon={<CheckCircle className="h-4 w-4" />} />
          <IconBtn label="Comment" icon={<MessageSquare className="h-4 w-4" />} />
        </div>
      </div>

      {/* Body */}
      <div className="p-3 sm:p-4 space-y-3">
        <div className="border border-gray-200 rounded-lg bg-gray-50">
          <div className="px-3 py-2 text-xs font-medium text-gray-700 border-b border-gray-200 bg-white">Clause Text</div>
          <div className="px-3 py-3 text-sm text-gray-700 leading-relaxed">{clause.text}</div>
        </div>

        {clause.aiNote && (
          <div className="border border-blue-200 rounded-lg bg-blue-50">
            <div className="px-3 py-2 text-xs font-medium text-blue-900 border-b border-blue-200 bg-blue-100 flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              AI Analysis
            </div>
            <div className="px-3 py-3 text-sm text-blue-900 leading-relaxed">{clause.aiNote}</div>
          </div>
        )}
      </div>
    </div>
  );
}
