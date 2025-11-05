import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface StatusBadgeProps {
  status?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const s = (status || "pending").toLowerCase();
  const configs: Record<string, { bg: string; text: string; border: string; icon: any }> = {
    approved: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle2 },
    rejected: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: XCircle },
    pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: Clock },
  };
  const config = configs[s] || configs.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-3.5 h-3.5" />
      {status?.charAt(0).toUpperCase() + status?.slice(1) || "Pending"}
    </span>
  );
};