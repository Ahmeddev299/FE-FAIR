import Card from '@/components/ui/Card';

export default function ManagementProgress({
  approved, total, unresolved,
}: { approved: number; total: number; unresolved: number }) {
  const pct = total ? Math.round((approved / total) * 100) : 0;
  return (
    <Card className="p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-2">Management Progress</h4>
      <div className="text-xs text-gray-600 mb-2">Clauses Approved</div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div className="h-2 rounded-full bg-green-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-green-700 font-semibold">{approved}</div>
          <div className="text-xs text-gray-600">Approved</div>
        </div>
        <div>
          <div className="text-orange-700 font-semibold">{Math.max(total - approved - unresolved, 0)}</div>
          <div className="text-xs text-gray-600">Pending</div>
        </div>
        <div>
          <div className="text-red-700 font-semibold">{unresolved}</div>
          <div className="text-xs text-gray-600">Unresolved</div>
        </div>
      </div>
    </Card>
  );
}
