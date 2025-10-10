import { useMemo } from "react";
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
  statusFilter: "All" | LOI["status"];
  setStatusFilter: (v: "All" | LOI["status"]) => void;
  tenantFilter: "All Tenants" | string;
  setTenantFilter: (v: "All Tenants" | string) => void;
};

export default function LOIList({
  all, selectedId, onSelect, query, setQuery, statusFilter, setStatusFilter, tenantFilter, setTenantFilter,
}: Props) {
  const filtered = useMemo(() => {
    let list = [...all];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "All") list = list.filter((l) => l.status === statusFilter);
    if (tenantFilter !== "All Tenants") list = list.filter((l) => l.tenantName === tenantFilter);
    return list;
  }, [all, query, statusFilter, tenantFilter]);

  const tenants = Array.from(new Set(all.map((l) => l.tenantName)));

  return (
    <aside className="border-b lg:border-b-0 lg:border-r border-gray-200 p-4 md:p-5 bg-gray-50 lg:col-span-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-semibold text-gray-900">LOIs</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">{filtered.length}</span>
      </div>

      <div className="mb-3"><SearchInput value={query} onChange={setQuery} placeholder="Search LOIs..." /></div>

      <Dropdown className="mb-2" value={statusFilter} onChange={(v) => setStatusFilter(v as any)}
        items={["All", "New", "In Review", "Finalized", "Rejected"]} />
      <Dropdown className="mb-4" value={tenantFilter} onChange={(v) => setTenantFilter(v as any)}
        items={["All Tenants", ...tenants]} />

      <div className="space-y-2 max-h-[68vh] overflow-y-auto pr-1">
        {filtered.map((l) => (
          <LOICard key={l.id} loi={l} active={l.id === selectedId ?? undefined} onClick={() => onSelect(l)} />
        ))}
      </div>
    </aside>
  );
}
