
// components/steps/LeaseTermsStep.tsx
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { Info } from 'lucide-react';

export const LeaseTermsStep: React.FC = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold mb-4">Lease Terms</h3>
    <p>Define the financial and temporal aspects of your proposed lease.</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Financial Terms */}
      <div className="space-y-6 border border-gray-300 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">Financial Terms</h4>

        <div>
          <label className="block text-sm font-medium mb-2">Monthly Rent *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Field
              name="rentAmount"
              type="text"
              placeholder="5000"
              className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <ErrorMessage name="rentAmount" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Security Deposit *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Field
              name="securityDeposit"
              type="text"
              placeholder="10000"
              className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <ErrorMessage name="securityDeposit" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Property Type *</label>
          <Field
            as="select"
            name="propertyType"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select property type</option>
            <option value="Commercial">Commercial</option>
            <option value="retail">Retail</option>
            <option value="warehouse">Warehouse</option>
            <option value="residential">Residential</option>
            <option value="mixed-use">Mixed Use</option>
          </Field>
          <ErrorMessage name="propertyType" component="div" className="text-red-500 text-sm mt-1" />
        </div>
      </div>

      {/* Timing Terms */}
      <div className="space-y-6 border border-gray-300 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">Timing Terms</h4>

        <div>
          <label className="block text-sm font-medium mb-2">Lease Duration *</label>
          <Field
            as="select"
            name="leaseDuration"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Duration</option>
            <option value="12 months">12 months</option>
            <option value="24 months">24 months</option>
            <option value="36 months">36 months</option>
            <option value="48 months">48 months</option>
            <option value="60 months">60 months</option>
          </Field>
          <ErrorMessage name="leaseDuration" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Preferred Start Date *</label>
          <Field
            name="startDate"
            type="date"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <ErrorMessage name="startDate" component="div" className="text-red-500 text-sm mt-1" />
        </div>
      </div>
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-blue-900">Lease Type Guide</h4>
          <p className="text-sm font-semibold text-blue-700 mt-1">
            There are four main types of lease guide. Triple Net (NNN), Gross Lease, Modified Gross and Percentage Lease.
          </p>
        </div>
      </div>
    </div>
  </div>
);
