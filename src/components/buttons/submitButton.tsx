// components/SubmitButton.tsx
import React from 'react';
import { InlineLoader } from '../loaders/inlineLoader';

interface SubmitButtonProps {
    isSubmitting: boolean;
    onClick: () => void;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, onClick }) => (
    <div className="mt-8 bg-white p-4 sm:p-5 rounded-lg flex justify-end">
        <button
            onClick={onClick}
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
        >
            {isSubmitting ? (
               
                <InlineLoader
                />
            ) : (
                'Upload Lease'
            )}
        </button>
    </div>
);