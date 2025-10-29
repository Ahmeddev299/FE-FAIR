// components/steps/BasicInformationStep.tsx
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { Info } from 'lucide-react';
import { PartyDropdowns } from '../../loi/steps/Dropdpwn';

export const BasicInformationStep: React.FC = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
    <p>Complete the essentials to draft your lease.</p>

    {/* Lease Details */}
    <div className="space-y-6 border border-gray-300 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">1</div>
        Lease Details
      </h3>

      {/* Lease Title (keep) */}
      <div>
        <label className="block text-sm font-medium mb-2">Lease Title *</label>
        <Field
          name="title"
          type="text"
          placeholder="e.g., Office Lease – 5233 Sugar Creek Center Blvd, Suite 150"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
      </div>

      {/* Lease Type (keep) */}
      <div>
        <label className="block text-sm font-medium mb-2">Lease Type *</label>
        <Field
          as="select"
          name="lease_type"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select</option>
          <option value="Office">Office</option>
          <option value="Retail">Retail</option>
          <option value="Industrial">Industrial</option>
          <option value="Other">Other</option>
        </Field>
        <ErrorMessage name="lease_type" component="div" className="text-red-500 text-sm mt-1" />
      </div>

      {/* Optional: automatic file number (client did not object) */}
      <div>
        <label className="flex items-center gap-2">
          <Field
            type="checkbox"
            name="addFileNumber"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Add automatic file number</span>
        </label>
      </div>
    </div>

    {/* Parties (single source of truth; removed duplicate landlord/tenant legal blocks) */}
    <PartyDropdowns
      landlordIdName="landlordId"
      landlordNameName="landlordName"
      landlordEmailName="landlordEmail"
      tenantIdName="tenantId"
      tenantNameName="tenantName"
      tenantEmailName="tenantEmail"
    />

    {/* Tip updated to mention "Lease" */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-blue-900">Pro Tip</h4>
          <p className="text-sm font-semibold text-blue-700 mt-1">
            Use a descriptive lease title that includes the property type and location.
          </p>
        </div>
      </div>
    </div>
  </div>
);
