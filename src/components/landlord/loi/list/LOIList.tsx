import { useMemo, useCallback } from "react";
import LOICard from "./LOICard";
import SearchInput from "../ui/SearchInput";
import Dropdown from "../ui/Dropdown";
import { LOI } from "../types";

type Props = {
  all: LOI[];
  selectedId?: string | null;
  onSelect: (l: LOI) => void;
  query: string;
  setQuery: (v: string) => void;
  statusFilter: "All" | LOI["status"]; // e.g. "New" | "In Review" | ...
  setStatusFilter: (v: "All" | LOI["status"]) => void;
  tenantFilter: "All Tenants" | string;
  setTenantFilter: (v: "All Tenants" | string) => void;
};

const STATUS_ITEMS = ["All", "New", "In Review", "Finalized", "Rejected"] as const;
type StatusItem = (typeof STATUS_ITEMS)[number];

export default function LOIList({
  all,
  selectedId,
  onSelect,
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  tenantFilter,
  setTenantFilter,
}: Props) {
  // strictly-typed change handlers (no any / no casts)
  const handleStatusChange = useCallback(
    (v: string) => {
      if (STATUS_ITEMS.includes(v as StatusItem)) {
        // v is now narrowed to "All" | "New" | "In Review" | "Finalized" | "Rejected"
        setStatusFilter(v as "All" | LOI["status"]);
      }
    },
    [setStatusFilter]
  );

  const handleTenantChange = useCallback(
    (v: string) => {
      // our type is "All Tenants" | string; a raw string satisfies it
      setTenantFilter(v);
    },
    [setTenantFilter]
  );

  const filtered = useMemo(() => {
    let list = [...all];
    const q = query.trim().toLowerCase();

    if (q) {
      list = list.filter((l) => {
        const title = l.title?.toLowerCase() ?? "";
        const company = l.company?.toLowerCase() ?? "";
        const address = l.address?.toLowerCase() ?? "";
        return title.includes(q) || company.includes(q) || address.includes(q);
      });
    }

    if (statusFilter !== "All") {
      list = list.filter((l) => l.status === statusFilter);
    }

    if (tenantFilter !== "All Tenants") {
      list = list.filter((l) => l.tenantName === tenantFilter);
    }

    return list;
  }, [all, query, statusFilter, tenantFilter]);

  const tenants = useMemo(
    () => Array.from(new Set(all.map((l) => l.tenantName).filter(Boolean))) as string[],
    [all]
  );

  return (
    <aside className="border-b lg:border-b-0 lg:border-r border-gray-200 p-4 md:p-5 bg-gray-50 lg:col-span-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-semibold text-gray-900">LOIs</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
          {filtered.length}
        </span>
      </div>

      <div className="mb-3">
        <SearchInput value={query} onChange={setQuery} placeholder="Search LOIs..." />
      </div>

      <Dropdown
        className="mb-2"
        value={statusFilter}
        onChange={handleStatusChange}
        items={[...STATUS_ITEMS]}
      />

      <Dropdown
        className="mb-4"
        value={tenantFilter}
        onChange={handleTenantChange}
        items={["All Tenants", ...tenants]}
      />

      <div className="space-y-2 max-h-[68vh] overflow-y-auto pr-1">
        {filtered.map((l) => {
          const isActive = selectedId != null ? l.id === selectedId : false;
          return (
            <LOICard
              key={l.id}
              loi={l}
              active={isActive || undefined}
              onClick={() => onSelect(l)}
            />
          );
        })}
      </div>
    </aside>
  );
}
