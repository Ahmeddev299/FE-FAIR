// components/steps/BasicInformationStep.tsx
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { Info } from 'lucide-react';

export const BasicInformationStep: React.FC = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
    <p>Lets start with the essential details about your LOI and the parties involved.</p>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LOI & Property Details */}
      <div className="space-y-6 border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">1</div>
          LOI & Property Details
        </h3>
        
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

        <div>
          <label className="block text-sm font-medium mb-2">Property Address *</label>
          <Field
            name="propertyAddress"
            type="text"
            placeholder="123 Main Street, City, State, ZIP"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <ErrorMessage name="propertyAddress" component="div" className="text-red-500 text-sm mt-1" />
        </div>
      </div>

      {/* Party Information */}
      <div className="space-y-6 border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">2</div>
          Party Information
        </h3>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Landlord Information</h4>
          <Field
            name="landlordName"
            type="text"
            placeholder="Property Owner or Management Company"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <ErrorMessage name="landlordName" component="div" className="text-red-500 text-sm mt-1" />
          
          <Field
            name="landlordEmail"
            type="email"
            placeholder="enter landlord email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <ErrorMessage name="landlordEmail" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Tenant Information</h4>
          <Field
            name="tenantName"
            type="text"
            placeholder="Your Company Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <ErrorMessage name="tenantName" component="div" className="text-red-500 text-sm mt-1" />
          
          <Field
            name="tenantEmail"
            type="email"
            placeholder="tenant@example.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <ErrorMessage name="tenantEmail" component="div" className="text-red-500 text-sm mt-1" />
        </div>
      </div>
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
