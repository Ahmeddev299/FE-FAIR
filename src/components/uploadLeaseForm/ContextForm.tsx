// components/ContextForm.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { CustomField } from './CustomFeilds';

export const ContextForm: React.FC = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center justify-between flex-wrap gap-2">
            <span className="flex items-center font-semibold min-w-0 flex-1">
                <AlertCircle className="w-6 h-6 mr-2 flex-shrink-0" />
                <span className="truncate">Context Information</span>
            </span>
            <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded flex-shrink-0">Required</span>
        </h3>

        <div className="space-y-4">
            <CustomField
                name="leaseTitle"
                label="Lease Title"
                placeholder="e.g., Downtown Office Lease Agreement"
                required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomField
                    name="startDate"
                    label="Start Date"
                    type="date"
                    required
                />
                <CustomField
                    name="endDate"
                    label="End Date"
                    type="date"
                    required
                />
            </div>

            <CustomField
                name="propertyAddress"
                label="Property Address"
                placeholder="123 Main Street, City, State, ZIP"
                required
            />

            <CustomField
                name="notes"
                label="Notes"
                as="textarea"
                rows={3}
                placeholder="Any additional notes or context about this lease"
            />
        </div>
    </div>
);