
// components/steps/AdditionalTermsStep.tsx
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { RefreshCw, Wrench, FileText, AlertTriangle } from 'lucide-react';

export const AdditionalTermsStep: React.FC = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold mb-4">Additional Terms</h3>
    <p>Define optional terms, conditions, and special requirements for your lease.</p>

    {/* Renewal Option & Tenant Improvements */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Renewal Option */}
      <div className="space-y-6 border border-gray-300 rounded-lg p-6">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-blue-500" />
          <h4 className="text-lg font-semibold">Renewal Option</h4>
        </div>
        <div className="flex items-center gap-2">
          <Field
            name="renewalOption"
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label className="text-sm">Include renewal option in LOI</label>
        </div>
      </div>

      {/* Tenant Improvements */}
      <div className="space-y-6 border border-gray-300 rounded-lg p-6">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-green-500" />
          <h4 className="text-lg font-semibold">Tenant Improvements</h4>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Improvement Allowance *</label>
          <Field
            name="improvementAllowance"
            as="textarea"
            rows={4}
            placeholder="Describe any tenant improvement plans or allowances..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <ErrorMessage name="improvementAllowance" component="div" className="text-red-500 text-sm mt-1" />
        </div>
      </div>
    </div>

    {/* Special Conditions */}
    <div className="border border-gray-300 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-purple-500" />
        <h4 className="text-lg font-semibold">Special Conditions</h4>
      </div>
      <Field
        as="textarea"
        name="specialConditions"
        placeholder="Any special terms, conditions, or requirements specific to this lease..."
        rows={4}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    {/* Contingencies */}
    <div className="border border-gray-300 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
        <h4 className="text-lg font-semibold">Contingencies</h4>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Select any conditions that must be met before the lease can be finalized:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Financing Approval', name: 'financingApproval' },
          { label: 'Environmental Assessment', name: 'environmentalAssessment' },
          { label: 'Zoning Compliance', name: 'zoningCompliance' },
          { label: 'Permits & Licenses', name: 'permitsLicenses' },
          { label: 'Property Inspection', name: 'propertyInspection' },
          { label: 'Insurance Approval', name: 'insuranceApproval' },
        ].map(({ label, name }) => (
          <label key={name} className="flex items-center gap-2">
            <Field
              name={name}
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">{label}</span>
          </label>
        ))}
      </div>
    </div>

    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-orange-900">Important Note</h4>
          <p className="text-sm text-orange-700 mt-1">
            These terms are negotiable and may impact the final lease. Consider consulting a commercial real estate attorney for complex issues.
          </p>
        </div>
      </div>
    </div>
  </div>
);
