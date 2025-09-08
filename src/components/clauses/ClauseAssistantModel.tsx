import React from "react";
import { Bot, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const AssistantModal: React.FC<Props> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-white/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Legal Assistant</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                I’m analyzing your lease clauses and can answer questions or suggest edits.
              </p>
              <ul className="mt-2 text-sm text-blue-700 space-y-1">
                <li>• Explain complex lease terms</li>
                <li>• Identify potential risks</li>
                <li>• Suggest alternative language</li>
                <li>• Compare clauses to market standards</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask me anything about this lease..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                Ask
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantModal;
