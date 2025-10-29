import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Building2, Info } from "lucide-react";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

type PremisesValues = {
  // address
  premisses_property_address_S1: string;
  premisses_property_address_S2: string;
  premisses_property_city: string;
  premisses_property_state: string;
  premisses_property_zip: string;

  // space
  rentable_sf: number | string;
  property_size: string; // optional

  // outdoor space
  hasExtraSpace: boolean;
  outdoor_size: number | string; // size only (sq ft)

  // parking
  exclusive_parking_spaces: boolean;
  exclusive_parking_spaces_count: number | string;
};

export const LeasePremisesStep: React.FC = () => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<PremisesValues>();

  const toggle = (
    name: keyof PremisesValues,
    checked: boolean,
    clears: Array<keyof PremisesValues> = []
  ) => {
    setFieldValue(name, checked);
    if (!checked) {
      clears.forEach((c) => {
        setFieldValue(c, "");
        setFieldTouched(c, false, false);
      });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Premises & Property Details</h3>
      <p className="text-gray-600">Detailed information about the leased property.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Address */}
        <div className="space-y-6 border border-gray-300 rounded-lg p-6">
          <h4 className="font-semibold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            Property Address
          </h4>

          <div className="space-y-3">
            <label className="block text-sm font-medium">Property Address *</label>

            {/* Suite/Floor included inline in S1 per feedback */}
            <Field
              name="premisses_property_address_S1"
              type="text"
              placeholder="Street Address Line 1 (include Suite/Floor if any)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <ErrorMessage name="premisses_property_address_S1" component="div" className="text-red-500 text-sm" />

            <Field
              name="premisses_property_address_S2"
              type="text"
              placeholder="Street Address Line 2 (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <ErrorMessage name="premisses_property_address_S2" component="div" className="text-red-500 text-sm" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field
                name="premisses_property_city"
                type="text"
                placeholder="City"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* 50-state dropdown */}
              <Field
                as="select"
                name="premisses_property_state"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">State</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Field>

              <Field
                name="premisses_property_zip"
                type="text"
                placeholder="ZIP (12345 or 12345-6789)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
              <ErrorMessage name="premisses_property_city" component="div" className="text-sm text-red-500" />
              <ErrorMessage name="premisses_property_state" component="div" className="text-sm text-red-500" />
              <ErrorMessage name="premisses_property_zip" component="div" className="text-sm text-red-500" />
            </div>
          </div>
        </div>

        {/* Space Details */}
        <div className="space-y-6 border border-gray-300 rounded-lg p-6">
          <h4 className="font-semibold">Space Details</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rentable SF *</label>
              <Field
                name="rentable_sf"
                type="number"
                placeholder="e.g., 2500"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="rentable_sf" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Load Factor REMOVED per feedback */}
          </div>

          {/* Optional total property size (keep, optional) */}
          <div>
            <label className="block text-sm font-medium mb-2">Total Property Size (optional)</label>
            <Field
              name="property_size"
              placeholder="e.g., 50,000 SF"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Outdoor space toggle -> size only */}
          <div className="grid grid-cols-1 gap-4">
            <label className="flex items-center gap-2">
              <Field
                type="checkbox"
                name="hasExtraSpace"
                checked={!!values.hasExtraSpace}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  toggle("hasExtraSpace", e.target.checked, ["outdoor_size"])
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Is there outdoor space (e.g., patio/terrace)?</span>
            </label>

            {values.hasExtraSpace && (
              <div>
                <label className="mb-2 block text-sm font-medium">Outdoor Space Size (sq ft) *</label>
                <div className="flex gap-2">
                  <Field
                    name="outdoor_size"
                    type="number"
                    min="0"
                    placeholder="e.g., 300"
                    className="flex-1 rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="rounded-lg border-0 ring-1 ring-inset ring-gray-200 bg-gray-50 p-3 text-gray-500">
                    sq ft
                  </span>
                </div>
                <ErrorMessage name="outdoor_size" component="div" className="mt-1 text-sm text-red-500" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Parking (simplified) */}
      <div className="border border-gray-300 rounded-lg p-6 space-y-6">
        <h4 className="font-semibold">Parking</h4>

        <div>
          <label className="flex items-center gap-2 mb-2">
            <Field
              type="checkbox"
              name="exclusive_parking_spaces"
              checked={!!values.exclusive_parking_spaces}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                toggle("exclusive_parking_spaces", e.target.checked, ["exclusive_parking_spaces_count"])
              }
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="text-sm font-medium">Exclusive Parking?</span>
          </label>

          {values.exclusive_parking_spaces && (
            <div className="mb-2">
              <label className="block text-sm font-medium mb-2">How many exclusive spaces?</label>
              <Field
                name="exclusive_parking_spaces_count"
                type="number"
                min="0"
                placeholder="e.g., 5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="exclusive_parking_spaces_count"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          )}
        </div>

        {/* Removed: unreserved/reserved (separate), parking ratio, common area/ratio */}
      </div>

      {/* Removed: Loading Dock Access entirely */}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-900">Important</h4>
            <p className="text-sm text-green-700 mt-1">
              Accurate square footage and any exclusive parking details help calculate rent and operating expenses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
