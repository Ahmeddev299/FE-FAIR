import React from "react";
import { ArrowLeft, Bot, Download, FileText } from "lucide-react";

type Props = {
  title: string;
  onBack: () => void;
  onExportSummary: () => void;
  onDownloadPDF: () => void;
  onOpenAI: () => void;
};

const TopToolbar: React.FC<Props> = ({ title, onBack, onExportSummary, onDownloadPDF, onOpenAI }) => {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="hidden sm:flex items-center text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Back to Upload</span>
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Lease Clause Review</h1>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <FileText className="w-3 h-3" />
                <span>{title || "Lease Document"}</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onExportSummary}
              className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" /> Export Summary
            </button>
            <button
              onClick={onDownloadPDF}
              className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </button>
            <button
              onClick={onOpenAI}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              <Bot className="w-4 h-4 mr-2" /> AI Assistant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopToolbar;
