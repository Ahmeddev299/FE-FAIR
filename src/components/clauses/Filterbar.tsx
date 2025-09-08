import React from "react";
import { Search } from "lucide-react";

type Props = {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  riskFilter: string;
  setRiskFilter: (v: string) => void;
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  categories: string[];
};

const FiltersBar: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  riskFilter,
  setRiskFilter,
  categoryFilter,
  setCategoryFilter,
  categories,
}) => (
  <div className="flex flex-col md:flex-row gap-3">
    <div className="relative w-full md:max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        placeholder="Search clauses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    <div className="flex gap-3 flex-1">
      <select
        value={riskFilter}
        onChange={(e) => setRiskFilter(e.target.value)}
        className="w-full md:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option>All Risk Levels</option>
        <option>Low Risk</option>
        <option>Medium Risk</option>
        <option>High Risk</option>
      </select>
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="w-full md:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option>All Categories</option>
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
    </div>
  </div>
);

export default FiltersBar;
