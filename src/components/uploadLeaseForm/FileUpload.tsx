// components/FileUpload.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { FormikTouched } from 'formik';
import { FileData, FormValues, SetFieldValue, ExtendedFormikErrors } from '@/types/loi';

interface FileUploadProps {
    uploadedFile: FileData | null;
    setUploadedFile: (file: FileData | null) => void;
    setFieldValue: SetFieldValue;
    errors: ExtendedFormikErrors;
    touched: FormikTouched<FormValues>;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    setUploadedFile,
    setFieldValue,
    errors,
}) => {
    const [dragActive, setDragActive] = useState<boolean>(false);

    const handleFileUpload = (file: File): void => {
        if (file) {
            const fileData: FileData = {
                name: file.name,
                size: (file.size / 1024).toFixed(2) + ' KB',
                type: file.type,
                file: file
            };
            setUploadedFile(fileData);
            setFieldValue('document', file);
        }
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Image alt="upload" src="/mini.png" height={20} width={20} className='mr-3 flex-shrink-0' />
                <span className="flex-1">Document Upload</span>
                <span className="text-red-500 ml-1">*</span>
            </h2>

            <div
                className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors ${dragActive
                    ? 'border-blue-400 bg-blue-50'
                    : errors.document 
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            handleFileUpload(file);
                        }
                    }}
                    className="hidden"
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="rounded-full p-4 mx-auto mb-4 flex items-center justify-center">
                        <Image alt="upload" src="/file.png" height={60} width={60} />
                    </div>
                    <p className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                        Drag and drop your lease documents
                    </p>
                    <p className="text-gray-500 mb-4 text-sm sm:text-base">
                        or click to browse and select files
                    </p>
                    <div>
                        <span className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block">
                            Choose Files
                        </span>
                        <div className="mt-4 text-sm sm:text-base font-semibold text-gray-500 space-y-1">
                            <p>Supported formats: PDF, DOCX</p>
                            <p>Maximum file size: 10MB</p>
                        </div>
                    </div>
                </label>
            </div>

            {errors.document  && (
                <div className="mt-2 text-red-500 text-sm">{errors.document}</div>
            )}
        </div>
    );
};