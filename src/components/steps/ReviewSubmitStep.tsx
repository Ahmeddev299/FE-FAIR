// components/steps/ReviewSubmitStep.tsx
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { Check } from 'lucide-react';
import { FormValues } from '../../types/loi';

interface ReviewSubmitStepProps {
  values: FormValues;
}

export const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ values }) => (
    console.log("values", values),
  <div className="space-y-6">
    <h3 className="text-lg font-semibold mb-4">Review & Submit</h3>
    <p>Review all the information below and submit your Letter of Intent.</p>

    {/* Ready to Submit Card */}
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <Check className="w-5 h-5 text-green-500 mt-0.5" />
        <div>
          <h4 className="font-medium text-green-900">Ready to Submit</h4>
          <p className="text-sm text-green-700 mt-1">
            Your LOI is complete and ready to be submitted. You can download a PDF copy or send it directly to the landlord.
          </p>
          <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
            Download ↓
          </button>
        </div>
      </div>
    </div>

    {/* Review Sections */}
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Basic Information</h4>
          <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><strong>LOI Title:</strong> {values?.title || 'Not Specified'}</div>
          <div><strong>Property Address:</strong> {values?.propertyAddress || 'Not Specified'}</div>
          <div><strong>Landlord:</strong> {values?.landlordName || 'Not Specified'}</div>
          <div><strong>Tenant:</strong> {values?.tenantName || 'Not Specified'}</div>
        </div>
      </div>

      {/* Lease Terms */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Lease Terms</h4>
          <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><strong>Monthly Rent:</strong> ${values?.rentAmount || 'Not Specified'}</div>
          <div><strong>Security Deposit:</strong> ${values?.securityDeposit || 'Not Specified'}</div>
          <div><strong>Property Type:</strong> {values?.propertyType || 'Not Specified'}</div>
          <div><strong>Lease Duration:</strong> {values?.leaseDuration ? `${values?.leaseDuration} months` : 'Not Specified'}</div>
          <div><strong>Start Date:</strong> {values?.startDate || 'Not Specified'}</div>
        </div>
      </div>

      {/* Property Details */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Property Details</h4>
          <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><strong>Property Size:</strong> {values?.propertySize ? `${values?.propertySize} sq ft` : 'Not Specified'}</div>
          <div><strong>Intended Use:</strong> {values?.intendedUse || 'Not Specified'}</div>
          <div><strong>Parking Spaces:</strong> {values?.parkingSpaces || 'Not Specified'}</div>
        </div>
      </div>
    </div>

    {/* Next Steps */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
      <ol className="text-sm text-blue-800 space-y-1">
        <li>1. LOI will be sent to the landlord for review</li>
        <li>2. You will receive notifications about the status</li>
        <li>3. Negotiate terms and proceed to lease agreement</li>
      </ol>
    </div>

    {/* Terms Agreement */}
    <div className="flex items-center gap-2">
      <Field
        name="terms"
        type="checkbox"
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label className="text-sm">
        I agree to the terms and conditions and confirm that the information provided is accurate.
      </label>
    </div>
    <ErrorMessage name="terms" component="div" className="text-red-500 text-sm" />
  </div>
);
