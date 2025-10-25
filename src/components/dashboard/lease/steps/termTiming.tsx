// components/dashboard/lease/steps/termTiming.tsx
import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Calendar } from "lucide-react";
import { LeaseFormValues } from "@/types/lease";

type Trigger =
  | ""
  | "Upon delivery"
  | "Upon TCO"
  | "Date certain"
  | "Opening date";

export const LeaseTermTimingStep: React.FC = () => {
  const { values, setFieldValue, setFieldTouched } =
    useFormikContext<LeaseFormValues>();

  const onChangeTrigger = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as Trigger;
    setFieldValue("commencement_trigger", v);

    // Clear dependent fields when switching away
    if (v !== "Date certain") {
      setFieldValue("commencement_date_certain", "");
      setFieldTouched("commencement_date_certain", false, false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Term, Timing & Triggers</h3>
      <p className="text-gray-600">
        Define lease duration, delivery condition, and commencement details.
      </p>

      <div className="border border-gray-300 rounded-lg p-6 space-y-6">
        <h4 className="font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Lease Term & Timing
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Initial Term */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Initial Term (Years) *
            </label>
            <Field
              name="initial_term_years"
              type="number"
              placeholder="5"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage
              name="initial_term_years"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Delivery Condition */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Delivery Condition
            </label>
            <Field
              as="select"
              name="delivery_condition"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select condition</option>
              <option value="As-is">As-is</option>
              <option value="Broom-clean shell">Broom-clean shell</option>
              <option value="Vanilla shell">Vanilla shell</option>
              <option value="LL Turnkey">LL Turnkey</option>
              <option value="T Turnkey">T Turnkey</option>
            </Field>
          </div>

          {/* Commencement Trigger */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Commencement Trigger
            </label>
            <Field
              as="select"
              name="commencement_trigger"
              onChange={onChangeTrigger}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select trigger</option>
              <option value="Upon delivery">Upon delivery</option>
              <option value="Upon TCO">Upon TCO</option>
              <option value="Date certain">Date certain</option>
              <option value="Opening date">Opening date</option>
            </Field>
          </div>

          {/* If Date Certain → date picker */}
          {values.commencement_trigger === "Date certain" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Commencement Date (Certain)
              </label>
              <Field
                type="date"
                name="commencement_date_certain"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Rent Commencement Offset */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Rent Commencement Offset (Days)
            </label>
            <Field
              name="rent_commencement_offset_days"
              type="number"
              placeholder="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use 0 if same as commencement.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2"> Outside Opening Deadline (Days)</label>
              <Field
                as="select"
                name="opening_type"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="Retail">Retail</option>
                <option value="Industrial">Industrial</option>
              </Field>
              <p className="text-xs text-gray-500 mt-1">Choose which milestone applies.</p>
            </div>

            {/* Retail-only: Outside Opening Deadline */}
            {values.opening_type === "Retail" && (
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Outside Opening Deadline (Days)
                </label>
                <Field
                  name="outside_opening_deadline_days"
                  type="number"
                  placeholder="e.g., 180"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Retail only; leave blank if not applicable.
                </p>
              </div>
            )}

            {/* Industrial-only: Operational Deadline */}
            {values.opening_type === "Industrial" && (
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Industrial Operational Deadline (Days)
                </label>
                <Field
                  name="industrial_operational_deadline_days"
                  type="number"
                  placeholder="e.g., 90"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Industrial only; days to achieve operational status.
                </p>
              </div>
            )}
          </div>

          {/* Holdover Rent Multiplier */}
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium mb-2">
              Holdover Rent Multiplier
            </label>
            <Field
              name="holdover_rent_multiplier"
              placeholder="e.g., 150%"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              If omitted, your default will apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
