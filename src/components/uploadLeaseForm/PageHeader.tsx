// components/PageHeader.tsx
import React from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export const PageHeader: React.FC = () => (
    <div className="w-full max-w-7xl xl:max-w-none mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <div className="flex items-center mb-2">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Upload Lease Document</h1>
        </div>
        <p className="text-gray-600 ml-4 text-sm sm:text-base">
            Upload your lease document and let our AI analyze the terms and conditions automatically.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center mt-4 ml-4 bg-[#EFF6FF] p-4 space-y-2 sm:space-y-0 sm:space-x-4 rounded-lg">
            <div className="flex items-center">
                <FileText className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">Supported formats: PDF, DOCX</span>
            </div>
            <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">AI-powered analysis included</span>
            </div>
        </div>
    </div>
);