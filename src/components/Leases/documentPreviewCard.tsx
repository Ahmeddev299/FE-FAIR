'use client';

import { Eye } from 'lucide-react';

type Props = { onPreview: () => void; disabled?: boolean };

export default function DocumentPreviewCard({ onPreview, disabled = false }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-gray-900">Document Preview</h4>

      <div className="mt-3">
        <button
          type="button"
          onClick={onPreview}
          disabled={disabled}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          <Eye className="w-4 h-4" />
          Preview Updated Document
        </button>

        <p className="mt-2 text-xs text-gray-500">
          See how your changes will look in the final lease document
        </p>
      </div>
    </div>
  );
}
