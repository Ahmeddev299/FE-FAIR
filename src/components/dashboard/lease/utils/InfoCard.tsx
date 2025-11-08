/* eslint-disable @typescript-eslint/no-explicit-any */

interface InfoCardProps {
  icon: any;
  label: string;
  value?: React.ReactNode;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 ${className}`}>
    <div className="flex items-center gap-2 text-gray-600 text-xs font-medium mb-1">
      <Icon className="w-4 h-4" />
      {label}
    </div>
    <div className="text-sm font-semibold text-gray-900">{value || "—"}</div>
  </div>
);
