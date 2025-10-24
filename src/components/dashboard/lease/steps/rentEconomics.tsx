// components/dashboard/lease/steps/rentEconomics.tsx
import React from "react";
import { Field, ErrorMessage, FieldArray, useFormikContext } from "formik";
import { DollarSign, Info } from "lucide-react";
import { LeaseFormValues } from "@/types/lease";

export const LeaseRentEconomicsStep: React.FC = () => {
  const { values } = useFormikContext<LeaseFormValues>();

  const showFixed = values.annual_escalation_type === "Fixed";
  const showCPI   = values.annual_escalation_type === "CPI";

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Rent &amp; Economics</h3>
      <p className="text-gray-600">Base rent, deposits, free rent, and escalation.</p>

      {/* Base Rent & Economics */}
      <div className="border border-gray-300 rounded-lg p-6 space-y-6">
        <h4 className="font-semibold flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-500" />
          Base Rent &amp; Economics
        </h4>

        {/* Row: base rent, security, prepaid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Base Rent *</label>
            <Field
              name="monthly_rent"
              type="number"
              placeholder="5000"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name="monthly_rent" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Security Deposit ($)</label>
            <Field
              name="security_deposit"
              type="number"
              placeholder="10000"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Prepaid Rent ($)</label>
            <Field
              name="prepaid_rent"
              type="number"
              placeholder="5000"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Free rent */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Free Rent (months)</label>
            <Field
              name="free_rent_months"
              type="number"
              placeholder="e.g., 1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-2">Free Rent Months (list)</label>
            <Field
              name="free_rent_month_list"
              placeholder="e.g., 1, 13"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated month numbers; omit if none.</p>
          </div>
        </div>

        {/* Base Rent Schedule (repeater) */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">Base Rent Schedule</label>
          <p className="text-xs text-gray-500">
            Periods + monthly $ or $/SF/yr. Example: <em>Years 1–5</em> → $15,000; <em>Years 6–10</em> → $16,500.
          </p>

          <FieldArray name="base_rent_schedule_rows">
            {({ push, remove }) => (
              <div className="space-y-3">
                {(values.base_rent_schedule_rows || []).map((row, idx) => (
                  <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
                    <div className="lg:col-span-4">
                      <Field
                        name={`base_rent_schedule_rows.${idx}.period`}
                        placeholder="Period (e.g., Years 1–5)"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="lg:col-span-4">
                      <Field
                        name={`base_rent_schedule_rows.${idx}.monthly_rent`}
                        type="number"
                        placeholder="Monthly $ (optional)"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="lg:col-span-3">
                      <Field
                        name={`base_rent_schedule_rows.${idx}.rate_per_sf_year`}
                        type="number"
                        step="0.01"
                        placeholder="$ / SF / Yr (optional)"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="lg:col-span-1">
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="w-full h-[44px] rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => push({ period: "", monthly_rent: "", rate_per_sf_year: "" })}
                  className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
                >
                  + Add Period
                </button>
              </div>
            )}
          </FieldArray>
        </div>

        {/* Escalation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Annual Escalation</label>
            <Field
              as="select"
              name="annual_escalation_type"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select type</option>
              <option value="Fixed">Fixed %</option>
              <option value="CPI">CPI (with floor/ceiling)</option>
              <option value="None">None</option>
            </Field>
          </div>

          {showFixed && (
            <div>
              <label className="block text-sm font-medium mb-2">Annual Escalation Percent (%)</label>
              <Field
                name="annual_escalation_percent"
                type="number"
                step="0.1"
                placeholder="3.0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {showCPI && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">CPI Floor (%)</label>
                <Field
                  name="cpi_floor"
                  type="number"
                  step="0.1"
                  placeholder="2.0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CPI Ceiling (%)</label>
                <Field
                  name="cpi_ceiling"
                  type="number"
                  step="0.1"
                  placeholder="5.0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Other economics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Percentage Lease (%)</label>
            <Field
              name="percentage_lease_percent"
              type="number"
              step="0.1"
              placeholder="6.0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-2">Base Rent Schedule Period (months)</label>
            <Field
              name="base_rent_schedule"
              type="number"
              placeholder="12"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Optional helper if you bill on fixed periods.</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900">Rent Escalation</h4>
            <p className="text-sm text-blue-700 mt-1">
              Choose exactly one: <strong>Fixed %</strong> or <strong>CPI</strong> (with floor/ceiling), or <strong>None</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
