// components/steps/PropertyDetailsStep.tsx
"use client";

import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Info, Building2, Car, Zap } from "lucide-react";
import { FormValues } from "@/constants/formData";

const PROPERTY_TYPES = [
  "Shopping Center",
  "Office",
  "Storage Space",
  "Retail",
  "Restaurant",
  "Medical",
  "Technology",
  "Manufacturing",
  "Warehouse",
  "Warehouse/Industrial",
  "Mixed-use",
  "Education",
  "Service",
  "Other",
];

const PARKING_OPTIONS = ["0–2", "3–5", "6–7", "8–10", "11–15", "16–20", "21+"];

export const PropertyDetailsStep: React.FC = () => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<FormValues>();

  return (
    <div className="space-y-6">
      <h3 className="mb-4 text-lg font-semibold">Property Details</h3>
      <p>Specify the physical characteristics and requirements for the property.</p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* ---------------- Space Specifications ---------------- */}
        <div className="space-y-6 rounded-lg border border-gray-300 p-6">
          <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Building2 className="h-5 w-5 text-purple-500" />
            <span>Space Specifications</span>
          </h4>

          {/* Property Size */}
          <div>
            <label className="mb-2 block text-sm font-medium">Property Size (sq ft) *</label>
            <div className="flex gap-2">
              <Field
                name="propertySize"
                type="number"
                inputMode="numeric"
                min="0"
                placeholder="e.g., 2500"
                className="flex-1 rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3
                           focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span className="rounded-lg border-0 ring-1 ring-inset ring-gray-200 bg-gray-50 p-3 text-gray-500">
                sq ft
              </span>
            </div>
            <ErrorMessage name="propertySize" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          {/* Checkbox: Is there any outer space? */}
          <label className="flex items-center gap-2">
            <Field
              type="checkbox"
              name="hasExtraSpace"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const checked = e.target.checked;
                setFieldValue("hasExtraSpace", checked);
                if (!checked) {
                  // clear patio when hidden
                  setFieldValue("patio", "");
                  setFieldTouched("patio", false, false);
                }
              }}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Is there any outer space?</span>
          </label>

          {/* Patio (visible only when checkbox checked) */}
          {values?.hasExtraSpace && (
            <div>
              <label className="mb-2 block text-sm font-medium">Patio</label>
              <Field
                name="patio"
                type="text"
                placeholder="Patio"
                className="w-full rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3
                           focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              />
              <ErrorMessage name="patio" component="div" className="mt-1 text-sm text-red-500" />
            </div>
          )}

          {/* Intended Use */}
          <div>
            <label className="mb-2 block text-sm font-medium">Intended Use *</label>
            <Field
              name="intendedUse"
              type="text"
              placeholder="e.g., Corporate headquarters, Retail store"
              className="w-full rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3
                         focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
            />
            <ErrorMessage name="intendedUse" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          {/* Exclusive Use */}
          <div>
            <label className="mb-2 block text-sm font-medium">Exclusive Use *</label>
            <Field
              name="exclusiveUse"
              type="text"
              placeholder="e.g., Corporate headquarters, Retail store"
              className="w-full rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3
                         focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
            />
            <ErrorMessage name="exclusiveUse" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          {/* Property Type */}
          <div>
            <label className="mb-2 block text-sm font-medium">Property Type *</label>
            <Field
              as="select"
              name="propertyType"
              className="w-full rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3
                         focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
            >
              <option value="">Select Property Type</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Field>
            <ErrorMessage name="propertyType" component="div" className="mt-1 text-sm text-red-500" />
          </div>
        </div>

        {/* ---------------- Amenities and Services ---------------- */}
        <div className="space-y-6 rounded-lg border border-gray-300 p-6">
          <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Car className="h-5 w-5 text-orange-500" />
            <span>Amenities and Services</span>
          </h4>

          <div>
            <label className="mb-2 block text-sm font-medium">Parking Spaces Required *</label>
            <Field
              as="select"
              name="parkingSpaces"
              className="w-full rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3
                         focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
            >
              <option value="">e.g., 8–10</option>
              {PARKING_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Field>
            <ErrorMessage name="parkingSpaces" component="div" className="mt-1 text-sm text-red-500" />
          </div>
        </div>
      </div>

      {/* Lease Type Guide */}
      <div className="rounded-lg border border-[#C6F6D5] bg-[#F0FDF4] p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#34A853]" />
          <div>
            <h4 className="font-semibold text-[#34A853]">Lease Type Guide</h4>
            <p className="mt-1 text-sm font-bold text-[#34A853]">
              There are four main types of lease: Triple Net (NNN), Gross Lease, Modified Gross and Percentage Lease.
            </p>
          </div>
        </div>
      </div>

      {/* Utilities & Services Included */}
      <div className="rounded-lg border border-gray-200 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <h4 className="text-sm font-semibold">Utilities & Services Included</h4>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm text-gray-800 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "utilities.electricity", label: "Electricity" },
            { name: "utilities.waterSewer", label: "Water/Sewer" },
            { name: "utilities.naturalGas", label: "Natural Gas" },
            { name: "utilities.internetCable", label: "Internet/Cable" },
            { name: "utilities.hvac", label: "HVAC" },
            { name: "utilities.securitySystem", label: "Security System" },
            { name: "utilities.other", label: "Other" },
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
};
