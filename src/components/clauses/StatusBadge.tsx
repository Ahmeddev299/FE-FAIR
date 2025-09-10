// src/components/clauses/StatusBadge.tsx
import { Check, Edit, Sparkles, AlertCircle, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ClauseStatus } from "@/types/loi";

type Props = {
  status?: ClauseStatus | string;
};

/** Use a local canonical union so we don't depend on project-wide variants */
type CanonicalStatus = "AI Suggested" | "Edited" | "Approved" | "Needs Review" | "Pending";

/** Parse loose strings -> canonical */
const parseStatusString = (value?: string): CanonicalStatus => {
  const v = (value ?? "").toLowerCase();

  if (v.includes("approve")) return "Approved";
  if (v.includes("ai") || v.includes("suggest")) return "AI Suggested"; // handles "Suggested"
  if (v.includes("review") || v.includes("need")) return "Needs Review"; // handles "Review"
  if (v.includes("edit")) return "Edited";
  if (v.includes("pending") || v.includes("wait") || v.includes("queue")) return "Pending";

  return "Pending";
};

/** Normalize incoming status (ClauseStatus|string) to our canonical union */
const toCanonical = (s?: ClauseStatus | string): CanonicalStatus => {
  switch (s) {
    case "Approved":
    case "Edited":
    case "AI Suggested":
    case "Needs Review":
    case "Pending":
      return s;
    default:
      return parseStatusString(typeof s === "string" ? s : undefined);
  }
};

export default function StatusBadge({ status }: Props) {
  const safe: CanonicalStatus = toCanonical(status);

  const map: Record<CanonicalStatus, { cls: string; Icon: LucideIcon }> = {
    "Edited":        { cls: "bg-purple-100 text-purple-700",  Icon: Edit },
    "AI Suggested":  { cls: "bg-blue-100 text-blue-700",      Icon: Sparkles },
    "Approved":      { cls: "bg-green-100 text-green-700",    Icon: Check },
    "Needs Review":  { cls: "bg-orange-100 text-orange-700",  Icon: AlertCircle },
    "Pending":       { cls: "bg-gray-100 text-gray-700",      Icon: Clock },
  };

  const { cls, Icon } = map[safe];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      <Icon className="h-4 w-4" />
      {safe}
    </span>
  );
}
