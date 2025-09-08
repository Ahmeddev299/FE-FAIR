// components/steps/PropertyDetailsStep.tsx
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { Info, Building2, Car, Zap } from 'lucide-react';

const PROPERTY_TYPES = [
  'Shopping Center',
  'Office',
  'Storage Space',
  'Retail',
  'Restaurant',
  'Medical',
  'Technology',
  'Manufacturing',  
'Warehouse',
  'Warehouse/Industrial',
  'Mixed-use',
  'Education',
  'Service',
  'Other',
];

const PARKING_OPTIONS = [
  '0–2', '3–5', '6–7', '8–10', '11–15', '16–20', '21+',
];

export const PropertyDetailsStep: React.FC = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold mb-4">Property Details</h3>
    <p>Specify the physical characteristics and requirements for the property.</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Space Specifications */}
      <div className="space-y-6 border border-gray-300 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-purple-500" />
          <span>Space Specifications</span>
        </h4>

        {/* Property Size */}
        <div>
          <label className="block text-sm font-medium mb-2">Property Size (sq ft) *</label>
          <div className="flex gap-2">
            <Field
              name="propertySize"
              type="text"
              placeholder="e.g., 2,500"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-500">
              sq ft
            </span>
          </div>
          <ErrorMessage name="propertySize" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Patio</label>
          <Field
            name="patio"
            type="text"
            placeholder="Patio"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <ErrorMessage name="patio" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        {/* Intended Use */}
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

        {/* Exclusive Use */}
        <div>
          <label className="block text-sm font-medium mb-2">Exclusive Use *</label>
          <Field
            name="exclusiveUse"
            type="text"
            placeholder="e.g., Corporate headquarters, Retail store"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <ErrorMessage name="exclusiveUse" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Property Type *</label>
          <Field
            as="select"
            name="propertyType"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Property Type</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Field>
          <ErrorMessage name="propertyType" component="div" className="text-red-500 text-sm mt-1" />
        </div>


        {/* Extra Space */}
        <label className="flex items-center gap-2">
          <Field
            type="checkbox"
            name="hasExtraSpace"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Is there any outer space?</span>
        </label>
      </div>

      {/* Amenities and Services */}
      <div className="space-y-6 border border-gray-300 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Car className="w-5 h-5 text-orange-500" />
          <span>Amenities and Services</span>
        </h4>

        <div>
          <label className="block text-sm font-medium mb-2">Parking Spaces Required *</label>
          <Field
            as="select"
            name="parkingSpaces"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">e.g., 8–10</option>
            {PARKING_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Field>
          <ErrorMessage name="parkingSpaces" component="div" className="text-red-500 text-sm mt-1" />
        </div>
      </div>
    </div>

    {/* Lease Type Guide */}
    <div className="bg-[#F0FDF4] border border-[#C6F6D5] rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-[#34A853] mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-[#34A853]">Lease Type Guide</h4>
          <p className="text-sm font-bold text-[#34A853] mt-1">
            There are four main types of lease: Triple Net (NNN), Gross Lease, Modified Gross and Percentage Lease.
          </p>
        </div>
      </div>
    </div>

    {/* Utilities & Services Included */}
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-yellow-500" />
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
          { name: 'utilities.other', label: 'Other' },
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
  </div>
);
