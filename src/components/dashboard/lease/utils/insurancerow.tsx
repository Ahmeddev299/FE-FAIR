// components/dashboard/lease/utils/insurancerow.tsx
import React from "react";
import { Field } from "formik";

type Props = {
  rowKey: string;                   // e.g., "cgl"
  label: string;                    // display label
  help?: string;                    // helper text
  limitOptions: { label: string; value: string }[];
};

export const InsuranceRow: React.FC<Props> = ({ rowKey, label, help, limitOptions }) => {
  const limitPath = `insurance_requirements.${rowKey}.limit`;
  const customPath = `insurance_requirements.${rowKey}.custom_limit`;

  return (
    <div className="grid grid-cols-12 items-start border-b border-gray-200 last:border-b-0">
      {/* Coverage label + help */}
      <div className="col-span-10 p-3">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        {help && <div className="mt-1 text-xs text-gray-500">{help}</div>}
      </div>

      {/* Limit dropdown (+ custom text when selected) */}
      <div className="col-span-2 p-3">
        <Field as="select" name={limitPath} className="w-full p-2 border border-gray-300 rounded">
          {limitOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Field>

        <Field name={limitPath}>
          {({ field }: any) =>
            field.value === "custom" ? (
              <div className="mt-2">
                <Field
                  name={customPath}
                  placeholder="Enter custom limit"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            ) : null
          }
        </Field>
      </div>
    </div>
  );
};
