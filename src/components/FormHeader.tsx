// components/FormHeader.tsx
import React from 'react';
import { Save, FileText, Edit3 } from 'lucide-react';

interface FormHeaderProps {
  mode?: 'edit' | 'create';
  onSaveDraft: () => void;
  isLoading?: boolean;
  lastSaved?: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ 
  mode = 'create', 
  onSaveDraft, 
  isLoading = false,
  lastSaved 
}) => {
  const getTitle = () => {
    return mode === 'edit' ? 'Update Draft LOI' : 'Create New LOI';
  };

  const getSubtitle = () => {
    return mode === 'edit' 
      ? 'Update your existing Letter of Intent draft'
      : 'Complete the form to create your Letter of Intent';
  };

  const getIcon = () => {
    return mode === 'edit' ? <Edit3 className="w-6 h-6" /> : <FileText className="w-6 h-6" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            {getIcon()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getTitle()}
            </h1>
            <p className="text-gray-600 mt-1">
              {getSubtitle()}
            </p>
            {lastSaved && mode === 'edit' && (
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {new Date(lastSaved).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {lastSaved && (
            <div className="text-sm text-gray-500">
              Auto-saved
            </div>
          )}
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Saving...' : 'Save Draft'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};