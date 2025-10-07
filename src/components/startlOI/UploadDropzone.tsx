import { UploadCloud } from "lucide-react";
import React from "react";

type DragHandlers = {
  onDragEnter: React.DragEventHandler<HTMLDivElement>;
  onDragOver: React.DragEventHandler<HTMLDivElement>;
  onDragLeave: React.DragEventHandler<HTMLDivElement>;
  onDrop: React.DragEventHandler<HTMLDivElement>;
};

type Props = {
  dragActive: boolean;
  onPick: () => void;
  dragHandlers: DragHandlers;
};

export function UploadDropzone({ dragActive, onPick, dragHandlers }: Props) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 sm:p-5">
      <h3 className="mb-3 flex items-center justify-center gap-2 text-sm font-medium text-gray-900">
        <UploadCloud className="h-4 w-4 text-blue-600" />
        LOI Document Upload
      </h3>

      <div
        {...dragHandlers}
        className={`rounded-xl border-2 border-dashed p-7 sm:p-9 text-center transition-all ${
          dragActive ? "border-blue-400 bg-blue-50/60" : "border-gray-300 bg-white"
        }`}
      >
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
          <UploadCloud className="h-9 w-9 text-blue-600" />
        </div>

        <div className="text-sm font-medium text-gray-900">Drag and drop your loi documents</div>
        <div className="mb-4 text-xs text-gray-500">or click to browse and select files</div>

        <button
          onClick={onPick}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Choose Files
        </button>

        <div className="mt-4 space-y-1 text-xs font-semibold text-gray-500">
          <p>Supported formats: PDF, DOCX</p>
          <p>Maximum file size: 10MB</p>
        </div>
      </div>
    </div>
  );
}
