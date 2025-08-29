// StatusBadge.tsx
import { Check, Edit, Sparkles, AlertCircle } from 'lucide-react';
import type { ClauseStatus } from '@/types/loi';

type Props = {
  status?: ClauseStatus | string;
};

// Parse loose strings like "approved", "needs review", etc. -> ClauseStatus
const parseStatusString = (value?: string): ClauseStatus => {
  if (!value) return 'Review';
  const v = value.toLowerCase();
  if (v.includes('approve')) return 'Approved';
  if (v.includes('edit')) return 'Edited';
  if (v.includes('suggest')) return 'Suggested';
  if (v.includes('review')) return 'Review';
  return 'Review';
};

// Normalize to ClauseStatus without using `any`
const toStatus = (s?: ClauseStatus | string): ClauseStatus =>
  s === 'Approved' || s === 'Edited' || s === 'Suggested' || s === 'Review'
    ? s
    : parseStatusString(s);

export default function StatusBadge({ status }: Props) {
  const safe: ClauseStatus = toStatus(status);

  const map = {
    Edited:    { cls: 'bg-purple-100 text-purple-700',  Icon: Edit },
    Suggested: { cls: 'bg-blue-100 text-blue-700',      Icon: Sparkles },
    Approved:  { cls: 'bg-green-100 text-green-700',    Icon: Check },
    Review:    { cls: 'bg-orange-100 text-orange-700',  Icon: AlertCircle },
  } satisfies Record<ClauseStatus, { cls: string; Icon: typeof Check }>;

  const { cls, Icon } = map[safe];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      <Icon className="h-4 w-4" />
      {safe}
    </span>
  );
}
