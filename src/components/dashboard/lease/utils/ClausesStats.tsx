// ============================================
// 10. ClauseStats.tsx - Clause Statistics
// ============================================
interface ClauseStatsProps {
  stats: {
    total: number;
    approved: number;
    rejected: number;
    pending: number;
  };
}

export const ClauseStats: React.FC<ClauseStatsProps> = ({ stats }) => {
  const progress = stats.total > 0 ? ((stats.approved + stats.rejected) / stats.total) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Clause Review Progress</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600 mt-1">Total Clauses</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-600">{stats.approved}</div>
          <div className="text-sm text-gray-600 mt-1">Approved</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-rose-600">{stats.rejected}</div>
          <div className="text-sm text-gray-600 mt-1">Rejected</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
          <div className="text-sm text-gray-600 mt-1">Pending</div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Review Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
