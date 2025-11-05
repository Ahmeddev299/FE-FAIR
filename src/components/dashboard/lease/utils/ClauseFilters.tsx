// ============================================
// 11. ClauseFilters.tsx - Filter & Search
// ============================================
import { Filter, Search } from "lucide-react";

interface ClauseFiltersProps {
  searchQuery: string;
  filterStatus: string;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string) => void;
}

export const ClauseFilters: React.FC<ClauseFiltersProps> = ({
  searchQuery,
  filterStatus,
  onSearchChange,
  onStatusChange,
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search clauses..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-gray-400" />
        <select
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>
  </div>
);