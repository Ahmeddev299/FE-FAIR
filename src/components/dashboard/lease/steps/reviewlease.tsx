/* eslint-disable @typescript-eslint/no-explicit-any */

import { LeaseFormValues } from "@/types/lease";
import { CheckCircle, Edit, AlertCircle } from "lucide-react";

interface LeaseReviewSubmitStepProps {
  values: LeaseFormValues;
  onEdit: (step: number) => void;
}

// Step 5: Review & Submit
export const LeaseReviewSubmitStep: React.FC<LeaseReviewSubmitStepProps> = ({ values, onEdit }) => {
  const renderSection = (title: string, data: Record<string, any>, stepNumber: number) => (
    <div className="border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-lg">{title}</h4>
        <button
          type="button"
          onClick={() => onEdit(stepNumber)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(data).map(([key, value]) => {
          if (value === null || value === undefined || value === '') return null;
          
          const displayValue = typeof value === 'boolean' 
            ? (value ? 'Yes' : 'No')
            : Array.isArray(value)
            ? value.join(', ')
            : String(value);

          return (
            <div key={key} className="space-y-1">
              <p className="text-sm text-gray-500 capitalize">{key.replace(/_/g, ' ')}</p>
              <p className="text-sm font-medium text-gray-900">{displayValue}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900">Review Your Lease</h3>
            <p className="text-sm text-blue-700 mt-1">
              Please review all information carefully before submitting. You can edit any section by clicking the Edit button.
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      {renderSection('Basic Information', {
        'Party Posture': values.party_posture,
        'Lease Type': values.lease_type,
        'Governing State': values.governing_law_state,
        'Governing County': values.governing_law_county,
        'Landlord Name': values.landlord_legal_name,
        'Landlord Email': values.landlord_notice_email,
        'Tenant Name': values.tenant_legal_name,
        'Tenant Email': values.tenant_notice_email,
      }, 1)}

      {/* Premises & Property */}
      {renderSection('Premises & Property', {
        'Street Address': values.street_address,
        'Suite/Floor': values.suite_or_floor,
        'Rentable SF': values.rentable_sf,
        'Project Name': values.project_name,
        'Property Size': values.property_size,
        'Parking Ratio': values.parking_ratio,
        'Exclusive Parking': values.exclusive_parking_spaces,
        'Unreserved Spaces': values.unreserved_spaces,
        'Reserved Spaces': values.reserved_spaces,
        'Loading Dock': values.loading_dock_use,
      }, 2)}

      {/* Term & Rent */}
      {renderSection('Term & Rent', {
        'Initial Term (Years)': values.initial_term_years,
        'Lease Duration (Months)': values.lease_duration,
        'Start Date': values.start_date,
        'Rent Start Date': values.rent_start_date,
        'Monthly Rent': values.monthly_rent ? `$${values.monthly_rent}` : '',
        'Security Deposit': values.security_deposit ? `$${values.security_deposit}` : '',
        'Prepaid Rent': values.prepaid_rent ? `$${values.prepaid_rent}` : '',
        'Escalation Type': values.annual_escalation_type,
        'Escalation Percent': values.annual_escalation_percent ? `${values.annual_escalation_percent}%` : '',
        'Delivery Condition': values.delivery_condition,
      }, 3)}

      {/* Additional Terms */}
      {renderSection('Additional Terms', {
        'Lease Structure': values.lease_structure,
        'Tenant Pro-Rata Share': values.tenant_pro_rata_share ? `${values.tenant_pro_rata_share}%` : '',
        'Est. CAM per SF': values.est_cam_per_sf ? `$${values.est_cam_per_sf}` : '',
        'Est. Taxes per SF': values.est_taxes_per_sf ? `$${values.est_taxes_per_sf}` : '',
        'Tenant GL Coverage': values.tenant_gl_coverage,
        'HVAC Contract Required': values.hvac_contract_required,
        'Alterations Consent Required': values.alterations_consent_required,
        'Permitted Use': values.permitted_use,
        'Operating Hours': values.operating_hours,
        'Utilities': values.utilities,
      }, 4)}

      {/* Options & Special Rights */}
      {/* {renderSection('Options & Special Rights', {
        'Renewal Options': values.renewal_options_count,
        'Renewal Years': values.renewal_years,
        'Include Renewal Option': values.include_renewal_option,
        'Right of First Offer': values.rofo,
        'Right of First Refusal': values.rofr,
        'Purchase Option': values.purchase_option,
        'Lease to Purchase': values.lease_to_purchase,
      }, 4)} */}

      {/* Assignment & Subletting */}
      {renderSection('Assignment & Subletting', {
        'Consent Required': values.consent_required,
        'Permitted Transfers Without Consent': values.permitted_transfers_without_consent,
        'Continued Liability': values.continued_liability_on_assignment,
        'Recapture Right': values.recapture_right,
        'Profit Sharing Percent': values.profit_sharing_percent ? `${values.profit_sharing_percent}%` : '',
      }, 4)}

      {/* Defaults & Remedies */}
      {renderSection('Defaults & Remedies', {
        'Monetary Cure Period (Days)': values.monetary_cure_period_days,
        'Non-Monetary Cure Period (Days)': values.non_monetary_cure_period_days,
        'Late Fee Percent': values.late_fee_percent ? `${values.late_fee_percent}%` : '',
        'Interest Rate APR': values.interest_rate_apr ? `${values.interest_rate_apr}%` : '',
        'Attorney Fees Clause': values.attorneys_fees_clause,
      }, 4)}

      {/* Signage & Branding */}
      {renderSection('Signage & Branding', {
        'Building Signage': values.building_signage,
        'Monument Signage': values.monument_signage,
        'Pylon Signage': values.pylon_signage,
        'Facade Signage': values.facade_signage,
        'Window Decals Allowed': values.window_decals_allowed,
      }, 4)}

      {/* Tenant Improvements */}
      {values.improvement_allowance_enabled && renderSection('Tenant Improvements', {
        'TIA Amount': values.tia_amount ? `${values.tia_amount}` : '',
        'TIA per SF': values.tia_per_sf ? `${values.tia_per_sf}` : '',
        'Disbursement Method': values.disbursement_method,
        'Plans Approval Required': values.plans_approvals_required,
        'Outside Completion Date': values.outside_completion_date,
      }, 4)}

      {/* Special Conditions */}
      {(values.special_conditions || values.contingencies) && renderSection('Special Conditions', {
        'Special Conditions': values.special_conditions,
        'Contingencies': values.contingencies,
      }, 4)}

      {/* Final Confirmation */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-yellow-900">Before You Submit</h4>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1 list-disc list-inside">
              <li>All required fields have been completed</li>
              <li>All dates and financial terms are accurate</li>
              <li>Party information is correct</li>
              <li>All special conditions have been noted</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-900">Ready to Submit</h4>
            <p className="text-sm text-green-700 mt-1">
              Once submitted, this lease will be available in your dashboard. You can continue to edit it until it is finalized.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};