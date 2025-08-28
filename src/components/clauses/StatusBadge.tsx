// StatusBadge.tsx
import { Check, Edit, Sparkles, AlertCircle } from 'lucide-react';
import type { ClauseStatus } from '@/types/loi';

const toStatus = (s?: string): ClauseStatus =>
  s === 'Approved' || s === 'Edited' || s === 'Suggested' || s === 'Review' ? s : 'Review';

export default function StatusBadge({ status }: { status?: ClauseStatus | string }) {
  const safe = toStatus(status as any);
  const map = {
    Edited:    { cls: 'bg-purple-100 text-purple-700', Icon: Edit },
    Suggested: { cls: 'bg-blue-100 text-blue-700',    Icon: Sparkles },
    Approved:  { cls: 'bg-green-100 text-green-700',  Icon: Check },
    Review:    { cls: 'bg-orange-100 text-orange-700',Icon: AlertCircle },
  } as const;
  const { cls, Icon } = map[safe];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      <Icon className="h-4 w-4" />
      {safe}
    </span>
  );
}
