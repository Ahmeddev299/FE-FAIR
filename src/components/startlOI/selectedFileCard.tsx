import { FileText, Trash2, UploadCloud, CheckCircle2 } from "lucide-react";
import React from "react";

export type FileData = { name: string; size: string; type: string; file: File };

type Props = {
  file: FileData;
  progress: number;
  uploading: boolean;
  onRemove: () => void;
  onSubmit: () => void;
};

export function SelectedFileCard({ file, progress, uploading, onRemove, onSubmit }: Props) {
  return (
    <div className="mx-auto mt-5 max-w-2xl rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <FileText className="mt-0.5 h-6 w-6 text-blue-600" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-sm font-medium text-gray-900">{file.name}</div>
            <button onClick={onRemove} className="rounded p-1 hover:bg-gray-100" aria-label="Remove">
              <Trash2 className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div className="mt-0.5 text-xs text-gray-500">• {file.size}</div>

          {uploading ? (
            <div className="mt-3">
              <div className="h-2 w-full rounded bg-gray-100">
                <div
                  className="h-2 rounded bg-blue-600 transition-[width]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-gray-500">{progress}%</div>
            </div>
        ) : progress === 100 ? (
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Uploaded
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end">
        <button
          onClick={onSubmit}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <UploadCloud className="h-4 w-4" />
          Submit &amp; Process
        </button>
      </div>
    </div>
  );
}
