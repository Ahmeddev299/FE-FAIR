// components/dashboard/lease/steps/termTiming.tsx
import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Calendar } from "lucide-react";
import { LeaseFormValues } from "@/types/lease";

type Trigger = "" | "Upon delivery" | "Date certain" | "Opening date";

export const LeaseTermTimingStep: React.FC = () => {
  const { values, setFieldValue, setFieldTouched } =
    useFormikContext<LeaseFormValues>();

  const onChangeTrigger = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as Trigger;
    setFieldValue("commencement_trigger", v);

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
        <h4 className="font-semibold flex items-centaer gap-2">
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
              <option value="Broom-clean shell">Broom-clean shell</option>
              <option value="Vanilla shell">Vanilla shell</option>
              <option value="As-is">As-is</option>
              <option value="LL Turnkey">LL Turnkey</option>
              <option value="T Turnkey">T Turnkey</option>
            </Field>
          </div>

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
              <option value="Date certain">Date certain</option>
              <option value="Opening date">Opening date</option>
            </Field>
          </div>

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
              <ErrorMessage
                name="commencement_date_certain"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Rent Commencement Offset (Days)
            </label>
            <Field
              name="rent_commencement_offset_days"
              type="number"
              placeholder="30"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter 0 if rent starts on the commencement date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
