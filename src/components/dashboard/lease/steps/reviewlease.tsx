/* eslint-disable @typescript-eslint/no-explicit-any */

import { LeaseFormValues } from "@/types/lease";
import { CheckCircle, Edit, AlertCircle } from "lucide-react";

interface LeaseReviewSubmitStepProps {
  values: LeaseFormValues;
  onEdit: (step: number) => void;
}

// small pretty-printer
const hasVal = (v: any) => !(v === null || v === undefined || v === "");
const fmtMoney = (v: any) => (hasVal(v) ? `$${v}` : "");
const fmtPct = (v: any) => (hasVal(v) ? `${v}%` : "");
const fmtBool = (v?: boolean) => (v === undefined ? "" : v ? "Yes" : "No");

const Section = ({
  title,
  data,
  stepNumber,
  onEdit,
}: {
  title: string;
  data: Record<string, any>;
  stepNumber: number;
  onEdit: (step: number) => void;
}) => {
  // hide empty sections
  const anyVisible = Object.values(data).some((v) =>
    Array.isArray(v) ? v.length > 0 : hasVal(v)
  );
  if (!anyVisible) return null;

  return (
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
        {Object.entries(data).map(([label, value]) => {
          if (!Array.isArray(value) && !hasVal(value)) return null;
          const display =
            typeof value === "boolean"
              ? fmtBool(value)
              : Array.isArray(value)
              ? value.join(", ")
              : String(value);
          if (!hasVal(display)) return null;

          return (
            <div key={label} className="space-y-1">
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-sm font-medium text-gray-900">{display}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Step 7: Review & Submit
export const LeaseReviewSubmitStep: React.FC<LeaseReviewSubmitStepProps> = ({
  values,
  onEdit,
}) => {
  // Insurance quick view rows
  const insuranceRows = [
    {
      label: "Commercial General Liability (CGL)",
      party: values.insurance_party_cgl,
      limit: values.insurance_limit_cgl,
    },
    {
      label: "Workers' Compensation",
      party: values.insurance_party_workers_comp,
      limit: values.insurance_limit_workers_comp,
    },
    {
      label: "Liquor Liability",
      party: values.insurance_party_liquor_liability,
      limit: values.insurance_limit_liquor_liability,
    },
  ].filter((r) => hasVal(r.party) || hasVal(r.limit));

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900">Review Your Lease</h3>
            <p className="text-sm text-blue-700 mt-1">
              Please review all information carefully before submitting. You can
              edit any section by clicking the Edit button.
            </p>
          </div>
        </div>
      </div>

      {/* 1) Basic Information */}
      <Section
        title="Basic Information"
        stepNumber={1}
        onEdit={onEdit}
        data={{
          "Lease Type": values.lease_type,
          "Landlord": values.landlordName,
          "Landlord Email": values.landlordEmail,
          "Tenant": values.tenantName,
          "Tenant Email": values.tenantEmail,
        }}
      />

      {/* 2) Premises & Property */}
      <Section
        title="Premises & Property"
        stepNumber={2}
        onEdit={onEdit}
        data={{
          "Property Address": [
            values.premisses_property_address_S1,
            values.premisses_property_address_S2,
            `${values.premisses_property_city}, ${values.premisses_property_state} ${values.premisses_property_zip}`,
          ].filter(Boolean).join(", "),
          "Rentable SF": values.rentable_sf,
          "Total Property Size": values.property_size,
          "Outdoor Space": fmtBool(values.hasExtraSpace),
          "Outdoor Space Size (sq ft)": values.hasExtraSpace ? values.outdoor_size : "",
          "Exclusive Parking": fmtBool(values.exclusive_parking_spaces),
          "Exclusive Parking Count": values.exclusive_parking_spaces ? values.exclusive_parking_spaces_count : "",
        }}
      />

      {/* 3) Term & Timing */}
      <Section
        title="Term, Timing & Triggers"
        stepNumber={3}
        onEdit={onEdit}
        data={{
          "Initial Term (Years)": values.initial_term_years,
          "Delivery Condition": values.delivery_condition,
          "Commencement Trigger": values.commencement_trigger,
          "Commencement Date (Certain)": values.commencement_trigger === "Date certain" 
            ? values.commencement_date_certain 
            : "",
          "Rent Commencement Offset (Days)": values.rent_commencement_offset_days,
        }}
      />

      {/* 4) Rent & Economics */}
      <Section
        title="Rent & Economics"
        stepNumber={4}
        onEdit={onEdit}
        data={{
          "Rent Type": values.rent_type,
          "Monthly Base Rent": values.rent_type !== "Percentage" ? fmtMoney(values.monthly_rent) : "",
          "Percentage Rent (%)": values.rent_type === "Percentage" ? fmtPct(values.percentage_lease_percent) : "",
          "Security Deposit": fmtMoney(values.security_deposit),
          "Prepaid Rent": fmtMoney(values.prepaid_rent),
          "Schedule Basis": values.schedule_basis,
          "Schedule Periods": values.base_rent_schedule_rows.length > 0 
            ? values.base_rent_schedule_rows.map(r => r.period).join(", ")
            : "",
        }}
      />

      {/* 5) Operations, Maintenance & Insurance */}
      <Section
        title="Operations, Maintenance & Insurance"
        stepNumber={5}
        onEdit={onEdit}
        data={{
          "Lease Structure": values.lease_structure,
          "CAM Include/Exclude": ["Modified Gross", "Triple Net"].includes(values.lease_structure) 
            ? values.cam_include_exclude 
            : "",
          "Mgmt Fee Cap (%)": ["Modified Gross", "Triple Net"].includes(values.lease_structure)
            ? fmtPct(values.management_fee_cap_percent)
            : "",
          "Est. CAM per SF": ["Modified Gross", "Triple Net"].includes(values.lease_structure)
            ? fmtMoney(values.est_cam_per_sf)
            : "",
          "Est. Taxes per SF": ["Modified Gross", "Triple Net"].includes(values.lease_structure)
            ? fmtMoney(values.est_taxes_per_sf)
            : "",
          "Est. Insurance per SF": ["Modified Gross", "Triple Net"].includes(values.lease_structure)
            ? fmtMoney(values.est_insurance_per_sf)
            : "",
          "Estimated NNN (Annual)": values.lease_structure === "Triple Net"
            ? fmtMoney(values.nnn_est_annual)
            : "",
          "HVAC Contract Required": fmtBool(values.hvac_contract_required),
          "Service Hours": values.service_hours,
          "Vent Hood": fmtBool(values.vent_hood),
          "Grease Trap": fmtBool(values.grease_trap),
          "Utilities": values.utilities.length > 0 ? values.utilities.join(", ") : "",
          "Utility Responsibility": values.utility_responsibility,
        }}
      />

      {/* Insurance quick summary */}
      {insuranceRows.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-6 -mt-4">
          <h5 className="font-medium mb-3">Insurance Summary</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {insuranceRows.map((r) => (
              <div key={r.label} className="text-sm">
                <div className="text-gray-500">{r.label}</div>
                <div className="font-medium text-gray-900">
                  {r.party || "-"}{r.party && r.limit ? " — " : ""}{r.limit || ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maintenance Summary */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h5 className="font-medium mb-3">Maintenance Responsibilities</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {[
            { label: "Structural", value: values.maintenance_structural },
            { label: "Non-Structural", value: values.maintenance_non_structural },
            { label: "HVAC", value: values.maintenance_hvac },
            { label: "Plumbing", value: values.maintenance_plumbing },
            { label: "Electrical", value: values.maintenance_electrical },
            { label: "Common Areas", value: values.maintenance_common_areas },
            { label: "Utilities", value: values.maintenance_utilities },
            { label: "Special Equipment", value: values.maintenance_special_equipment },
          ].filter(m => hasVal(m.value)).map((m) => (
            <div key={m.label}>
              <span className="text-gray-500">{m.label}: </span>
              <span className="font-medium capitalize">{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6) Rights, Options & Conditions */}
      <Section
        title="Rights, Options & Conditions"
        stepNumber={6}
        onEdit={onEdit}
        data={{
          "Permitted Use": values.permitted_use,
          "Prohibited Uses (Custom)": values.prohibited_custom ? values.prohibited_uses : "",
          "Operating Hours": values.operating_hours,
          "Exclusive Use Requested": values.exclusive_requested,
          "Exclusive Description": values.exclusive_requested === "Yes" ? values.exclusive_description : "",
          
          "Co-tenancy Applies": fmtBool(values.cotenancy_applicable),
          "Opening Co-tenancy": values.cotenancy_applicable ? values.cotenancy_opening : "",
          "Ongoing Co-tenancy": values.cotenancy_applicable ? values.cotenancy_ongoing : "",
          "Co-tenancy Remedies": values.cotenancy_applicable ? values.cotenancy_remedies : "",
          
          "Renewal Escalation Type": values.rentEscalationType === "fmv" ? "FMV" : "Percent",
          "Escalation % (If Percent)": values.rentEscalationType === "percent"
            ? fmtPct(values.rentEscalationPercent)
            : "",
          
          "Include Renewal Option": fmtBool(values.includeRenewalOption),
          "Renewal Options Count": values.includeRenewalOption ? values.renewalOptionsCount : "",
          "Renewal Years Each": values.includeRenewalOption ? values.renewalYears : "",
          
          "Right of First Refusal": values.rofr_yes,
          "ROFR Scope": values.rofr_yes === "Yes" ? values.rofr_scope : "",
          
          "Lease-to-Purchase": values.ltp_yes,
          "LTP Terms Window (Days)": values.ltp_yes === "Yes" ? values.ltp_terms_window_days : "",
          "LTP Notes": values.ltp_yes === "Yes" ? values.ltp_notes : "",
          
          "Subordination (Automatic)": values.subordination_automatic,
          "Non-Disturbance Required": values.non_disturbance_required,
          "NDS Condition": values.non_disturbance_required === "Yes" ? values.nondisturbance_condition : "",
          "Estoppel Delivery (Days)": values.estoppel_delivery_days,
        }}
      />

      {/* Exhibits */}
      {values.exhibits.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-6">
          <h5 className="font-medium mb-3">Exhibits</h5>
          <div className="space-y-2">
            {values.exhibits.map((ex, i) => (
              <div key={i} className="text-sm">
                <span className="font-medium">{ex.title}</span>
                {ex.notes && <span className="text-gray-500"> — {ex.notes}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

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
              Once submitted, this lease will be available in your dashboard.
              You can continue to edit it until it is finalized.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};