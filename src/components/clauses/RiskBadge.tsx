// RiskBadge.tsx
import { AlertTriangle, Clock, Check } from 'lucide-react';
import type { RiskLevel } from '@/types/loi';

type Props = {
  risk?: RiskLevel | string; // accepts strict RiskLevel or free-form strings like "High (8/10)"
};

// Parse a string like "High", "Medium", "Low", "High (8/10)", or "8/10" to a RiskLevel
const parseRiskString = (value?: string): RiskLevel => {
  if (!value) return 'Low';

  // Try "(\d+)/10"
  const numeric = value.match(/(\d+)\s*\/\s*10/);
  if (numeric) {
    const n = parseInt(numeric[1], 10);
    if (n >= 8) return 'High';
    if (n >= 5) return 'Medium';
    return 'Low';
  }

  const v = value.toLowerCase();
  if (v.includes('high')) return 'High';
  if (v.includes('medium')) return 'Medium';
  if (v.includes('low')) return 'Low';
  return 'Low';
};

// Normalize to RiskLevel without using `any`
const toRisk = (r?: RiskLevel | string): RiskLevel =>
  r === 'High' || r === 'Medium' || r === 'Low' ? r : parseRiskString(r);

export default function RiskBadge({ risk }: Props) {
  const safe: RiskLevel = toRisk(risk);

  const icon =
    safe === 'High' ? <AlertTriangle className="h-4 w-4" /> :
    safe === 'Medium' ? <Clock className="h-4 w-4" /> :
    <Check className="h-4 w-4" />;

  const cls =
    safe === 'High' ? 'text-red-600' :
    safe === 'Medium' ? 'text-yellow-600' :
    'text-green-600';

  return (
    <div className="flex items-center gap-1">
      {icon}
      <span className={`text-sm font-medium ${cls}`}>{safe}</span>
    </div>
  );
}
