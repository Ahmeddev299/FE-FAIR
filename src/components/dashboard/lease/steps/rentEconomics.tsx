// components/dashboard/lease/steps/rentEconomics.tsx
import React from "react";
import { Field, ErrorMessage, FieldArray, useFormikContext } from "formik";
import { DollarSign, Info } from "lucide-react";
import { LeaseFormValues } from "@/types/lease";

type ScheduleBasis = "Monthly" | "$/SF/yr";

export const LeaseRentEconomicsStep: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<LeaseFormValues>();

  const scheduleBasis: ScheduleBasis = (values.schedule_basis as ScheduleBasis) || "Monthly";
  const isPercentage = values.rent_type === "Percentage";

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Rent &amp; Economics</h3>
      <p className="text-gray-600">Base rent and schedule. (Free rent handled by your rent commencement offset.)</p>

      <div className="border border-gray-300 rounded-lg p-6 space-y-6">
        <h4 className="font-semibold flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-500" />
          Base Rent
        </h4>

        {/* Rent Type */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Rent Type *</label>
            <Field
              as="select"
              name="rent_type"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="Fixed">Fixed</option>
              <option value="Percentage">Percentage</option>
            </Field>
            <ErrorMessage name="rent_type" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Base Rent (if Fixed) */}
          {values.rent_type !== "Percentage" && (
            <div>
              <label className="block text-sm font-medium mb-2">Base Rent (Monthly $) *</label>
              <Field
                name="monthly_rent"
                type="number"
                placeholder="10000"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="monthly_rent" component="div" className="text-red-500 text-sm mt-1" />
            </div>
          )}

          {/* Percentage Lease (if Percentage) */}
          {isPercentage && (
            <div>
              <label className="block text-sm font-medium mb-2">Percentage Rent (%) *</label>
              <Field
                name="percentage_lease_percent"
                type="number"
                step="0.1"
                placeholder="6.0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="percentage_lease_percent" component="div" className="text-red-500 text-sm mt-1" />
            </div>
          )}
        </div>

        {/* Deposits (kept) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Security Deposit ($)</label>
            <Field
              name="security_deposit"
              type="number"
              placeholder="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Prepaid Rent ($)</label>
            <Field
              name="prepaid_rent"
              type="number"
              placeholder="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Free rent REMOVED (comes from rent_commencement_offset_days) */}
        </div>

        {/* Schedule Basis (before table) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Schedule Basis</label>
            <Field
              as="select"
              name="schedule_basis"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const v = e.target.value as ScheduleBasis;
                setFieldValue("schedule_basis", v);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Monthly">Monthly</option>
              <option value="$/SF/yr">$/SF/yr</option>
            </Field>
          </div>
        </div>

        {/* Base Rent Schedule */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">Base Rent Schedule</label>
          <p className="text-xs text-gray-500">
            Add periods like <em>Years 1–5</em>, <em>Years 6–10</em>. Enter either a monthly $ or a $/SF/yr based on the selected basis.
          </p>

          <FieldArray name="base_rent_schedule_rows">
            {({ push, remove }) => (
              <div className="space-y-3">
                {(values.base_rent_schedule_rows || []).map((row, idx) => (
                  <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
                    <div className="lg:col-span-5">
                      <Field
                        name={`base_rent_schedule_rows.${idx}.period`}
                        placeholder="Period (e.g., Years 1–5)"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {scheduleBasis === "Monthly" ? (
                      <div className="lg:col-span-6">
                        <Field
                          name={`base_rent_schedule_rows.${idx}.monthly_rent`}
                          type="number"
                          placeholder="Monthly $"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="lg:col-span-6">
                        <Field
                          name={`base_rent_schedule_rows.${idx}.rate_per_sf_year`}
                          type="number"
                          step="0.01"
                          placeholder="$ / SF / Yr"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

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
                  onClick={() =>
                    push({ period: "", monthly_rent: "", rate_per_sf_year: "" })
                  }
                  className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
                >
                  + Add Period
                </button>
              </div>
            )}
          </FieldArray>
        </div>

        {/* Escalation UI REMOVED – schedule implies it */}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900">Tip</h4>
            <p className="text-sm text-blue-700 mt-1">
              Use periods (e.g., Years 1–5) and either monthly amounts <em>or</em> $/SF/yr. The AI will infer escalation from your table.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
