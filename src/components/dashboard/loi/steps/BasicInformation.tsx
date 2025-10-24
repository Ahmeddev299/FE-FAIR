// components/steps/BasicInformationStep.tsx
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { Info } from 'lucide-react';
import { PartyDropdowns } from './Dropdpwn';

export const BasicInformationStep: React.FC = () => (
 <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
      <p>Lets start with the essential details about your LOI and the parties involved.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LOI & Property Details */}
        <div className="space-y-6 border border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">1</div>
            LOI & Property DetailsP
          </h3>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">LOI Title *</label>
            <Field
              name="title"
              type="text"
              placeholder="e.g., Downtown Office Space LOI"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Property Address (structured) */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Property Address *</label>

            {/* Street 1 */}
            <Field
              name="property_address_S1"
              type="text"
              placeholder="Street Address Line 1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <ErrorMessage name="property_address_S1" component="div" className="text-red-500 text-sm" />

            {/* Street 2 (optional) */}
            <Field
              name="property_address_S2"
              type="text"
              placeholder="Street Address Line 2 (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <ErrorMessage name="property_address_S2" component="div" className="text-red-500 text-sm" />

            {/* City / State / ZIP */}
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

            {/* grouped errors like your example */}
            <div className="flex gap-6">
              <ErrorMessage name="property_city" component="div" className="text-sm text-red-500" />
              <ErrorMessage name="property_state" component="div" className="text-sm text-red-500" />
              <ErrorMessage name="property_zip" component="div" className="text-sm text-red-500" />
            </div>
          </div>

          {/* Add file number */}
          <div>
            <label className="flex items-center gap-2">
              <Field
                type="checkbox"
                name="addFileNumber"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Add automatic file number</span>
              {/* Preview (optional) */}
              {/** If you want a live preview, uncomment this line: */}
              {/* <span className="text-xs text-gray-600 ml-2">Preview: {fileNumber}</span> */}
            </label>
          </div>
        </div>

        {/* Party Information (uses your updated structured addr + ErrorMessage) */}
        <PartyDropdowns
          landlordIdName="landlordId"
          landlordNameName="landlordName"
          landlordEmailName="landlordEmail"
          tenantIdName="tenantId"
          tenantNameName="tenantName"
          tenantEmailName="tenantEmail"
        />
      </div>

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
