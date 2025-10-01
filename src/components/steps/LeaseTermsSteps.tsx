// components/steps/LeaseTermsStep.tsx
"use client";

import React, { useEffect } from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Info, DollarSign, CalendarDays } from "lucide-react";
import { FormValues } from "@/types/loi";

export const LeaseTermsStep: React.FC = () => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<FormValues & {
    rentEscalationType?: "percent" | "fmv";
  }>();

  // If user flips to FMV, clear the percent so validation doesn't nag later
  useEffect(() => {
    if (values.rentEscalationType === "fmv" && values.rentEscalationPercent) {
      setFieldValue("rentEscalationPercent", "");
      setFieldTouched("rentEscalationPercent", false, false);
    }
  }, [values.rentEscalationType, values.rentEscalationPercent, setFieldValue, setFieldTouched]);

  return (
    <div className="space-y-6">
      <h3 className="mb-4 text-lg font-semibold">Lease Terms</h3>
      <p>Define the financial and temporal aspects of your proposed lease.</p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* ---------------- Financial Terms ---------------- */}
        <div className="space-y-6 rounded-lg border border-gray-300 p-6">
          <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <DollarSign className="h-5 w-5 text-blue-500" />
            Financial Terms
          </h4>

          {/* Monthly Rent */}
          <div>
            <label className="mb-2 block text-sm font-medium">Monthly Rent *</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Field
                name="rentAmount"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="5000"
                className="w-full rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3 pl-8
                           focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              />
            </div>
            <ErrorMessage name="rentAmount" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          {/* Prepaid Rent */}
          <div>
            <label className="mb-2 block text-sm font-medium">Prepaid Rent</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Field
                name="prepaidRent"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="5000"
                className="w-full rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3 pl-8"
              />
            </div>
          </div>

          {/* Security Deposit */}
          <div>
            <label className="mb-2 block text-sm font-medium">Security Deposit *</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Field
                name="securityDeposit"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="10000"
                className="w-full rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3 pl-8"
              />
            </div>
            <ErrorMessage name="securityDeposit" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          {/* Lease Type (string only) */}
          <div>
            <label className="mb-2 block text-sm font-medium">Lease Type *</label>
            <Field
              as="select"
              name="leaseType"
              className="w-full rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3
                         focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
            >
              <option value="">Select lease type</option>
              <option value="Gross Lease">Gross Lease</option>
              <option value="NNN">NNN</option>
              <option value="Modified NNN">Modified NNN</option>
              <option value="Modified Gross">Modified Gross</option>
              <option value="Percentage Lease">Percentage Lease</option>
            </Field>
            <ErrorMessage name="leaseType" component="div" className="mt-1 text-sm text-red-500" />
          </div>
           {values.leaseType === "Percentage Lease" && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              Percentage of Gross Sales Revenue *
            </label>
            <div className="relative">
              <Field
                name="percentageLeasePercent"
                type="number"
                inputMode="decimal"
                min="0"
                max="100"
                step="0.1"
                placeholder="e.g., 6"
                className="w-full rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3 pr-10
                         focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                %
              </span>
            </div>
            <ErrorMessage
              name="percentageLeasePercent"
              component="div"
              className="mt-1 text-sm text-red-500"
            />
          </div>
        )}
        </div>
        {/* NEW: Percentage of Gross Sales (only for Percentage Lease) */}
    


        {/* ---------------- Timing Terms ---------------- */}
        <div className="space-y-6 rounded-lg border border-gray-300 p-6">
          <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <CalendarDays className="h-5 w-5 text-blue-500" />
            Timing Terms
          </h4>

          {/* Lease Duration (numeric months) */}
          <div>
            <label className="mb-2 block text-sm font-medium">Lease Duration *</label>
            <div className="relative">
              <Field
                name="leaseDuration"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                placeholder="e.g., 36"
                className="w-full rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3 pr-16"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                months
              </span>
            </div>
            <ErrorMessage name="leaseDuration" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          {/* Rent Escalation cadence (numeric months) */}
          <div>
            <label className="mb-2 block text-sm font-medium">Rent Escalation *</label>
            <div className="relative">
              <Field
                name="RentEscalation" // keep or/iginal key
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                placeholder="e.g., 12"
                className="w-full rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3 pr-16"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                months
              </span>
            </div>
            <ErrorMessage name="RentEscalation" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          {/* Escalation Type: % or FMV */}
          <div>
            <label className="mb-2 block text-sm font-medium">Escalation Type *</label>
            <Field
              as="select"
              name="rentEscalationType"
              className="w-full rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3
                         focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const v = e.target.value as "percent" | "fmv";
                setFieldValue("rentEscalationType", v);
                if (v === "fmv") {
                  setFieldValue("rentEscalationPercent", "");
                  setFieldTouched("rentEscalationPercent", false, false);
                }
              }}
            >
              <option value="percent">Percentage (%)</option>
              <option value="fmv">Fair Market Value (FMV)</option>
            </Field>
            <ErrorMessage name="rentEscalationType" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          {/* Rent Escalation % (only when type = percent) */}
          {values.rentEscalationType !== "fmv" && (
            <div>
              <div className="relative">
                <Field
                  name="rentEscalationPercent"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="%"
                  className="w-full rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3 pr-10"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">% *</span>
              </div>
              <ErrorMessage
                name="rentEscalationPercent"
                component="div"
                className="mt-1 text-sm text-red-500"
              />
            </div>
          )}

          {/* FMV helper (when type = fmv) */}
          {/* {values.rentEscalationType === "fmv" && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Escalations will adjust to <strong>Fair Market Value</strong> at each cadence. You can
              clarify appraisal mechanics in “Additional Terms”.
            </div>
          )} */}

          {/* Include renewal option */}
          <div className="flex items-center gap-3">
            <Field
              type="checkbox"
              name="includeRenewalOption"
              id="includeRenewalOption"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const checked = e.target.checked;
                setFieldValue("includeRenewalOption", checked);
                if (!checked) {
                  setFieldValue("renewalOptionsCount", "");
                  setFieldValue("renewalYears", "");
                  setFieldTouched("renewalOptionsCount", false, false);
                  setFieldTouched("renewalYears", false, false);
                }
              }}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="includeRenewalOption" className="text-sm text-gray-800">
              Include renewal option in LOI
            </label>
          </div>

          {/* Two inputs shown only when checked */}
          {values?.includeRenewalOption && (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3 border p-1 border-gray-300 rounded-lg pl-10">
                <Field
                  name="renewalOptionsCount"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  placeholder="__"
                  className="w-20 rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3 text-center"
                />
                <span className="text-gray-700">Options for</span>
                <Field
                  name="renewalYears"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  placeholder="__"
                  className="w-20 rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3 text-center"
                />
                <span className="text-gray-700">Years</span>
              </div>

              <div className="flex gap-6">
                <ErrorMessage name="renewalOptionsCount" component="div" className="text-sm text-red-500" />
                <ErrorMessage name="renewalYears" component="div" className="text-sm text-red-500" />
              </div>
            </div>
          )}

          {/* Preferred Start Date */}
          <div>
            <label className="mb-2 block text-sm font-medium">Commencement Date *</label>
            <Field
              name="startDate"
              type="date"
              className="w-full rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3
                         focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
            />
            <ErrorMessage name="startDate" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Rent Commencement Start Date</label>
            <Field
              name="rentstartDate"
              type="date"
              className="w-full rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3
                         focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
            />
            <ErrorMessage name="rentstartDate" component="div" className="mt-1 text-sm text-red-500" />
          </div>
        </div>
      </div>

      {/* Helper card */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
          <div>
            <h4 className="font-medium text-blue-900">Gross Lease</h4>
            <p className="mt-1 text-sm font-semibold text-blue-700">
              There are four main types of lease guide. Triple Net (NNN), Gross Lease, Modified Gross
              and Percentage Lease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
