/* eslint-disable @typescript-eslint/no-explicit-any */

import { CheckCircle2, XCircle, Clock, type LucideIcon } from "lucide-react";

type KnownStatus = "approved" | "rejected" | "pending";

interface StatusBadgeProps {
  status?: string; // allow arbitrary input; we normalize/fallback
}

const CONFIGS: Record<KnownStatus, { bg: string; text: string; border: string; icon: LucideIcon }> = {
  approved: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle2 },
  rejected: { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200",    icon: XCircle },
  pending:  { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   icon: Clock },
} as const;

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const s = (status ?? "pending").toLowerCase();

  // map arbitrary strings to our KnownStatus keys
  const key: KnownStatus =
    s === "approved" ? "approved" :
    s === "rejected" ? "rejected" :
    "pending";

  const cfg = CONFIGS[key];
  const Icon = cfg.icon;
  const label = key.charAt(0).toUpperCase() + key.slice(1);

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};
