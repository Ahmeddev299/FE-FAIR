/* eslint-disable @typescript-eslint/no-explicit-any */

// components/dashboard/lease/steps/rightsOptions.tsx
import { ErrorMessage, Field, useFormikContext } from "formik";
import { Briefcase, Info } from "lucide-react";
import { useEffect } from "react";
import { ExhibitsRepeater } from "../utils/ehibit";

export const UseHoursExclusivesSection = () => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<any>();

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

  // add near the top of your component (after useFormikContext)
  useEffect(() => {
    if (values.rofo_yes !== "Yes") setFieldValue("rofo_scope", "");
    if (values.rofr_yes !== "Yes") setFieldValue("rofr_scope", "");
    if (values.purchase_yes !== "Yes") setFieldValue("purchase_terms_window_days", "");
    if (values.ltp_yes !== "Yes") setFieldValue("ltp_terms_window_days", "");
  }, [
    values.rofo_yes,
    values.rofr_yes,
    values.purchase_yes,
    values.ltp_yes,
    setFieldValue,
  ]);

  // after: const { values, setFieldValue } = useFormikContext<any>();
  useEffect(() => {
    // Assignment & Subletting
    if (values.consent_required !== "Yes") {
      setFieldValue("consent_standard", "");
    }
    if (values.permitted_transfers_yes !== "Yes") {
      setFieldValue("permitted_transfers_scope", "");
    }
    if (values.recapture_right !== "Yes") {
      setFieldValue("recapture_applies_to", "");
    }
    if (!values.profit_sharing_percent) {
      setFieldValue("profit_sharing_percent", "");
    }

    // Casualty & Condemnation
    if (values.rent_abatement_during_restoration !== "Yes") {
      setFieldValue("rent_abatement_scope", "");
    }

    // Subordination / SNDA / Estoppel
    if (values.non_disturbance_required !== "Yes") {
      setFieldValue("nondisturbance_condition", "");
    }
  }, [
    values.consent_required,
    values.permitted_transfers_yes,
    values.recapture_right,
    values.profit_sharing_percent,
    values.rent_abatement_during_restoration,
    values.non_disturbance_required,
    setFieldValue,
  ]);

  useEffect(() => {
    if (!values.monument_signage) setFieldValue("monument_panel_spec", "");
    if (!values.pylon_signage) setFieldValue("pylon_panel_spec", "");

    if (values.temp_grand_opening !== "Yes") setFieldValue("temp_grand_opening_days", "");
    if (values.banner_signage !== "Yes") setFieldValue("banner_signage_days", "");

    if (values.signage_criteria_waiver !== "Yes") setFieldValue("signage_waiver_notes", "");
  }, [
    values.monument_signage,
    values.pylon_signage,
    values.temp_grand_opening,
    values.banner_signage,
    values.signage_criteria_waiver,
    setFieldValue,
  ]);

  return (
    <>
      <div className="space-y-6">
        <h3 className="text-lg font-semibold mb-4">Rights, Options & Conditions</h3>
        <p className="text-gray-600">
          Use rights, option terms, assignment, defaults, signage, and special conditions.
        </p>

        {/* Use, Hours & Exclusives */}
        <div className="border border-gray-300 rounded-lg p-6 space-y-6">
          <h4 className="font-semibold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            Use, Hours & Exclusives
          </h4>

          {/* Permitted Use */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Permitted Use (plain language)
            </label>
            <Field
              as="textarea"
              rows={3}
              name="permitted_use"
              placeholder="e.g., Retail sale of apparel and related accessories"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Prohibited Uses */}
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <Field
                type="checkbox"
                name="prohibited_custom"
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium">
                Provide custom prohibited uses (otherwise use standard list)
              </span>
            </label>

            {values.prohibited_custom && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Prohibited Uses (custom)
                </label>
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

          {/* Operating Hours (retail; omit if blank) */}
          <div>
            <label className="block text-sm font-medium mb-2">Operating Hours (Retail)</label>
            <Field
              name="operating_hours"
              placeholder="e.g., Mon–Sun 10am–9pm (or 'none')"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank if not required.</p>
          </div>

          {/* Go-dark right */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Go-Dark Right</label>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2">
                <Field type="radio" name="go_dark" value="No" />
                <span className="text-sm">No</span>
              </label>
              <label className="flex items-center gap-2">
                <Field type="radio" name="go_dark" value="Yes" />
                <span className="text-sm">Yes</span>
              </label>
            </div>

            {values.go_dark === "Yes" && (
              <div>
                <label className="block text-sm font-medium mb-2">Go-Dark Conditions</label>
                <Field
                  as="textarea"
                  rows={2}
                  name="go_dark_conditions"
                  placeholder="e.g., Up to 120 days during remodel; notice to LL; continued rent, etc."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Exclusive Use */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Exclusive Use Protection Requested?</label>
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
                  placeholder="e.g., Exclusive for primary sale of specialty coffee within the center (carve-outs OK)…"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Co-tenancy (retail only) */}
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
                    placeholder="e.g., LL to maintain 70% GLA open incl. anchors A & B"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ongoing Co-tenancy</label>
                  <Field
                    as="textarea"
                    rows={2}
                    name="cotenancy_ongoing"
                    placeholder="e.g., 60% GLA open; replacement anchor requirements"
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

        {/* Options & Special Rights */}
        <div className="border border-gray-300 rounded-lg p-6 space-y-6">
          <h4 className="font-semibold">Options & Special Rights</h4>

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

          {/* ROFO / ROFR / Purchase / LTP */}
          <div className="border border-gray-300 rounded-lg p-6 space-y-6">
            <h4 className="font-semibold">Options & Special Rights</h4>

            {/* ROFO */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Right of First Offer (ROFO) on nearby space?
              </label>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2"><Field type="radio" name="rofo_yes" value="No" /><span>No</span></label>
                <label className="flex items-center gap-2"><Field type="radio" name="rofo_yes" value="Yes" /><span>Yes</span></label>
              </div>
              {values.rofo_yes === "Yes" && (
                <div>
                  <label className="block text-sm font-medium mb-2">ROFO Scope</label>
                  <Field
                    as="textarea"
                    rows={2}
                    name="rofo_scope"
                    placeholder="e.g., Adjacent suite(s) within same building; excludes anchor spaces; one-time right"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            {/* ROFR */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Right of First Refusal (ROFR) on space?
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
                    placeholder="e.g., Same floor, comparable size; excludes existing LOIs"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Purchase Option */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Purchase Option?
              </label>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2"><Field type="radio" name="purchase_yes" value="No" /><span>No</span></label>
                <label className="flex items-center gap-2"><Field type="radio" name="purchase_yes" value="Yes" /><span>Yes</span></label>
              </div>
              {values.purchase_yes === "Yes" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Terms Window (days)</label>
                    <Field
                      name="purchase_terms_window_days"
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
                      name="purchase_notes"
                      placeholder="e.g., Fixed price per appraisal; one exercise during term"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Lease-to-Purchase */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Lease-to-Purchase?
              </label>
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
          </div>

        </div>

        {/* Assignment & Subletting */}
        {/* Assignment & Subletting */}
        <div className="border border-gray-300 rounded-lg p-6 space-y-6">
          <h4 className="font-semibold">Assignment & Subletting</h4>

          {/* Consent required + standard */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Landlord consent required?</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2"><Field type="radio" name="consent_required" value="No" /><span>No</span></label>
              <label className="flex items-center gap-2"><Field type="radio" name="consent_required" value="Yes" /><span>Yes</span></label>
            </div>
            {values.consent_required === "Yes" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Consent Standard</label>
                  <Field
                    as="select"
                    name="consent_standard"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select…</option>
                    <option value="Not unreasonably withheld">Not unreasonably withheld (standard)</option>
                    <option value="Sole discretion">Sole discretion (LL-favored)</option>
                  </Field>
                </div>
              </div>
            )}
          </div>

          {/* Permitted transfers without consent */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Permitted transfers without consent?</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2"><Field type="radio" name="permitted_transfers_yes" value="No" /><span>No</span></label>
              <label className="flex items-center gap-2"><Field type="radio" name="permitted_transfers_yes" value="Yes" /><span>Yes</span></label>
            </div>
            {values.permitted_transfers_yes === "Yes" && (
              <div>
                <label className="block text-sm font-medium mb-1">Scope</label>
                <Field
                  as="textarea"
                  rows={2}
                  name="permitted_transfers_scope"
                  placeholder="e.g., Affiliates, reorganizations, sale of substantially all assets"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Continued liability / Recapture / Profit share */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <label className="flex items-center gap-3">
              <Field type="checkbox" name="continued_liability_on_assignment" />
              <span className="text-sm font-medium">Continued liability on assignment</span>
            </label>

            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <Field type="checkbox" name="recapture_right" />
                <span className="text-sm font-medium">Landlord recapture right</span>
              </label>
              {values.recapture_right && (
                <div>
                  <label className="block text-sm font-medium mb-1">Recapture applies to</label>
                  <Field
                    as="select"
                    name="recapture_applies_to"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select…</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Sublet">Sublet</option>
                    <option value="Both">Both</option>
                  </Field>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Profit-sharing on transfers (% of excess)</label>
              <Field
                name="profit_sharing_percent"
                type="number"
                step="0.1"
                placeholder=""
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to omit if none.</p>
            </div>
          </div>
        </div>

        {/* Casualty & Condemnation */}
        <div className="border border-gray-300 rounded-lg p-6 space-y-6">
          <h4 className="font-semibold">Casualty & Condemnation</h4>

          <div>
            <label className="block text-sm font-medium mb-1">Casualty termination threshold</label>
            <Field
              name="casualty_termination_threshold"
              placeholder="e.g., >40% damage or >180 days to restore"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Rent abatement during restoration?</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2"><Field type="radio" name="rent_abatement_during_restoration" value="No" /><span>No</span></label>
              <label className="flex items-center gap-2"><Field type="radio" name="rent_abatement_during_restoration" value="Yes" /><span>Yes</span></label>
            </div>
            {values.rent_abatement_during_restoration === "Yes" && (
              <div>
                <label className="block text-sm font-medium mb-1">Abatement scope</label>
                <Field
                  as="textarea"
                  rows={2}
                  name="rent_abatement_scope"
                  placeholder="e.g., Base rent abated proportionally to unusable area until substantial completion"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>


        {/* Subordination / SNDA / Estoppel */}
        <div className="border border-gray-300 rounded-lg p-6 space-y-6">
          <h4 className="font-semibold">Subordination / SNDA / Estoppel</h4>

          {/* Subordination */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Subordination to current/future mortgages?</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2"><Field type="radio" name="subordination_automatic" value="No" /><span>No</span></label>
              <label className="flex items-center gap-2"><Field type="radio" name="subordination_automatic" value="Yes" /><span>Yes (default)</span></label>
            </div>
          </div>

          {/* Non-disturbance */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Non-disturbance required?</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2"><Field type="radio" name="non_disturbance_required" value="No" /><span>No</span></label>
              <label className="flex items-center gap-2"><Field type="radio" name="non_disturbance_required" value="Yes" /><span>Yes</span></label>
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

          {/* Estoppel */}
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


        {/* Defaults & Remedies */}
        <div className="border border-gray-300 rounded-lg p-6 space-y-6">
          <h4 className="font-semibold">Defaults & Remedies</h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Monetary Cure Period (Days)
              </label>
              <Field
                name="monetary_cure_period_days"
                type="number"
                placeholder="5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Non-Monetary Cure Period (Days)
              </label>
              <Field
                name="non_monetary_cure_period_days"
                type="number"
                placeholder="10"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Late Fee Percent (%)</label>
              <Field
                name="late_fee_percent"
                type="number"
                step="0.1"
                placeholder="5.0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Interest Rate APR (%)</label>
              <Field
                name="interest_rate_apr"
                type="number"
                step="0.1"
                placeholder="12.0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <label className="flex items-center gap-3">
              <Field type="checkbox" name="attorneys_fees_clause" className="w-5 h-5" />
              <span className="text-sm font-medium">Attorney’s Fees Clause</span>
            </label>
          </div>
        </div>

        {/* Signage & Branding */}
        <div className="border border-gray-300 rounded-lg p-6 space-y-4">
          <h4 className="font-semibold">Signage & Branding</h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              ["building_signage", "Building Signage"],
              ["facade_signage", "Facade Signage"],
              ["window_decals_allowed", "Window Decals Allowed"],
              ["roof_signage", "Roof Signage"],
              ["blade_sign", "Blade/Projecting Sign"],
            ].map(([name, label]) => (
              <label key={name} className="flex items-center gap-3">
                <Field type="checkbox" name={name} className="w-5 h-5" />
                <span className="text-sm font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2 border border-gray-300 rounded-lg p-6 gap-6">
          <label className="flex items-center gap-3">
            <Field type="checkbox" name="monument_signage" className="w-5 h-5" />
            <span className="text-sm font-medium">Monument Signage</span>
          </label>
          {values.monument_signage && (
            <div>
              <label className="block text-sm font-medium mb-1">Monument Panel Spec/Size</label>
              <Field
                name="monument_panel_spec"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Temporary / Event signage */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Grand-opening signage allowed?</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2"><Field type="radio" name="temp_grand_opening" value="No" /><span>No</span></label>
            <label className="flex items-center gap-2"><Field type="radio" name="temp_grand_opening" value="Yes" /><span>Yes</span></label>
          </div>
          {values.temp_grand_opening === "Yes" && (
            <div>
              <label className="block text-sm font-medium mb-1">Days permitted</label>
              <Field
                name="temp_grand_opening_days"
                type="number"
                placeholder="30"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Process / Waivers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">LL signage approval window (days)</label>
            <Field
              name="ll_signage_approval_days"
              type="number"
              placeholder="10"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Permits responsibility</label>
            <Field
              as="select"
              name="signage_permits_responsible"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select…</option>
              <option value="Tenant">Tenant</option>
              <option value="Landlord">Landlord</option>
            </Field>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Maintenance responsibility</label>
            <Field
              as="select"
              name="signage_maintenance_responsible"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select…</option>
              <option value="Tenant">Tenant</option>
              <option value="Landlord">Landlord</option>
            </Field>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Signage criteria waiver requested?</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2"><Field type="radio" name="signage_criteria_waiver" value="No" /><span>No</span></label>
            <label className="flex items-center gap-2"><Field type="radio" name="signage_criteria_waiver" value="Yes" /><span>Yes</span></label>
          </div>
          {values.signage_criteria_waiver === "Yes" && (
            <div>
              <label className="block text-sm font-medium mb-1">Waiver notes</label>
              <Field
                as="textarea"
                rows={2}
                name="signage_waiver_notes"
                placeholder="e.g., Larger letter height, non-standard colors, cabinet projection"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* 19) Rules, Compliance & Misc. */}
        <div className="border border-gray-300 rounded-lg p-6 space-y-6">
          <h4 className="font-semibold">Rules, Compliance & Misc.</h4>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium">Rules & Regulations attached?</label>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-2"><Field type="radio" name="rules_attached" value="No" /><span>No</span></label>
                <label className="flex items-center gap-2"><Field type="radio" name="rules_attached" value="Yes" /><span>Yes</span></label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Exclusive list attached?</label>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-2"><Field type="radio" name="exclusive_list_attached" value="No" /><span>No</span></label>
                <label className="flex items-center gap-2"><Field type="radio" name="exclusive_list_attached" value="Yes" /><span>Yes</span></label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Prohibited hazardous uses beyond standard?</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2"><Field type="radio" name="prohibited_hazardous_beyond_standard" value="No" /><span>No</span></label>
              <label className="flex items-center gap-2"><Field type="radio" name="prohibited_hazardous_beyond_standard" value="Yes" /><span>Yes</span></label>
            </div>
            {values.prohibited_hazardous_beyond_standard === "Yes" && (
              <div>
                <label className="block text-sm font-medium mb-1">Specifics</label>
                <Field
                  as="textarea"
                  rows={2}
                  name="hazardous_specifics"
                  placeholder="e.g., No fuel storage; no medical waste; no hazardous materials on-site"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium">Confidentiality of lease terms?</label>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-2"><Field type="radio" name="confidentiality_lease_terms" value="No" /><span>No</span></label>
                <label className="flex items-center gap-2"><Field type="radio" name="confidentiality_lease_terms" value="Yes" /><span>Yes</span></label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Option to relocate tenant?</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2"><Field type="radio" name="option_to_relocate" value="No" /><span>No</span></label>
                <label className="flex items-center gap-2"><Field type="radio" name="option_to_relocate" value="Yes" /><span>Yes</span></label>
              </div>
              {values.option_to_relocate === "Yes" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Notice period (days)</label>
                    <Field
                      name="relocate_notice_days"
                      type="number"
                      placeholder="30"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Conditions</label>
                    <Field
                      name="relocate_conditions"
                      placeholder="e.g., Comparable size/location; LL pays reasonable move costs; no rent increase"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 20) Exhibits to Collect / Attach */}
        <ExhibitsRepeater />


        {/* 21) Final Admin */}
        <div className="border border-gray-300 rounded-lg p-6 space-y-6">
          <h4 className="font-semibold">Final Admin</h4>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Effective date placeholder</label>
              <Field
                name="effective_date_placeholder"
                placeholder="e.g., Effective as of __ / __ / ____ if different from signature date"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Counterparts / e-sign permitted?</label>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-2"><Field type="radio" name="esign_permitted" value="No" /><span>No</span></label>
                <label className="flex items-center gap-2"><Field type="radio" name="esign_permitted" value="Yes" /><span>Yes</span></label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Notice by email deemed received?</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2"><Field type="radio" name="notice_email_accepted" value="No" /><span>No</span></label>
                <label className="flex items-center gap-2"><Field type="radio" name="notice_email_accepted" value="Yes" /><span>Yes</span></label>
              </div>
              {values.notice_email_accepted === "Yes" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Email notice notes (optional)</label>
                  <Field
                    name="notice_email_notes"
                    placeholder="e.g., Deemed received on send; cc required; specific mailbox"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>


        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Heads-up</h4>
              <p className="text-sm text-blue-700 mt-1">
                Options and assignment terms often need legal review—capture intent clearly to avoid renegotiation later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
