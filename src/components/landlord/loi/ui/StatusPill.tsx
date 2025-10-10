import clsx from "clsx";
import { Status } from "../types";

export const StatusPill = ({ s }: { s: Status }) => {
  const map: Record<Status, string> = {
    New: "bg-blue-100 text-blue-700",
    "In Review": "bg-amber-100 text-amber-700",
    Finalized: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-rose-100 text-rose-700",
  };
  return <span className={clsx("text-[11px] px-2 py-[3px] rounded-full", map[s])}>{s}</span>;
};
