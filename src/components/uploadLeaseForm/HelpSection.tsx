// components/HelpSection.tsx
import React from 'react';
import { HelpCircle } from 'lucide-react';

export const HelpSection: React.FC = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <HelpCircle className="w-6 h-6 mr-2 flex-shrink-0" />
            Need Help?
        </h3>

        <p className="text-sm text-gray-600 mb-4">
            Having trouble uploading your lease document? Our support team is here to help.
        </p>

        <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Common issues:</p>
            <ul className="text-sm text-gray-600 space-y-1">
                <li>• File size too large (max 10MB)</li>
                <li>• Unsupported file format</li>
                <li>• Scanned documents need OCR enabled</li>
            </ul>
        </div>
    </div>
);