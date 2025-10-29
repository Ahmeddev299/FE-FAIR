// components/dashboard/lease/steps/LeaseOpsMaintenance.tsx
import { LeaseFormValues } from "@/types/lease";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { DollarSign, Shield, Wrench, Zap } from "lucide-react";
import { MAINTENANCE_CATEGORIES, MaintenanceRow } from "../utils/maintenance";
import { INSURANCE_CATEGORIES } from "../utils/insurance";
import { InsuranceRow } from "../utils/insurancerow";

export const LeaseOpsMaintenanceStep: React.FC = () => {
    const { values, setFieldValue, setFieldTouched } = useFormikContext<LeaseFormValues>();

    const isModGross = values.lease_structure === "Modified Gross";
    const isNNN = values.lease_structure === "Triple Net";
    const showPassThroughBlock = isModGross || isNNN;

    const rentable = Number(values.rentable_sf || 0);
    const totalSize = Number(values.property_size || 0);
    const proRata = totalSize > 0 && rentable > 0 ? (rentable / totalSize) * 100 : null;

    const clearIfGross = () => {
        if (values.lease_structure === "Gross") {
            [
                "pass_throughs",
                "cam_include_exclude",
                "management_fee_cap_percent",
                "capital_amortization_rules",
                "est_cam_per_sf",
                "est_taxes_per_sf",
                "est_insurance_per_sf",
                "nnn_est_annual",
            ].forEach((k) => setFieldValue(k, ""));
        }
    };

    return (
        <>
            <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Operations & Maintenance</h3>
                <p className="text-gray-600">Operating expenses, insurance, upkeep, and services.</p>

                {/* Operating Expenses / Structure */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-6">
                    <h4 className="font-semibold flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        Operating Expenses / Structure
                    </h4>

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

                        {/* Auto pro-rata (read-only) */}
                        {/* <div>
                            <label className="block text-sm font-medium mb-2">Tenant Pro-Rata Share (%)</label>
                            <input
                                value={proRata !== null ? proRata.toFixed(2) : ""}
                                readOnly
                                placeholder={proRata === null ? "Enter total property size to auto-calculate" : ""}
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Auto: rentable_sf ÷ total_property_size. Edit premises to change.
                            </p>
                        </div> */}
                    </div>

                    {/* Pass-throughs + estimates */}
                    {showPassThroughBlock && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">CAM Include / Exclude</label>
                                <Field
                                    name="cam_include_exclude"
                                    as="textarea"
                                    rows={2}
                                    placeholder="e.g., exclude capital except code-required; management fee capped at 3%"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Mgmt Fee Cap (%)</label>
                                    <Field
                                        name="management_fee_cap_percent"
                                        type="number"
                                        step="0.1"
                                        placeholder="3.0"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium mb-2">Capital Amortization Rules</label>
                                    <Field
                                        as="textarea"
                                        name="capital_amortization_rules"
                                        rows={2}
                                        placeholder="e.g., amortize code-required over useful life @6%"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Estimates */}
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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

                                {/* NNN annual estimate (client asked for a single annual estimate option) */}
                                {isNNN && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Estimated NNN (Annual $)</label>
                                        <Field
                                            name="nnn_est_annual"
                                            type="number"
                                            placeholder="e.g., 18,000"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Insurance & Risk Management — rows with only Coverage + Limit */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                    <h4 className="font-semibold">Insurance & Risk Management</h4>

                    {/* Header: Coverage | Limit */}
                    <div className="grid grid-cols-12 items-center text-xs font-semibold text-gray-600 p-3">
                        <div className="col-span-10">Coverage</div>
                        <div className="col-span-2 text-center">Limit</div>
                    </div>

                    <div className="rounded-lg border border-gray-200 divide-y divide-gray-200">
                        {INSURANCE_CATEGORIES.map(({ key, label, help, limitOptions }) => (
                            <InsuranceRow
                                key={key}
                                rowKey={key}
                                label={label}
                                help={help}
                                limitOptions={limitOptions}
                            />
                        ))}
                    </div>

                    <p className="mt-3 text-xs text-gray-500">
                        Choose required limits per coverage. Defaults match the client’s standards; customize as needed.
                    </p>
                </div>


                {/* Maintenance, Repairs & Alterations — unchanged logic */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-6">
                    <h4 className="font-semibold flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-orange-500" />
                        Maintenance, Repairs & Alterations
                    </h4>

                    <div className="mb-2 grid grid-cols-12 items-center text-xs font-semibold text-gray-600 p-4">
                        <div className="col-span-8">Category</div>
                        <div className="col-span-2 text-center">Landlord</div>
                        <div className="col-span-2 text-center">Tenant</div>
                    </div>

                    <div className="rounded-lg border border-gray-200">
                        {MAINTENANCE_CATEGORIES.map(({ key: rowKey, label }) => (
                            <MaintenanceRow rowKey={rowKey} label={label} />
                        ))}
                    </div>

                    <p className="mt-3 text-xs text-gray-500">Per category, only one party can be selected.</p>

                    <div className="flex flex-wrap gap-6">
                        <label className="flex items-center gap-3">
                            <Field type="checkbox" name="hvac_contract_required" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                            <span className="text-sm font-medium">HVAC Contract Required</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="border border-gray-300 rounded-lg p-6 space-y-6">
                <h4 className="font-semibold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Utilities & Services
                </h4>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Service Hours (Office)</label>
                        <Field
                            name="service_hours"
                            placeholder="e.g., Mon–Fri 8am–6pm"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Typical building services availability.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <label className="flex items-center gap-3">
                            <Field type="checkbox" name="vent_hood" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                            <span className="text-sm font-medium">Vent Hood (Restaurant Use)</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <Field type="checkbox" name="grease_trap" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                            <span className="text-sm font-medium">Grease Trap (Restaurant Use)</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Available Utilities</label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                        {["Electric", "Gas", "Water", "Sewer", "Internet", "Phone", "HVAC", "Security"].map((u) => (
                            <label key={u} className="flex items-center gap-2">
                                <Field type="checkbox" name="utilities" value={u} className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                                <span className="text-sm">{u}</span>
                            </label>
                        ))}
                    </div>
                </div>

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
    );
};
