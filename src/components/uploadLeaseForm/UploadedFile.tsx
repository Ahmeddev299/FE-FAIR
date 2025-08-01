// components/UploadedFiles.tsx
import React from 'react';
import { FileText, X, CheckCircle } from 'lucide-react';
import { FileData, SetFieldValue } from '@/types/loi';

interface UploadedFilesProps {
    uploadedFile: FileData;
    setUploadedFile: (file: FileData | null) => void;
    setFieldValue: SetFieldValue;
}

export const UploadedFiles: React.FC<UploadedFilesProps> = ({
    uploadedFile,
    setUploadedFile,
    setFieldValue
}) => {
    const removeFile = (): void => {
        setUploadedFile(null);
        setFieldValue('document', null);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                Uploaded Files (1)
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 p-4 rounded-lg gap-4">
                <div className="flex items-start sm:items-center flex-1 min-w-0">
                    <FileText className="w-8 h-8 text-blue-600 mr-3 mt-1 sm:mt-0 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 break-words">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500">
                            {uploadedFile.size} • {uploadedFile.type.includes('pdf') ? 'PDF' : 'DOCX'}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700 transition-colors self-end sm:self-auto flex-shrink-0"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};