// components/dashboard/lease/steps/LeaseOpsMaintenance.tsx
import { LeaseFormValues } from "@/types/lease"; // FIXED: Changed from @/types/loi
import { Field, ErrorMessage, useFormikContext } from "formik";
import { DollarSign, Shield, Wrench, Zap} from "lucide-react";
import { MAINTENANCE_CATEGORIES, MaintenanceRow } from "../../loi/steps/PropertyDetailsStep";

export const LeaseOpsMaintenanceStep: React.FC = () => {
    const { values, setFieldValue, setFieldTouched } = useFormikContext<LeaseFormValues>()

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
                            <Field
                                name="tenant_gl_coverage"
                                placeholder="e.g., $1M per occurrence / $2M aggregate"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Radio group for clarity (select also fine) */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Indemnity Type</label>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2">
                                    <Field type="radio" name="indemnity_type" value="Mutual" />
                                    <span className="text-sm">Mutual</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <Field type="radio" name="indemnity_type" value="Landlord-favored" />
                                    <span className="text-sm">Landlord-favored</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Checkboxes + conditional limit */}
                    <div className="space-y-4">
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

                        {/* Only show limit when required */}
                        {values.property_contents_coverage && (
                            <div className="max-w-md">
                                <label className="block text-sm font-medium mb-2">Property/Contents Coverage Limit</label>
                                <Field
                                    name="property_contents_limit"
                                    placeholder="e.g., $100,000"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Maintenance, Repairs & Alterations */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-6">
                    <h4 className="font-semibold flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-orange-500" />
                        Maintenance, Repairs & Alterations
                    </h4>

                    {/* Header row */}
                    <div className="mb-2 grid grid-cols-12 items-center text-xs font-semibold text-gray-600 p-4">
                        <div className="col-span-8">Category</div>
                        <div className="col-span-2 text-center">Landlord</div>
                        <div className="col-span-2 text-center">Tenant</div>
                    </div>

                    <div className="rounded-lg border border-gray-200">
                        {MAINTENANCE_CATEGORIES.map(({ key: rowKey, label }) => (
                            <MaintenanceRow key={rowKey} rowKey={rowKey} label={label} />
                        ))}
                    </div>

                    <p className="mt-3 text-xs text-gray-500">
                        Per category, only one party can be selected. Click the other box to switch.
                    </p>

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
            </div>

            {/* Utilities & Services */}
            <div className="border border-gray-300 rounded-lg p-6 space-y-6">
                <h4 className="font-semibold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Utilities & Services
                </h4>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Service hours (office) */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Service Hours (Office)</label>
                        <Field
                            name="service_hours"
                            placeholder="e.g., Mon–Fri 8am–6pm"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Typical building services availability.</p>
                    </div>

                    {/* Trash/grease interceptor (retail/industrial) */}
                    <label className="flex items-center gap-3">
                        <Field
                            type="checkbox"
                            name="trash_grease_interceptor"
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium">Trash/Grease Interceptor (Retail/Industrial)</span>
                    </label>
                </div>

                {/* Available utilities list */}
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

                {/* Responsibility: single-pick per spec */}
                <div>
                    <label className="block text-sm font-medium mb-2">Responsibility</label>
                    <div className="flex flex-wrap gap-6 mt-2">
                        <label className="flex items-center gap-2">
                            <Field type="radio" name="utility_responsibility" value="Tenant direct" />
                            <span className="text-sm">Tenant direct</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <Field type="radio" name="utility_responsibility" value="Sub-metered" />
                            <span className="text-sm">Sub-metered</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <Field type="radio" name="utility_responsibility" value="Landlord with allocation" />
                            <span className="text-sm">Landlord with allocation</span>
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}