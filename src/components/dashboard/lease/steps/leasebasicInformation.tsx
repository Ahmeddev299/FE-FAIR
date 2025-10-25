// components/steps/BasicInformationStep.tsx
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { Info } from 'lucide-react';
import { PartyDropdowns } from '../../loi/steps/Dropdpwn'; // (typo in path kept as-is to match your code)

export const BasicInformationStep: React.FC = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
    <p>Lets start with the essential details about your Lease and the parties involved.</p>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LOI & Property Details */}
      <div className="space-y-6 border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">1</div>
          Lease Details
        </h3>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Lease Title *</label>
          <Field
            name="title"
            type="text"
            placeholder="e.g., Downtown Office Space LOI"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        {/* Property Address */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">Property Address *</label>

          <Field
            name="property_address_S1"
            type="text"
            placeholder="Street Address Line 1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <ErrorMessage name="property_address_S1" component="div" className="text-red-500 text-sm" />

          <Field
            name="property_address_S2"
            type="text"
            placeholder="Street Address Line 2 (optional)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <ErrorMessage name="property_address_S2" component="div" className="text-red-500 text-sm" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field
              name="property_city"
              type="text"
              placeholder="City"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Field
              name="property_state"
              type="text"
              placeholder="State (e.g., CA)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Field
              name="property_zip"
              type="text"
              placeholder="ZIP (12345 or 12345-6789)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-6">
            <ErrorMessage name="property_city" component="div" className="text-sm text-red-500" />
            <ErrorMessage name="property_state" component="div" className="text-sm text-red-500" />
            <ErrorMessage name="property_zip" component="div" className="text-sm text-red-500" />
          </div>
        </div>

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

      {/* Parties & Governing Law (NEW) */}
      <div className="space-y-6 border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Lease Meta & Parties</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Party Posture</label>
            <Field as="select" name="party_posture" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Select</option>
              <option value="Landlord">Landlord</option>
              <option value="Tenant">Tenant</option>
            </Field>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Lease Type</label>
            <Field as="select" name="lease_type" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Select</option>
              <option value="Office">Office</option>
              <option value="Retail">Retail</option>
              <option value="Industrial">Industrial</option>
              <option value="Other">Other</option>
            </Field>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Governing State</label>
            <Field name="governing_law_state" placeholder="e.g., Texas" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Governing County</label>
            <Field name="governing_law_county" placeholder="e.g., Travis County" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold">Landlord (Legal)</h4>
            <Field name="landlord_legal_name" placeholder="Legal Name" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <Field name="landlord_notice_email" type="email" placeholder="Notice Email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold">Tenant (Legal)</h4>
            <Field name="tenant_legal_name" placeholder="Legal Name" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <Field name="tenant_notice_email" type="email" placeholder="Notice Email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>
    </div>

    {/* Party quick-selects (your existing dropdowns) */}
    <PartyDropdowns
      landlordIdName="landlordId"
      landlordNameName="landlordName"
      landlordEmailName="landlordEmail"
      tenantIdName="tenantId"
      tenantNameName="tenantName"
      tenantEmailName="tenantEmail"
    />

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-blue-900">Pro Tip</h4>
          <p className="text-sm font-semibold text-blue-700 mt-1">
            Use a descriptive LOI title that includes the property type and location.
          </p>
        </div>
      </div>
    </div>
  </div>
);
