import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Building2, Info } from "lucide-react";

type PremisesValues = {
  // address
  property_address_S1: string;
  property_address_S2: string;
  property_city: string;
  property_state: string;
  property_zip: string;
  suite_or_floor: string;
  project_name: string;

  // space
  rentable_sf: number | string;
  load_factor: string;
  property_size: string;

  // extra space
  hasExtraSpace: boolean;
  patio: string;
  patio_size: number | string;

  // parking
  exclusive_parking_spaces: boolean;
  exclusive_parking_spaces_count: number | string;
  parking_ratio: string;
  unreserved_spaces: number | string;
  reserved_spaces: number | string;

  // loading dock
  loading_dock_use: boolean;              // main toggle
  loading_dock_type: "" | "Industrial" | "Retail"; // dropdown
  loading_dock_details: string;
  // industrial-only inputs
  industrial_dock_count?: number | string;
  industrial_door_clear_height_ft?: number | string;
  industrial_trailer_parking?: boolean;

  // common areas
  common_area_rights: string;
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

  const resetFields = (fields: Array<keyof PremisesValues>) => {
    fields.forEach((f) => {
      setFieldValue(f, "");
      setFieldTouched(f, false, false);
    });
  };

  const showExclusiveExtras = !!values.exclusive_parking_spaces;
  const showLoadingDock = !!values.loading_dock_use;
  const showIndustrialInputs = showLoadingDock && values.loading_dock_type === "Industrial";

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

            <Field name="property_address_S1" type="text" placeholder="Street Address Line 1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <ErrorMessage name="property_address_S1" component="div" className="text-red-500 text-sm" />

            <Field name="property_address_S2" type="text" placeholder="Street Address Line 2 (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <ErrorMessage name="property_address_S2" component="div" className="text-red-500 text-sm" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field name="property_city" type="text" placeholder="City" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <Field name="property_state" type="text" placeholder="State (e.g., CA)" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <Field name="property_zip" type="text" placeholder="ZIP (12345 or 12345-6789)" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div className="flex gap-6">
              <ErrorMessage name="property_city" component="div" className="text-sm text-red-500" />
              <ErrorMessage name="property_state" component="div" className="text-sm text-red-500" />
              <ErrorMessage name="property_zip" component="div" className="text-sm text-red-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Suite or Floor</label>
            <Field name="suite_or_floor" placeholder="Suite 200 or Floor 5" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Project / Center Name</label>
            <Field name="project_name" placeholder="Building or complex name" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Space Details */}
        <div className="space-y-6 border border-gray-300 rounded-lg p-6">
          <h4 className="font-semibold">Space Details</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rentable SF *</label>
              <Field name="rentable_sf" type="number" placeholder="5000" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <ErrorMessage name="rentable_sf" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Load Factor</label>
              <Field name="load_factor" placeholder="1.15" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Total Property Size</label>
            <Field name="property_size" placeholder="e.g., 50,000 SF" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Outer space toggle */}
          <div className="grid grid-cols-1 gap-4">
            <label className="flex items-center gap-2">
              <Field
                type="checkbox"
                name="hasExtraSpace"
                checked={!!values.hasExtraSpace}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  toggle('hasExtraSpace', e.target.checked, ['patio', 'patio_size'])
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Is there any outer space?</span>
            </label>

            {values.hasExtraSpace && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium">Patio *</label>
                  <Field name="patio" type="text" placeholder="Patio"
                    className="w-full rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3 focus:ring-2 focus:ring-blue-500" />
                  <ErrorMessage name="patio" component="div" className="mt-1 text-sm text-red-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Patio Size (sq ft) *</label>
                  <div className="flex gap-2">
                    <Field name="patio_size" type="number" min="0" placeholder="e.g., 300"
                      className="flex-1 rounded-lg border-0 ring-1 ring-inset ring-gray-300 p-3 focus:ring-2 focus:ring-blue-500" />
                    <span className="rounded-lg border-0 ring-1 ring-inset ring-gray-200 bg-gray-50 p-3 text-gray-500">sq ft</span>
                  </div>
                  <ErrorMessage name="patio_size" component="div" className="mt-1 text-sm text-red-500" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Parking & Loading */}
      <div className="border border-gray-300 rounded-lg p-6 space-y-6">
        <h4 className="font-semibold">Parking & Loading</h4>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exclusive Parking -> reveal ratio + common area */}

          {/* Exclusive Parking -> reveal ratio + common area + common ratio */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <Field
                type="checkbox"
                name="exclusive_parking_spaces"
                checked={!!values.exclusive_parking_spaces}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  toggle('exclusive_parking_spaces', e.target.checked, [
                    'exclusive_parking_spaces_count',
                    'parking_ratio',
                    'common_area',
                    'common_ratio',
                  ])
                }
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium">Exclusive Parking</span>
            </label>

            {values.exclusive_parking_spaces && (
              <>
                {/* <div className="mb-4">
                  <label className="block text-sm font-medium mb-2"># Exclusive Spaces</label>
                  <Field
                    name="exclusive_parking_spaces_count"
                    type="number"
                    min="0"
                    placeholder="e.g., 5"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Parking Ratio</label>
                  <Field
                    name="parking_ratio"
                    placeholder="e.g., 4 per 1000 SF"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div> */}

                {/* NEW: Common Area */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Common Area</label>
                  <Field
                    as="textarea"
                    name="common_area"
                    rows={2}
                    placeholder="Describe the common area (e.g., shared garage, valet zone)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* NEW: Common Ratio */}
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-2">Common Ratio</label>
                  <Field
                    name="common_ratio"
                    placeholder="e.g., 1.10"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Unreserved Spaces</label>
            <Field name="unreserved_spaces" type="number" placeholder="10"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Reserved Spaces</label>
            <Field name="reserved_spaces" type="number" placeholder="2"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Loading Dock: dropdown w/ Industrial & Retail */}
          <div className="col-span-1 lg:col-span-3">
            <label className="flex items-center gap-2">
              <Field
                type="checkbox"
                name="loading_dock_use"
                checked={!!values.loading_dock_use}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const checked = e.target.checked;
                  toggle('loading_dock_use', checked, [
                    'loading_dock_type',
                    'loading_dock_details',
                    'industrial_dock_count',
                    'industrial_door_clear_height_ft',
                    'industrial_trailer_parking',
                  ]);
                  if (!checked) setFieldValue('loading_dock_type', '');
                }}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium">Loading Dock Access</span>
            </label>

            {showLoadingDock && (
              <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <Field as="select" name="loading_dock_type"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const v = e.target.value as PremisesValues["loading_dock_type"];
                      setFieldValue('loading_dock_type', v);
                      if (v !== "Industrial") {
                        resetFields(['industrial_dock_count', 'industrial_door_clear_height_ft']);
                        setFieldValue('industrial_trailer_parking', false);
                      }
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Select type</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Retail">Retail</option>
                  </Field>
                </div>

                {/* Always available details box */}
                {/* <div className="lg:col-span-2">
                  <label className="block text-sm font-medium mb-2">Details</label>
                  <Field as="textarea" rows={2} name="loading_dock_details"
                    placeholder={values.loading_dock_type === "Industrial" ? "E.g., shared dock, 53' trailer access" : "E.g., rear service corridor access"}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div> */}

                {/* Industrial-only extra inputs */}
                {showIndustrialInputs && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2"># Docks</label>
                      <Field name="industrial_dock_count" type="number" min="0" placeholder="e.g., 4"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>

                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* /      Common Areas & Rights — now reveals when Exclusive Parking is ON */}
      {/* {showExclusiveExtras && (
        <div className="border border-gray-300 rounded-lg p-6 space-y-4">
          <h4 className="font-semibold">Common Areas & Rights</h4>
          <div>
            <label className="block text-sm font-medium mb-2">Common Area Rights</label>
            <Field as="textarea" name="common_area_rights" rows={3}
              placeholder="Describe common area access and usage rights"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      )} */}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-900">Important</h4>
            <p className="text-sm text-green-700 mt-1">
              Accurate square footage and parking details are critical for calculating rent and operating expenses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
