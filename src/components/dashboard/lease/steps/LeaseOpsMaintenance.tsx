// components/dashboard/lease/steps/opsMaintenance.tsx
import { LeaseFormValues } from "@/types/loi";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { DollarSign, Shield, Wrench, Zap, Info } from "lucide-react";

export const LeaseOpsMaintenanceStep: React.FC = () => {
    const { values, setFieldValue, setFieldTouched } = useFormikContext<LeaseFormValues>()

    const isGross = values.lease_structure === "Gross";
    const isModGross = values.lease_structure === "Modified Gross";
    const isNNN = values.lease_structure === "Triple Net";

    const showPassThroughBlock = isModGross || isNNN;
    const showDisclosureEstimates = isNNN || (!!values.pass_throughs && values.pass_throughs.trim() !== "");

    const clearIfGross = () => {
        if (values.lease_structure === "Gross") {
            // clear pass-through related fields when switching to Gross
            [
                "pass_throughs",
                "cam_include_exclude",
                "management_fee_cap_percent",
                "capital_amortization_rules",
                "est_cam_per_sf",
                "est_taxes_per_sf",
                "est_insurance_per_sf",
            ].forEach((k) => setFieldValue(k, ""));
        }
    };
    return (
        <>
            <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Operations & Maintenance</h3>
                <p className="text-gray-600">Operating expenses, insurance, upkeep, and services.</p>

                {/* Operating Expenses / NNN */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-6">
                    <h4 className="font-semibold flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        Operating Expenses / NNN
                    </h4>

                    {/* Structure + Pro Rata */}
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
                            </Field>
                            <ErrorMessage name="lease_structure" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Tenant Pro-Rata Share (%)</label>
                            <Field
                                name="tenant_pro_rata_share"
                                type="number"
                                step="0.01"
                                placeholder="15.50"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Pass-Throughs (Modified Gross / NNN) */}
                    {showPassThroughBlock && (
                        <>
                         
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    CAM Include / Exclude
                                    <span className="text-gray-500"> (e.g., management fee cap %, capital amortization rules)</span>
                                </label>
                                <Field
                                    name="cam_include_exclude"
                                    as="textarea"
                                    rows={2}
                                    placeholder="Specify inclusions and exclusions"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Optional granular helpers */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Mgmt Fee Cap (%)</label>
                                    <Field
                                        name="management_fee_cap_percent"
                                        type="number"
                                        step="0.1"
                                        placeholder="e.g., 3.0"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium mb-2">Capital Amortization Rules</label>
                                    <Field
                                        as="textarea"
                                        name="capital_amortization_rules"
                                        rows={2}
                                        placeholder="e.g., Code-required only; amortized over useful life at 6%"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Estimates (disclosure-only): show for NNN or when pass-throughs provided */}
                    {showDisclosureEstimates && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                        </div>
                    )}

                    {/* Audit Right */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <Field type="checkbox" name="audit_right" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                            <label className="text-sm font-medium">Audit Right</label>
                        </div>

                        {/* Only show these when audit_right is checked */}
                        {values.audit_right && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Audit Window (Months)</label>
                                    <Field
                                        name="audit_window_months"
                                        type="number"
                                        placeholder="12"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Audit Threshold (%)</label>
                                    <Field
                                        name="audit_threshold_percent"
                                        type="number"
                                        step="0.1"
                                        placeholder="5.0"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Insurance & Risk Management */}
                    <div className="border border-gray-300 rounded-lg p-6 space-y-6">
                        <h4 className="font-semibold flex items-center gap-2">
                            <Shield className="w-5 h-5 text-purple-500" />
                            Insurance & Risk Management
                        </h4>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Tenant GL Coverage</label>
                                <Field name="tenant_gl_coverage" placeholder="e.g., $1M per occurrence / $2M aggregate" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Indemnity Type</label>
                                <Field as="select" name="indemnity_type" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select type</option>
                                    <option value="Mutual">Mutual</option>
                                    <option value="Landlord-favored">Landlord-favored</option>
                                </Field>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6">
                            <label className="flex items-center gap-3">
                                <Field type="checkbox" name="property_contents_coverage" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                                <span className="text-sm font-medium">Property Contents Coverage Required</span>
                            </label>
                            <label className="flex items-center gap-3">
                                <Field type="checkbox" name="waiver_of_subrogation" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                                <span className="text-sm font-medium">Waiver of Subrogation</span>
                            </label>
                        </div>
                    </div>

                {/* Maintenance, Repairs & Alterations */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-6">
                    <h4 className="font-semibold flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-orange-500" />
                        Maintenance, Repairs & Alterations
                    </h4>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Roof Maintenance</label>
                            <Field as="select" name="maintenance.roof" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Select responsibility</option>
                                <option value="Landlord">Landlord</option>
                                <option value="Tenant">Tenant</option>
                                <option value="Shared">Shared</option>
                            </Field>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Structure Maintenance</label>
                            <Field as="select" name="maintenance.structure" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Select responsibility</option>
                                <option value="Landlord">Landlord</option>
                                <option value="Tenant">Tenant</option>
                                <option value="Shared">Shared</option>
                            </Field>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Parking Maintenance</label>
                            <Field as="select" name="maintenance.parking" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Select responsibility</option>
                                <option value="Landlord">Landlord</option>
                                <option value="Tenant">Tenant</option>
                                <option value="Shared">Shared</option>
                            </Field>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Cosmetic Threshold (USD)</label>
                            <Field name="cosmetic_threshold_usd" type="number" placeholder="5000" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <label className="flex items-center gap-3">
                            <Field type="checkbox" name="hvac_contract_required" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                            <span className="text-sm font-medium">HVAC Contract Required</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <Field type="checkbox" name="alterations_consent_required" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                            <span className="text-sm font-medium">Alterations Consent Required</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <Field type="checkbox" name="restoration_required_on_exit" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                            <span className="text-sm font-medium">Restoration Required on Exit</span>
                        </label>
                    </div>
                </div>

                {/* Utilities & Services */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-6">
                    <h4 className="font-semibold flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Utilities & Services
                    </h4>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Service Hours</label>
                            <Field name="service_hours" type="number" placeholder="24" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <p className="text-xs text-gray-500 mt-1">Hours per day (for office leases)</p>
                        </div>

                        <label className="flex items-center gap-3">
                            <Field type="checkbox" name="trash_grease_interceptor" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                            <span className="text-sm font-medium">Trash/Grease Interceptor (Retail/Industrial)</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Available Utilities</label>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                            {['Electric', 'Gas', 'Water', 'Sewer', 'Internet', 'Phone', 'HVAC', 'Security'].map(u => (
                                <label key={u} className="flex items-center gap-2">
                                    <Field type="checkbox" name="utilities" value={u} className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                                    <span className="text-sm">{u}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Responsibility</label>
                        <div className="flex gap-6 mt-2">
                            <label className="flex items-center gap-2">
                                <Field type="checkbox" name="responsibility" value="Tenant" className="w-4 h-4" />
                                <span className="text-sm">Tenant</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <Field type="checkbox" name="responsibility" value="Landlord" className="w-4 h-4" />
                                <span className="text-sm">Landlord</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-medium text-blue-900">Operating Expenses</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                Triple Net passes through most operating costs. Modified Gross may cap or set a base year. Ensure clear CAM reconciliation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}