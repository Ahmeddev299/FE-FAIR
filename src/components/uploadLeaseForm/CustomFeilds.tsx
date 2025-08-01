// components/CustomField.tsx
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { CustomFieldProps } from '@/types/loi';

export const CustomField: React.FC<CustomFieldProps> = ({
    name,
    label,
    type = 'text',
    placeholder,
    as = 'input',
    rows,
    required = false
}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Field
            name={name}
            type={type}
            placeholder={placeholder}
            as={as}
            rows={rows}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
        <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
    </div>
);