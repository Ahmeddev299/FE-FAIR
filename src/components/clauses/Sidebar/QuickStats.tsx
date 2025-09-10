import Card from '@/components/ui/Card';

export default function QuickStats({
  total, completionRate, openComments,
}: { total: number; completionRate: number; openComments: number }) {
  return (
    <Card className="p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Total Clauses:</span>
          <span className="text-gray-900 font-medium">{total}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Completion Rate:</span>
          <span className="text-gray-900 font-medium">{completionRate}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Open Comments:</span>
          <span className="text-gray-900 font-medium">{openComments}</span>
        </div>
      </div>
    </Card>
  );
}
