import Card from '@/components/ui/Card';
import { AlertTriangle } from 'lucide-react';

export default function ReadyToProceed() {
  return (
    <Card className="p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-2">Ready to Proceed?</h4>
      <div className="flex items-start gap-2 text-xs bg-yellow-50 border border-yellow-200 rounded p-3">
        <AlertTriangle className="w-4 h-4 text-yellow-700 mt-0.5" />
        <p className="text-yellow-800">
          Please approve or reject all clauses before proceeding to signature.
        </p>
      </div>
      <button
        disabled
        className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md bg-gray-200 text-gray-500 cursor-not-allowed"
      >
        Proceed to Signature
      </button>
    </Card>
  );
}
