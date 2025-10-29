/* eslint-disable @typescript-eslint/no-explicit-any */

// components/dashboard/lease/steps/rightsOptions.tsx
import { ErrorMessage, Field, useFormikContext } from "formik";
import { Briefcase, Info } from "lucide-react";
import { useEffect } from "react";
import { ExhibitsRepeater } from "../utils/ehibit";

export const UseHoursExclusivesSection = () => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<any>();

  // clear dependent fields
  useEffect(() => {
    if (!values.cotenancy_applicable) {
      setFieldValue("cotenancy_opening", "");
      setFieldValue("cotenancy_ongoing", "");
      setFieldValue("cotenancy_remedies", "");
    }
  }, [values.cotenancy_applicable, setFieldValue]);

  useEffect(() => {
    if (!values.prohibited_custom) setFieldValue("prohibited_uses", "");
  }, [values.prohibited_custom, setFieldValue]);

  // toggle-dependent clears
  useEffect(() => {
    if (values.rofr_yes !== "Yes") setFieldValue("rofr_scope", "");
    if (values.ltp_yes !== "Yes") setFieldValue("ltp_terms_window_days", "");
  }, [values.rofr_yes, values.ltp_yes, setFieldValue]);

  return (
    <>
      <div className="space-y-6">
        <h3 className="text-lg font-semibold mb-4">Rights, Options & Conditions</h3>
        <p className="text-gray-600">
          Use rights, exclusives, co-tenancy, special rights, and lender items.
        </p>

        {/* Use, Hours & Exclusives */}
        <div className="border border-gray-300 rounded-lg p-6 space-y-6">
          <h4 className="font-semibold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            Use, Hours & Exclusives
          </h4>

          {/* Permitted Use – REQUIRED */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Permitted Use * <span className="text-xs text-gray-500">(plain language)</span>
            </label>
            <Field
              as="textarea"
              rows={3}
              name="permitted_use"
              placeholder="e.g., Gas station / Grocery / Medical office"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name="permitted_use" component="div" className="text-red-500 text-sm mt-1" />
            <p className="text-xs text-gray-500 mt-1">
              This will drive the correct lease template (e.g., Gas Station, Grazing Animal, Ground Lease,
              Shopping Center, Medical Office). Leave the mapping to the template engine/AI.
            </p>
          </div>

          {/* Prohibited Uses (optional custom list) */}
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <Field
                type="checkbox"
                name="prohibited_custom"
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium">
                Provide custom prohibited uses (otherwise the standard list applies)
              </span>
            </label>

            {values.prohibited_custom && (
              <div>
                <label className="block text-sm font-medium mb-2">Prohibited Uses (custom)</label>
                <Field
                  as="textarea"
                  rows={3}
                  name="prohibited_uses"
                  placeholder="List any specific prohibited uses…"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Operating Hours (optional) */}
          <div>
            <label className="block text-sm font-medium mb-2">Operating Hours (Retail)</label>
            <Field
              name="operating_hours"
              placeholder="e.g., Mon–Sun 10am–9pm (leave blank if not required)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Exclusive Use (optional) */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Exclusive Use Protection?</label>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2">
                <Field type="radio" name="exclusive_requested" value="No" />
                <span className="text-sm">No</span>
              </label>
              <label className="flex items-center gap-2">
                <Field type="radio" name="exclusive_requested" value="Yes" />
                <span className="text-sm">Yes</span>
              </label>
            </div>

            {values.exclusive_requested === "Yes" && (
              <div>
                <label className="block text-sm font-medium mb-2">Exclusive Description</label>
                <Field
                  as="textarea"
                  rows={2}
                  name="exclusive_description"
                  placeholder="e.g., Exclusive for primary sale of specialty coffee within the center (reasonable carve-outs allowed)…"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Co-tenancy (optional) */}
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <Field
                type="checkbox"
                name="cotenancy_applicable"
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            <span className="text-sm font-medium">Co-tenancy Applies (Retail)</span>
            </label>

            {values.cotenancy_applicable && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Opening Co-tenancy</label>
                  <Field
                    as="textarea"
                    rows={2}
                    name="cotenancy_opening"
                    placeholder="e.g., LL to maintain 70% GLA open incl. anchors"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ongoing Co-tenancy</label>
                  <Field
                    as="textarea"
                    rows={2}
                    name="cotenancy_ongoing"
                    placeholder="e.g., 60% GLA open; replacement anchor rules"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Remedies</label>
                  <Field
                    as="textarea"
                    rows={2}
                    name="cotenancy_remedies"
                    placeholder="e.g., Rent abatement to % rent only; termination after 12 months"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Options & Special Rights (put this early; ROFR only + LTP) */}
        <div className="border border-gray-300 rounded-lg p-6 space-y-6">
          <h4 className="font-semibold">Options & Special Rights</h4>

          {/* ROFR only (no ROFO; scope mentions demised premises) */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Right of First Refusal (ROFR)?
            </label>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2"><Field type="radio" name="rofr_yes" value="No" /><span>No</span></label>
              <label className="flex items-center gap-2"><Field type="radio" name="rofr_yes" value="Yes" /><span>Yes</span></label>
            </div>
            {values.rofr_yes === "Yes" && (
              <div>
                <label className="block text-sm font-medium mb-2">ROFR Scope</label>
                <Field
                  as="textarea"
                  rows={2}
                  name="rofr_scope"
                  placeholder="e.g., Applies to Tenant’s demised premises / immediately adjacent space per LL’s bona fide offer"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Lease-to-Purchase (keep; replaces separate Purchase Option) */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Lease-to-Purchase?</label>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2"><Field type="radio" name="ltp_yes" value="No" /><span>No</span></label>
              <label className="flex items-center gap-2"><Field type="radio" name="ltp_yes" value="Yes" /><span>Yes</span></label>
            </div>
            {values.ltp_yes === "Yes" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Terms Window (days)</label>
                  <Field
                    name="ltp_terms_window_days"
                    type="number"
                    placeholder="30"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                  <Field
                    as="textarea"
                    rows={2}
                    name="ltp_notes"
                    placeholder="e.g., Portion of base rent credited to price cap"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Renewal options stay (they asked for 5 × 2yrs example) */}
          <div className="space-y-2">
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
                Include renewal option(s)
              </label>
            </div>

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
          </div>
        </div>

        {/* Subordination / SNDA / Estoppel (kept) */}
        <div className="border border-gray-300 rounded-lg p-6 space-y-6">
          <h4 className="font-semibold">Subordination / SNDA / Estoppel</h4>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Subordination to current/future mortgages?</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <Field type="radio" name="subordination_automatic" value="No" />
                <span>No</span>
              </label>
              <label className="flex items-center gap-2">
                <Field type="radio" name="subordination_automatic" value="Yes" />
                <span>Yes (default)</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Non-disturbance required?</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <Field type="radio" name="non_disturbance_required" value="No" />
                <span>No</span>
              </label>
              <label className="flex items-center gap-2">
                <Field type="radio" name="non_disturbance_required" value="Yes" />
                <span>Yes</span>
              </label>
            </div>
            {values.non_disturbance_required === "Yes" && (
              <div>
                <label className="block text-sm font-medium mb-1">Lender NDS condition</label>
                <Field
                  name="nondisturbance_condition"
                  placeholder="e.g., So long as Tenant is not in default, possession honored"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estoppel delivery window (days)</label>
            <Field
              name="estoppel_delivery_days"
              type="number"
              placeholder="10"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Exhibits (attach only; not editable) */}
        <ExhibitsRepeater />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Heads-up</h4>
              <p className="text-sm text-blue-700 mt-1">
                Many downstream defaults (cure days, late fees, signage specifics, etc.) will be auto-inserted by
                your clause engine based on posture (LL-favored vs Tenant-favored) and template selection, so they’re intentionally omitted here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
