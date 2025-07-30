// components/FormHeader.tsx
import React from 'react';
import { ChevronLeft, Save, Bot } from 'lucide-react';

type FormHeaderProps = {
  onSaveDraft: () => void;
};
export const FormHeader: React.FC<FormHeaderProps> = ({ onSaveDraft }) => (
  <div className="max-w-6xl rounded mx-auto bg-white border-b border-gray-200 px-4 py-4">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm sm:text-base">Back to LOI Dashboard</span>
        </button>
        <div className="hidden sm:block w-px h-8 bg-gray-300" />
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Create New LOI</h1>
          <p className="text-sm text-gray-600">Complete all steps to generate your Letter of Intent</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-4">
        <button
          type="button"
          onClick={onSaveDraft}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <Save className="w-4 h-4" />
          Save Draft
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-blue-600 rounded-md text-blue-600 hover:bg-blue-50">
          <Bot className="w-4 h-4" />
          AI Assistant
        </button>
      </div>
    </div>
  </div>
);