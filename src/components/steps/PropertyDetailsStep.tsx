
// components/steps/PropertyDetailsStep.tsx
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { Info } from 'lucide-react';

export const PropertyDetailsStep: React.FC = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold mb-4">Property Details</h3>
    <p>Specify the physical characteristics and requirements for the property.</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Space Specifications */}
      <div className="space-y-6 border border-gray-300 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">Space Specifications</h4>

        <div>
          <label className="block text-sm font-medium mb-2">Property Size *</label>
          <div className="flex gap-2">
            <Field
              name="propertySize"
              type="text"
              placeholder="2500"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-500">sq ft</span>
          </div>
          <ErrorMessage name="propertySize" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Intended Use *</label>
          <Field
            name="intendedUse"
            type="text"
            placeholder="e.g., Corporate headquarters, Retail store"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <ErrorMessage name="intendedUse" component="div" className="text-red-500 text-sm mt-1" />
        </div>
      </div>

      {/* Amenities and Services */}
      <div className="space-y-6 border border-gray-300 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">Amenities and Services</h4>

        <div>
          <label className="block text-sm font-medium mb-2">Parking Spaces Required</label>
          <Field
            name="parkingSpaces"
            type="number"
            placeholder="10"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    {/* Utilities & Services Included */}
    <div className="border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-yellow-500">⚡</span>
        <h4 className="text-sm font-semibold">Utilities & Services Included</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-sm text-gray-800">
        {[
          { name: 'utilities.electricity', label: 'Electricity' },
          { name: 'utilities.waterSewer', label: 'Water/Sewer' },
          { name: 'utilities.naturalGas', label: 'Natural Gas' },
          { name: 'utilities.internetCable', label: 'Internet/Cable' },
          { name: 'utilities.hvac', label: 'HVAC' },
          { name: 'utilities.securitySystem', label: 'Security System' },
        ].map(({ name, label }) => (
          <label key={name} className="flex items-center gap-2">
            <Field
              name={name}
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            {label}
          </label>
        ))}
      </div>
    </div>

    <div className="bg-[#F0FDF4] border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-[#34A853] mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-[#34A853]">Lease Type Guide</h4>
          <p className="text-sm font-bold text-[#34A853] mt-1">
            There are four main types of lease guide. Triple Net (NNN), Gross Lease, Modified Gross and Percentage Lease.
          </p>
        </div>
      </div>
    </div>
  </div>
);