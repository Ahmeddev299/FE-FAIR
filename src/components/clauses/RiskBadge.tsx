// RiskBadge.tsx
import { AlertTriangle, Clock, Check } from 'lucide-react';
import type { RiskLevel } from '@/types/loi';

const toRisk = (r?: string): RiskLevel => (r === 'High' || r === 'Medium' || r === 'Low' ? r : 'Low');

export default function RiskBadge({ risk }: { risk?: RiskLevel | string }) {
  const safe = toRisk(risk as any);
  const icon =
    safe === 'High' ? <AlertTriangle className="h-4 w-4" /> :
    safe === 'Medium' ? <Clock className="h-4 w-4" /> :
    <Check className="h-4 w-4" />;
  const cls =
    safe === 'High' ? 'text-red-600' :
    safe === 'Medium' ? 'text-yellow-600' : 'text-green-600';
  return (
    <div className="flex items-center gap-1">
      {icon}
      <span className={`text-sm font-medium ${cls}`}>{safe}</span>
    </div>
  );
}
