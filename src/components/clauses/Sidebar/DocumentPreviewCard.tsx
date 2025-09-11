import Card from '@/components/ui/Card';
import { Eye } from 'lucide-react';

export default function DocumentPreviewCard({ onPreview }: { onPreview?: () => void }) {
  return (
    <Card className="p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-2">Document Preview</h4>
      <button
        onClick={onPreview}
        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
      >
        <Eye className="w-4 h-4" />
        Preview Updated Document
      </button>
      <p className="text-xs text-gray-500 mt-2">See how your changes will look in the final lease document.</p>
    </Card>
  );
}
