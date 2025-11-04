// components/dashboard/lease/steps/rentEconomics.tsx
import React from "react";
import { Field, ErrorMessage, FieldArray, useFormikContext } from "formik";
import { DollarSign, Info } from "lucide-react";
import { LeaseFormValues } from "@/types/lease";

type ScheduleBasis = "Monthly" | "$/SF/yr";

export const LeaseRentEconomicsStep: React.FC = () => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<LeaseFormValues>();

  const scheduleBasis: ScheduleBasis = (values.schedule_basis as ScheduleBasis) || "Monthly";
  const isPercentage = values.rent_type === "Percent";
  const isModGross = values.lease_structure === "Modified Gross";
  const isNNN = values.lease_structure === "Triple Net";
  const isGross = values.lease_structure === "Gross";
  const showPassThroughBlock = isModGross || isNNN;

  const clearIfGross = () => {
    if (values.lease_structure === "Gross") {
      [
        "cam_include_exclude",
        "management_fee_cap_percent",
        "capital_amortization_rules",
        "est_cam_per_sf",
        "est_taxes_per_sf",
        "est_insurance_per_sf",
        "nnn_est_annual",
      ].forEach((k) => setFieldValue(k, ""));
      // keep gross_estimate_amount as-is
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Rent &amp; Economics</h3>
      <p className="text-gray-600">Base rent, schedule, and operating expenses structure.</p>

      {/* Base Rent */}
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
              <option value="Percent">Percentage</option>
            </Field>
            <ErrorMessage name="rent_type" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Base Rent (if Fixed) */}
          {values.rent_type !== "Percent" && (
            <div>
              <label className="block text-sm font-medium mb-2">Monthly Rent ($) *</label>
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

        {/* Deposits */}
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
        </div>

        {/* Schedule Basis */}
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
                  onClick={() => push({ period: "", monthly_rent: "", rate_per_sf_year: "" })}
                  className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
                >
                  + Add Period
                </button>
              </div>
            )}
          </FieldArray>
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-6 space-y-6">
        <h4 className="font-semibold flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-500" />
          Operating Expenses / NNN Structure
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Lease Structure *</label>
            <Field
              as="select"
              name="lease_structure"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setFieldValue("lease_structure", e.target.value);
                setFieldTouched("lease_structure", true, false);
                clearIfGross();
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select structure</option>
              <option value="Gross">Gross</option>
              <option value="Modified Gross">Modified Gross</option>
              <option value="Triple Net">Triple Net</option>
              <option value="Modified Triple Net">Modified Triple Net</option>
            </Field>
            <ErrorMessage name="lease_structure" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        </div>

        {isGross && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Gross Estimated Amount ($)</label>
              <Field
                name="gross_estimate_amount"
                type="number"
                step="0.01"
                placeholder="e.g., 12000"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Optional all-in monthly estimate for Gross leases.</p>
            </div>
          </div>
        )}

        {showPassThroughBlock && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">CAM Include / Exclude</label>
              <Field
                name="cam_include_exclude"
                as="textarea"
                rows={2}
                placeholder="e.g., exclude capital except code-required; management fee capped at 3%"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Mgmt Fee Cap (%)</label>
                <Field
                  name="management_fee_cap_percent"
                  type="number"
                  step="0.1"
                  placeholder="3.0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium mb-2">Capital Amortization Rules</label>
                <Field
                  as="textarea"
                  name="capital_amortization_rules"
                  rows={2}
                  placeholder="e.g., amortize code-required over useful life @6%"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Disclosure Estimates */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Est. CAM per SF ($)</label>
                <Field
                  name="est_cam_per_sf"
                  type="number"
                  step="0.01"
                  placeholder="3.50"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Est. Taxes per SF ($)</label>
                <Field
                  name="est_taxes_per_sf"
                  type="number"
                  step="0.01"
                  placeholder="2.25"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Est. Insurance per SF ($)</label>
                <Field
                  name="est_insurance_per_sf"
                  type="number"
                  step="0.01"
                  placeholder="0.75"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {isNNN && (
                <div>
                  <label className="block text-sm font-medium mb-2">Estimated NNN (Annual $)</label>
                  <Field
                    name="nnn_est_annual"
                    type="number"
                    placeholder="e.g., 18,000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </>
        )}

        <div className="flex items-center gap-2">
          <Field
            id="operating_expenses_applicable"
            name="audit_right"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="operating_expenses_applicable" className="text-sm">
            Audit Right          </label>
        </div>
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
