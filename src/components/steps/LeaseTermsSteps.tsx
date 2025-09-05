
// components/steps/LeaseTermsStep.tsx
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { Info } from 'lucide-react';
import { DollarSign, CalendarDays } from "lucide-react";

export const LeaseTermsStep: React.FC = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold mb-4">Lease Terms</h3>
    <p>Define the financial and temporal aspects of your proposed lease.</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Financial Terms */}
      <div className="space-y-6 border border-gray-300 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-500" />
          Financial Terms
        </h4>
        <div>
          <label className="block text-sm font-medium mb-2">Monthly Rent *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Field
              name="rentAmount"
              type="text"
              placeholder="5,000"
              className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <ErrorMessage name="rentAmount" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Prepaid Rent </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Field
              name="prepaidRent"
              type="text"
              placeholder="5,000"
              className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Security Deposit </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Field
              name="securityDeposit"
              type="text"
              placeholder="10,000"
              className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Lease Type *</label>
          <Field
            as="select"
            name="LeaseType"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select property type</option>
            <option value="Gross Lease">Gross Lease</option>
            <option value="Modified NNN">Modified NNN</option>
            <option value="Modified Gross">Modified Gross</option>
            <option value="Percentage Lease">Percentage Lease</option>
          </Field>
          <ErrorMessage name="LeaseType" component="div" className="text-red-500 text-sm mt-1" />

        </div>
      </div>

      {/* Timing Terms */}
      <div className="space-y-6 border border-gray-300 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-blue-500" />
          Timing Terms
        </h4>
        <div>
          <label className="block text-sm font-medium mb-2">Lease Duration </label>
          <Field
            as="select"
            name="leaseDuration"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Duration</option>
            <option value="12 months">12 months (1 year)</option>
            <option value="24 months">24 months (2 years)</option>
            <option value="36 months">36 months (3 years)</option>
            <option value="48 months">48 months (4 years)</option>
            <option value="60 months">60 months (5 years)</option>
          </Field>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Rent Escalation </label>
          <Field
            as="select"
            name="rentEsclation"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Duration</option>
            <option value="12 months">12 months (1 year)</option>
            <option value="24 months">24 months (2 years)</option>
            <option value="36 months">36 months (3 years)</option>
            <option value="48 months">48 months (4 years)</option>
            <option value="60 months">60 months (5 years)</option>
          </Field>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Preferred Start Date </label>
          <Field
            name="startDate"
            type="date"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-blue-900">Gross Lease</h4>
          <p className="text-sm font-semibold text-blue-700 mt-1">
            There are four main types of lease guide. Triple Net (NNN), Gross Lease, Modified Gross and Percentage Lease.
          </p>
        </div>
      </div>
    </div>
  </div>
);
