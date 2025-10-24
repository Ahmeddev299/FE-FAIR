// components/dashboard/lease/steps/rightsOptions.tsx
import { Field } from "formik";
import { Clock, Info } from "lucide-react";

export const LeaseRightsOptionsStep = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold mb-4">Rights, Options & Conditions</h3>
    <p className="text-gray-600">Use rights, option terms, assignment, defaults, signage, and special conditions.</p>

    {/* Use, Hours & Exclusive Rights */}
    <div className="border border-gray-300 rounded-lg p-6 space-y-6">
      <h4 className="font-semibold flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-500" />
        Use, Hours & Exclusive Rights
      </h4>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Permitted Use *</label>
          <Field name="permitted_use" as="textarea" rows={2} placeholder="e.g., General office use" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Intended Use</label>
          <Field name="intended_use" as="textarea" rows={2} placeholder="Specific tenant use" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Prohibited Uses</label>
          <Field name="prohibited_uses" as="textarea" rows={2} placeholder="List prohibited activities" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Operating Hours</label>
          <Field name="operating_hours" placeholder="e.g., 9–9 daily" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Exclusive Use Protection</label>
        <Field name="exclusive_use_protection" as="textarea" rows={2} placeholder="Describe exclusive rights, if any" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Co-Tenancy Terms</label>
        <Field name="co_tenancy_terms" as="textarea" rows={2} placeholder="Specify co-tenancy conditions" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>

      <label className="flex items-center gap-3">
        <Field type="checkbox" name="go_dark_right" className="w-5 h-5" />
        <span className="text-sm font-medium">Go-Dark Right Permitted</span>
      </label>
    </div>

    {/* Options & Special Rights */}
    <div className="border border-gray-300 rounded-lg p-6 space-y-6">
      <h4 className="font-semibold">Options & Special Rights</h4>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Renewal Options (Count)</label>
          <Field name="renewal_options_count" type="number" placeholder="2" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Renewal Term (Years)</label>
          <Field name="renewal_years" type="number" placeholder="5" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <label className="flex items-center gap-3">
          <Field type="checkbox" name="include_renewal_option" className="w-5 h-5" />
          <span className="text-sm font-medium">Include Renewal Option</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <label className="flex items-center gap-3"><Field type="checkbox" name="rofo" className="w-5 h-5" /><span className="text-sm font-medium">ROFO</span></label>
        <label className="flex items-center gap-3"><Field type="checkbox" name="rofr" className="w-5 h-5" /><span className="text-sm font-medium">ROFR</span></label>
        <label className="flex items-center gap-3"><Field type="checkbox" name="purchase_option" className="w-5 h-5" /><span className="text-sm font-medium">Purchase Option</span></label>
        <label className="flex items-center gap-3"><Field type="checkbox" name="lease_to_purchase" className="w-5 h-5" /><span className="text-sm font-medium">Lease to Purchase</span></label>
      </div>
    </div>

    {/* Assignment & Subletting */}
    <div className="border border-gray-300 rounded-lg p-6 space-y-6">
      <h4 className="font-semibold">Assignment & Subletting</h4>

      <label className="flex items-center gap-3">
        <Field type="checkbox" name="consent_required" className="w-5 h-5" />
        <span className="text-sm font-medium">Landlord Consent Required</span>
      </label>

      <div>
        <label className="block text-sm font-medium mb-2">Permitted Transfers Without Consent</label>
        <Field name="permitted_transfers_without_consent" as="textarea" rows={2} placeholder="e.g., Affiliate transfer" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <label className="flex items-center gap-3">
          <Field type="checkbox" name="continued_liability_on_assignment" className="w-5 h-5" />
          <span className="text-sm font-medium">Continued Liability on Assignment</span>
        </label>
        <label className="flex items-center gap-3">
          <Field type="checkbox" name="recapture_right" className="w-5 h-5" />
          <span className="text-sm font-medium">Landlord Recapture Right</span>
        </label>
        <div>
          <label className="block text-sm font-medium mb-2">Profit Sharing Percent (%)</label>
          <Field name="profit_sharing_percent" type="number" step="0.1" placeholder="50.0" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
    </div>

    {/* Defaults & Remedies */}
    <div className="border border-gray-300 rounded-lg p-6 space-y-6">
      <h4 className="font-semibold">Defaults & Remedies</h4>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div><label className="block text-sm font-medium mb-2">Monetary Cure Period (Days)</label><Field name="monetary_cure_period_days" type="number" placeholder="5" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
        <div><label className="block text-sm font-medium mb-2">Non-Monetary Cure Period (Days)</label><Field name="non_monetary_cure_period_days" type="number" placeholder="10" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
        <div><label className="block text-sm font-medium mb-2">Late Fee Percent (%)</label><Field name="late_fee_percent" type="number" step="0.1" placeholder="5.0" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div><label className="block text-sm font-medium mb-2">Interest Rate APR (%)</label><Field name="interest_rate_apr" type="number" step="0.1" placeholder="12.0" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
        <label className="flex items-center gap-3"><Field type="checkbox" name="attorneys_fees_clause" className="w-5 h-5" /><span className="text-sm font-medium">Attorney’s Fees Clause</span></label>
      </div>
    </div>

    {/* Signage & Branding */}
    <div className="border border-gray-300 rounded-lg p-6 space-y-4">
      <h4 className="font-semibold">Signage & Branding</h4>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          ['building_signage','Building Signage'],
          ['monument_signage','Monument Signage'],
          ['pylon_signage','Pylon Signage'],
          ['facade_signage','Facade Signage'],
          ['window_decals_allowed','Window Decals Allowed'],
        ].map(([name,label]) => (
          <label key={name} className="flex items-center gap-3">
            <Field type="checkbox" name={name} className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Tenant Improvements */}
    <div className="border border-gray-300 rounded-lg p-6 space-y-6">
      <h4 className="font-semibold">Tenant Improvements</h4>

      <label className="flex items-center gap-3">
        <Field type="checkbox" name="improvement_allowance_enabled" className="w-5 h-5" />
        <span className="text-sm font-medium">Enable Improvement Allowance</span>
      </label>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div><label className="block text-sm font-medium mb-2">TIA Amount</label><Field name="tia_amount" type="number" placeholder="25000" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
        <div><label className="block text-sm font-medium mb-2">TIA per SF</label><Field name="tia_per_sf" type="number" placeholder="15" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
        <div><label className="block text-sm font-medium mb-2">Disbursement Method</label><Field name="disbursement_method" placeholder="e.g., Reimbursement after lien-free completion" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <label className="flex items-center gap-3"><Field type="checkbox" name="plans_approvals_required" className="w-5 h-5" /><span className="text-sm font-medium">Plans Approval Required</span></label>
        <div><label className="block text-sm font-medium mb-2">Outside Completion Date</label><Field name="outside_completion_date" type="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
      </div>
    </div>

    {/* Special Conditions */}
    <div className="border border-gray-300 rounded-lg p-6 space-y-6">
      <h4 className="font-semibold">Special Conditions</h4>
      <div>
        <label className="block text-sm font-medium mb-2">Special Conditions</label>
        <Field name="special_conditions" as="textarea" rows={3} placeholder="Any special conditions or notes" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Contingencies (comma-separated)</label>
        <Field name="contingencies" placeholder="e.g., Financing, Permits, Board approval" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
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
);
