import { Circle } from "lucide-react";
import { Risk } from "../types";

export function RiskBadge({ risk }: { risk: Risk }) {
  const styles = {
    Low: "text-green-800 bg-green-50 ring-green-200",
    Medium: "text-amber-800 bg-amber-50 ring-amber-200",
    High: "text-red-800 bg-red-50 ring-red-200",
  }[risk];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${styles}`}>
      <Circle className="h-3 w-3" strokeWidth={2} />
      {risk} Risk
    </span>
  );
}

export const RiskDot = ({ risk }: { risk: Risk }) => {
  const c = risk === "Low" ? "text-emerald-500" : risk === "Medium" ? "text-amber-500" : "text-rose-500";
  return <Circle className="h-3 w-3" fill="currentColor" />;
};
