// components/steps/AdditionalTermsStep.tsx
"use client";

import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { RefreshCw, Wrench, FileText, AlertTriangle } from "lucide-react";
import { FormValues } from "@/constants/formData";

export const AdditionalTermsStep: React.FC = () => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<FormValues>();

  const toggleWithClear = (flagKey: string, detailKey: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFieldValue(flagKey, checked);
    if (!checked) {
      setFieldValue(detailKey, "");
      setFieldTouched(detailKey, false, false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="mb-4 text-lg font-semibold">Additional Terms</h3>
      <p>Define optional terms, conditions, and special requirements for your lease.</p>

      {/* Miscellaneous Items & Tenant Improvements */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* ---------------- Miscellaneous Items ---------------- */}
        <div className="space-y-6 rounded-lg border border-gray-300 p-6">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-500" />
            <h4 className="text-lg font-semibold">Miscellaneous Items</h4>
          </div>

          <div className="space-y-4">
            {/* Include renewal option in LOI */}
       

            {/* Right of First Refusal */}
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <Field
                  name="rightOfFirstRefusal"
                  type="checkbox"
                  onChange={toggleWithClear("rightOfFirstRefusal", "rightOfFirstRefusalDetails")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Right of First Refusal</span>
              </label>
              <ErrorMessage
                name="rightOfFirstRefusal"
                component="div"
                className="mt-1 text-sm text-red-500"
              />


            </div>

            {/* Lease to Purchase */}
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <Field
                  name="leaseToPurchase"
                  type="checkbox"
                  onChange={toggleWithClear("leaseToPurchase", "leaseToPurchaseDetails")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Lease to Purchase</span>
              </label>

              <ErrorMessage
                name="leaseToPurchase"
                component="div"
                className="mt-1 text-sm text-red-500"
              />
            </div>
          </div>
        </div>

        {/* ---------------- Tenant Improvements ---------------- */}
        <div className="space-y-6 rounded-lg border border-gray-300 p-6">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-green-500" />
            <h4 className="text-lg font-semibold">Tenant Improvements</h4>
          </div>

          {/* Improvement Allowance toggle + $/sf field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <Field
                type="checkbox"
                name="improvementAllowanceEnabled"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const checked = e.target.checked;
                  setFieldValue("improvementAllowanceEnabled", checked);
                  if (!checked) {
                    setFieldValue("improvementAllowanceAmount", "");
                    setFieldTouched("improvementAllowanceAmount", false, false);
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Improvement Allowance</span>
            </label>

            {values?.improvementAllowanceEnabled && (
              <>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Field
                    name="improvementAllowanceAmount"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    placeholder="Amount"
                    className="w-full rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3 pl-8 pr-36
                               "
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    per square footage
                  </span>
                </div>
                <p className="text-xs text-gray-500">Amount landlord will contribute to tenant improvements</p>
                <ErrorMessage
                  name="improvementAllowanceAmount"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Special Conditions */}
      <div className="rounded-lg border border-gray-300 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-500" />
          <h4 className="text-lg font-semibold">Special Conditions</h4>
        </div>
        <Field
          as="textarea"
          name="specialConditions"
          placeholder="Any special terms, conditions, or requirements specific to this lease..."
          rows={4}
          className="w-full rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3
                     focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
        />
      </div>

      {/* Contingencies */}
      <div className="rounded-lg border border-gray-300 p-6">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <h4 className="text-lg font-semibold">Contingencies</h4>
        </div>
        <p className="mb-4 text-sm text-gray-600">Select any conditions that must be met before the lease can be finalized:</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { label: "Financing Approval", name: "financingApproval" },
            { label: "Environmental Assessment", name: "environmentalAssessment" },
            { label: "Zoning Compliance", name: "zoningCompliance" },
            { label: "Permits & Licenses", name: "permitsLicenses" },
            { label: "Property Inspection", name: "propertyInspection" },
            { label: "Insurance Approval", name: "insuranceApproval" },
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

      {/* Note */}
      <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500" />
          <div>
            <h4 className="font-medium text-orange-900">Important Note</h4>
            <p className="mt-1 text-sm text-orange-700">
              These terms are negotiable and may impact the final lease. Consider consulting a commercial real estate
              attorney for complex issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
