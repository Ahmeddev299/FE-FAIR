// ============================================
// 8. LeaseHeader.tsx - Lease Header Component
// ============================================
import { ArrowLeft, MapPin } from "lucide-react";

interface LeaseHeaderProps {
  title: string;
  propertyAddress: string;
  onBack: () => void;
}

export const LeaseHeader: React.FC<LeaseHeaderProps> = ({ title, propertyAddress, onBack }) => (
  <div className="flex items-center gap-3">
    <button
      onClick={onBack}
      className="p-2 hover:bg-white rounded-lg transition-colors"
    >
      <ArrowLeft className="w-5 h-5 text-gray-600" />
    </button>
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
        <MapPin className="w-4 h-4" />
        {propertyAddress}
      </p>
    </div>
  </div>
);
