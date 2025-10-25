import { ErrorMessage, Field } from "formik";
import { DollarSign, Shield, Wrench, Clock, Zap, Info } from "lucide-react";

// Step 4: Additional Terms
export const LeaseAdditionalTermsStep = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold mb-4">Additional Terms</h3>
    <p className="text-gray-600">Define operating expenses, insurance, maintenance, and usage terms.</p>

    {/* Operating Expenses / NNN */}
    <div className="border border-gray-300 rounded-lg p-6 space-y-6">
      <h4 className="font-semibold flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-green-500" />
        Operating Expenses / NNN Structure
      </h4>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Lease Structure *</label>
          <Field as="select" name="lease_structure" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">Select structure</option>
            <option value="Gross">Gross</option>
            <option value="Modified Gross">Modified Gross</option>
            <option value="Triple Net">Triple Net</option>
          </Field>
          <ErrorMessage name="lease_structure" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tenant Pro-Rata Share (%)</label>
          <Field name="tenant_pro_rata_share" type="number" step="0.01" placeholder="15.50" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Est. CAM per SF ($)</label>
          <Field name="est_cam_per_sf" type="number" step="0.01" placeholder="3.50" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Est. Taxes per SF ($)</label>
          <Field name="est_taxes_per_sf" type="number" step="0.01" placeholder="2.25" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Est. Insurance per SF ($)</label>
          <Field name="est_insurance_per_sf" type="number" step="0.01" placeholder="0.75" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Pass-Throughs</label>
        <Field name="pass_throughs" as="textarea" rows="2" placeholder="e.g., Real estate taxes, insurance, common area maintenance" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">CAM Include/Exclude</label>
        <Field name="cam_include_exclude" as="textarea" rows="2" placeholder="Specify inclusions and exclusions" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <Field type="checkbox" name="audit_right" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Audit Right</label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Audit Window (Months)</label>
          <Field name="audit_window_months" type="number" placeholder="12" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Audit Threshold (%)</label>
          <Field name="audit_threshold_percent" type="number" step="0.1" placeholder="5.0" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
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
        <div className="flex items-center gap-3">
          <Field type="checkbox" name="property_contents_coverage" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Property Contents Coverage Required</label>
        </div>

        <div className="flex items-center gap-3">
          <Field type="checkbox" name="waiver_of_subrogation" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Waiver of Subrogation</label>
        </div>
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
        <div className="flex items-center gap-3">
          <Field type="checkbox" name="hvac_contract_required" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">HVAC Contract Required</label>
        </div>

        <div className="flex items-center gap-3">
          <Field type="checkbox" name="alterations_consent_required" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Alterations Consent Required</label>
        </div>

        <div className="flex items-center gap-3">
          <Field type="checkbox" name="restoration_required_on_exit" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Restoration Required on Exit</label>
        </div>
      </div>
    </div>

    {/* Use, Hours & Exclusive Rights */}
    <div className="border border-gray-300 rounded-lg p-6 space-y-6">
      <h4 className="font-semibold flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-500" />
        Use, Hours & Exclusive Rights
      </h4>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Permitted Use *</label>
          <Field name="permitted_use" as="textarea" rows="2" placeholder="e.g., General office use" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          <ErrorMessage name="permitted_use" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Intended Use</label>
          <Field name="intended_use" as="textarea" rows="2" placeholder="Specific tenant use" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Prohibited Uses</label>
          <Field name="prohibited_uses" as="textarea" rows="2" placeholder="List prohibited activities" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Operating Hours</label>
          <Field name="operating_hours" placeholder="e.g., 9:00 AM - 9:00 PM, 7 days/week" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Exclusive Use Protection</label>
        <Field name="exclusive_use_protection" as="textarea" rows="2" placeholder="Describe exclusive rights, if any" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Co-Tenancy Terms</label>
        <Field name="co_tenancy_terms" as="textarea" rows="2" placeholder="Specify co-tenancy conditions" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="flex items-center gap-3">
        <Field type="checkbox" name="go_dark_right" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
        <label className="text-sm font-medium">Go-Dark Right Permitted</label>
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

        <div className="flex items-center gap-3">
          <Field type="checkbox" name="trash_grease_interceptor" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Trash/Grease Interceptor (Retail/Industrial)</label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Available Utilities</label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
          {['Electric', 'Gas', 'Water', 'Sewer', 'Internet', 'Phone', 'HVAC', 'Security'].map((utility) => (
            <div key={utility} className="flex items-center gap-2">
              <Field type="checkbox" name="utilities" value={utility} className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
              <label className="text-sm">{utility}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Responsibility</label>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-2">
            <Field type="checkbox" name="responsibility" value="Tenant" className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
            <label className="text-sm">Tenant</label>
          </div>
          <div className="flex items-center gap-2">
            <Field type="checkbox" name="responsibility" value="Landlord" className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
            <label className="text-sm">Landlord</label>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-blue-900">Operating Expenses</h4>
          <p className="text-sm text-blue-700 mt-1">
            Triple Net leases pass through all operating costs to the tenant. Modified Gross leases may cap certain expenses or set base year exclusions. Ensure CAM reconciliation procedures are clearly defined.
          </p>
        </div>
      </div>
    </div>

    {/* ---------------- NEW: Options & Special Rights ---------------- */}
    <div className="border border-gray-300 rounded-lg p-6 space-y-6">
      <h4 className="font-semibold">Options & Special Rights</h4>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Renewal Options (Count)</label>
          <Field name="renewal_options_count" type="number" placeholder="e.g., 2" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Renewal Term (Years)</label>
          <Field name="renewal_years" type="number" placeholder="e.g., 5" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-3">
          <Field type="checkbox" name="include_renewal_option" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Include Renewal Option</label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="flex items-center gap-3">
          <Field type="checkbox" name="rofo" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Right of First Offer (ROFO)</label>
        </div>
        <div className="flex items-center gap-3">
          <Field type="checkbox" name="rofr" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Right of First Refusal (ROFR)</label>
        </div>
        <div className="flex items-center gap-3">
          <Field type="checkbox" name="purchase_option" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Purchase Option</label>
        </div>
        <div className="flex items-center gap-3">
          <Field type="checkbox" name="lease_to_purchase" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Lease to Purchase</label>
        </div>
      </div>
    </div>

    {/* ---------------- NEW: Assignment & Subletting ---------------- */}
    <div className="border border-gray-300 rounded-lg p-6 space-y-6">
      <h4 className="font-semibold">Assignment & Subletting</h4>

      <div className="flex items-center gap-3">
        <Field type="checkbox" name="consent_required" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
        <label className="text-sm font-medium">Landlord Consent Required</label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Permitted Transfers Without Consent</label>
        <Field name="permitted_transfers_without_consent" as="textarea" rows={2} placeholder="e.g., Affiliate transfer, corporate reorganization" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <Field type="checkbox" name="continued_liability_on_assignment" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Continued Liability on Assignment</label>
        </div>

        <div className="flex items-center gap-3">
          <Field type="checkbox" name="recapture_right" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Landlord Recapture Right</label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Profit Sharing Percent (%)</label>
          <Field name="profit_sharing_percent" type="number" step="0.1" placeholder="e.g., 50.0" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
    </div>

    {/* ---------------- NEW: Defaults & Remedies ---------------- */}
    <div className="border border-gray-300 rounded-lg p-6 space-y-6">
      <h4 className="font-semibold">Defaults & Remedies</h4>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Monetary Cure Period (Days)</label>
          <Field name="monetary_cure_period_days" type="number" placeholder="e.g., 5" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Non-Monetary Cure Period (Days)</label>
          <Field name="non_monetary_cure_period_days" type="number" placeholder="e.g., 10" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Late Fee Percent (%)</label>
          <Field name="late_fee_percent" type="number" step="0.1" placeholder="e.g., 5.0" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Interest Rate APR (%)</label>
          <Field name="interest_rate_apr" type="number" step="0.1" placeholder="e.g., 12.0" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="flex items-center gap-3">
          <Field type="checkbox" name="attorneys_fees_clause" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Attorney’s Fees Clause</label>
        </div>
      </div>
    </div>

    {/* ---------------- NEW: Signage & Branding ---------------- */}
    <div className="border border-gray-300 rounded-lg p-6 space-y-6">
      <h4 className="font-semibold">Signage & Branding</h4>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <Field type="checkbox" name="building_signage" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Building Signage</label>
        </div>
        <div className="flex items-center gap-3">
          <Field type="checkbox" name="monument_signage" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Monument Signage</label>
        </div>
        <div className="flex items-center gap-3">
          <Field type="checkbox" name="pylon_signage" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Pylon Signage</label>
        </div>
        <div className="flex items-center gap-3">
          <Field type="checkbox" name="facade_signage" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Facade Signage</label>
        </div>
        <div className="flex items-center gap-3">
          <Field type="checkbox" name="window_decals_allowed" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Window Decals Allowed</label>
        </div>
      </div>
    </div>

    {/* ---------------- NEW: Tenant Improvements ---------------- */}
    <div className="border border-gray-300 rounded-lg p-6 space-y-6">
      <h4 className="font-semibold">Tenant Improvements</h4>

      <div className="flex items-center gap-3">
        <Field type="checkbox" name="improvement_allowance_enabled" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
        <label className="text-sm font-medium">Enable Improvement Allowance</label>
      </div>

      {/* Show TI fields always; you can conditionally show by reading formik context if you like */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">TIA Amount</label>
          <Field name="tia_amount" type="number" placeholder="e.g., 25000" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">TIA per SF</label>
          <Field name="tia_per_sf" type="number" placeholder="e.g., 15" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Disbursement Method</label>
          <Field name="disbursement_method" placeholder="e.g., Reimbursement upon lien-free completion" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <Field type="checkbox" name="plans_approvals_required" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-medium">Plans Approval Required</label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Outside Completion Date</label>
          <Field name="outside_completion_date" type="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
    </div>

    {/* ---------------- NEW: Special Conditions ---------------- */}
    <div className="border border-gray-300 rounded-lg p-6 space-y-6">
      <h4 className="font-semibold">Special Conditions</h4>

      <div>
        <label className="block text-sm font-medium mb-2">Special Conditions</label>
        <Field name="special_conditions" as="textarea" rows={3} placeholder="Any special conditions or notes" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Contingencies (comma-separated)</label>
        {/* Simple text input; map to array at submit if you prefer chips */}
        <Field
          name="contingencies"
          placeholder="e.g., Financing, Permits, Board approval"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    {/* Your existing blue info note */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-blue-900">Operating Expenses</h4>
          <p className="text-sm text-blue-700 mt-1">
            Triple Net leases pass through all operating costs to the tenant. Modified Gross leases may cap certain expenses or set base year exclusions. Ensure CAM reconciliation procedures are clearly defined.
          </p>
        </div>
      </div>
    </div>
  </div>
);