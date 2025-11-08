/* eslint-disable @typescript-eslint/no-explicit-any */

// components/steps/BasicInformationStep.tsx
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { Info } from 'lucide-react';

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export const BasicInformationStep: React.FC = () => {

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
      <p>Complete the essentials to draft your lease.</p>

      {/* Lease Details */}
      <div className="space-y-6 border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">1</div>
          Lease Details
        </h3>

        {/* Lease Title */}
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

        {/* Lease Type */}
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

        {/* Optional: automatic file number */}
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

      {/* Landlord Information */}
      <div className="space-y-6 border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">2</div>
          Landlord Information
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Landlord Name *</label>
            <Field
              name="landlordName"
              type="text"
              placeholder="Enter landlord name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name="landlordName" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Landlord Email *</label>
            <Field
              name="landlordEmail"
              type="email"
              placeholder="landlord@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name="landlordEmail" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Landlord Address *</label>
          <Field
            name="landlord_address_S1"
            type="text"
            placeholder="Street Address Line 1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-3"
          />
          <ErrorMessage name="landlord_address_S1" component="div" className="text-red-500 text-sm mb-3" />

          <Field
            name="landlord_address_S2"
            type="text"
            placeholder="Street Address Line 2 (optional)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Field
              name="landlord_city"
              type="text"
              placeholder="City"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name="landlord_city" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <Field
              as="select"
              name="landlord_state"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">State</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Field>
            <ErrorMessage name="landlord_state" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <Field
              name="landlord_zip"
              type="text"
              placeholder="ZIP"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name="landlord_zip" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        </div>
      </div>

      {/* Tenant Information */}
      <div className="space-y-6 border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">3</div>
          Tenant Information
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Tenant Name *</label>
            <Field
              name="tenantName"
              type="text"
              placeholder="Enter tenant name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name="tenantName" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tenant Email *</label>
            <Field
              name="tenantEmail"
              type="email"
              placeholder="tenant@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name="tenantEmail" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tenant Address *</label>
          <Field
            name="tenant_address_S1"
            type="text"
            placeholder="Street Address Line 1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-3"
          />
          <ErrorMessage name="tenant_address_S1" component="div" className="text-red-500 text-sm mb-3" />

          <Field
            name="tenant_address_S2"
            type="text"
            placeholder="Street Address Line 2 (optional)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Field
              name="tenant_city"
              type="text"
              placeholder="City"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name="tenant_city" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <Field
              as="select"
              name="tenant_state"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">State</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Field>
            <ErrorMessage name="tenant_state" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <Field
              name="tenant_zip"
              type="text"
              placeholder="ZIP"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name="tenant_zip" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        </div>
      </div>

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
};