/* ---------------- Types ---------------- */
export interface ClauseComment {
  author?: string;
  text: string;
  resolved?: boolean;
  created_at?: string;
}

export interface Clause {
  id?: string;
  title?: string;
  name?: string;             // <== used as clause_key with API
  category?: string;
  clause_details?: string;   // original clause text
  status?: string;           // pending | approved | rejected
  risk?: string;             // High | Medium | Low
  ai_confidence_score?: number;
  ai_suggested_clause_details?: string;
  comments?: ClauseComment[];
  comment?: ClauseComment[]; // some payloads use "comment"
  current_version?: string;
  updated_at?: string | number | Date;
}

export interface LeaseData {
  _id?: string;
  id?: string;
  title?: string;
  lease_title?: string;
  propertyAddress?: string;
  property_address?: string;
  leaseType?: string;
  submitStatus?: string;
  submit_status?: string;
  squareFootage?: number;
  termDisplay?: string;
  startDate?: string | number | Date;
  endDate?: string | number | Date;
  rentAmount?: string;
  securityDeposit?: string;
  BASIC_INFORMATION?: {
    landlord_legal_name?: string;
    landlord_notice_email?: string;
    tenant_legal_name?: string;
    tenant_notice_email?: string;
    lease_type?: string;
    party_posture?: string;
    title?: string;
  };
  PREMISES_PROPERTY_DETAILS?: {
    property_address_line1?: string;
    property_address_line2?: string;
    property_city?: string;
    property_state?: string;
    property_zip?: number;
    rentable_sf?: number;
    property_size?: number;
  };
  TERM_TIMING_TRIGGERS?: {
    initial_term_years?: number;
    commencement_date_certain?: string;
  };
  template_data?: {
    header?: {
      landlord_name?: string;
      tenant_name?: string;
    };
    premises?: {
      square_footage?: string;
      street_address?: string;
      city_state_zip?: string;
    };
    lease_terms?: {
      base_rent_monthly?: string;
      term_display?: string;
      rent_commencement_date?: string;
      termination_date?: string;
      security_deposit?: string;
    };
    clauses?: {
      data?: {
        [category: string]: {
          [key: string]: string;
        };
      };
    };
  };
  clauses?: Record<string, Clause> | Clause[];
}

export interface LeaseFormValues {
  title: string;
  addFileNumber: boolean;
  lease_type: string;

  landlordId: string;
  landlordName: string;
  landlordEmail: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;

  landlord_address_S1: string;
  landlord_address_S2: string;
  landlord_city: string;
  landlord_state: string;
  landlord_zip: string;
  audit_right: boolean;
  tenant_address_S1: string;
  tenant_address_S2: string;
  tenant_city: string;
  tenant_state: string;
  tenant_zip: string;

  premisses_property_address_S1: string;
  premisses_property_address_S2: string;
  premisses_property_city: string;
  premisses_property_state: string;
  premisses_property_zip: string;

  rentable_sf: number | string;
  property_size: string;

  hasExtraSpace: boolean;
  outdoor_size: number | string;

  exclusive_parking_spaces: boolean;
  reserved_spaces: number | string;

  initial_term_years: number | string;
  delivery_condition: string;
  commencement_trigger: string;
  commencement_date_certain: string;
  rent_commencement_offset_days: number | string;

  rent_type: string; 
  monthly_rent: number | string;
  security_deposit: number | string;
  prepaid_rent: number | string;
  percentage_lease_percent: number | string;

  schedule_basis: string; 
  base_rent_schedule_rows: Array<{
    period: string;
    monthly_rent: number | string;
    rate_per_sf_year: number | string;
  }>;

  lease_structure: string;
  gross_estimate_amount: number;

  cam_include_exclude: string;
  management_fee_cap_percent: number | string;
  capital_amortization_rules: string;

  est_cam_per_sf: number | string;
  est_taxes_per_sf: number | string;
  est_insurance_per_sf: number | string;
  nnn_est_annual: number | string; 

  insurance_party_cgl: string;
  insurance_limit_cgl: string;
  insurance_party_workers_comp: string;
  insurance_limit_workers_comp: string;
  insurance_party_liquor_liability: string;
  insurance_limit_liquor_liability: string;

  // Maintenance - Radio buttons (mutually exclusive per category)
  maintenance_structural: "landlord" | "tenant" | "";
  maintenance_non_structural: "landlord" | "tenant" | "";
  maintenance_hvac: "landlord" | "tenant" | "";
  maintenance_plumbing: "landlord" | "tenant" | "";
  maintenance_electrical: "landlord" | "tenant" | "";
  maintenance_common_areas: "landlord" | "tenant" | "";
  maintenance_utilities: "landlord" | "tenant" | "";
  maintenance_special_equipment: "landlord" | "tenant" | "";

  hvac_contract_required: boolean;

  service_hours: string;
  vent_hood: boolean;
  grease_trap: boolean;
  utilities: string[]; 
  utility_responsibility: string;

  permitted_use: string;
  prohibited_custom: boolean;
  prohibited_uses: string;
  operating_hours: string;
  exclusive_requested: string;
  exclusive_description: string;

  cotenancy_applicable: boolean;
  cotenancy_opening: string;
  cotenancy_ongoing: string;
  cotenancy_remedies: string;

  rentEscalationType: "percent" | "fmv";
  rentEscalationPercent: number | string;
  includeRenewalOption: boolean;
  renewalOptionsCount: number | string;
  renewalYears: number | string;

  rofr_yes: string;
  rofr_scope: string;
  ltp_yes: string;
  ltp_terms_window_days: number | string;
  ltp_notes: string;

  subordination_automatic: string;
  non_disturbance_required: string;
  nondisturbance_condition: string;
  estoppel_delivery_days: number | string;

  exhibits: Array<{
    title: string;
    notes?: string;
    file?: File | null;
    previewUrl?: string;
  }>;

  confidentiality_required: boolean;
}

export const LEASE_INITIAL_VALUES: LeaseFormValues = {
  title: "",
  addFileNumber: false,
  lease_type: "",
  landlordId: "",
  landlordName: "",
  landlordEmail: "",
  tenantId: "",
  tenantName: "",
  tenantEmail: "",
  landlord_address_S1: "",
  landlord_address_S2: "",
  landlord_city: "",
  landlord_state: "",
  landlord_zip: "",
  tenant_address_S1: "",
  tenant_address_S2: "",
  tenant_city: "",
  tenant_state: "",
  tenant_zip: "",

  premisses_property_address_S1: "",
  premisses_property_address_S2: "",
  premisses_property_city: "",
  premisses_property_state: "",
  premisses_property_zip: "",
  rentable_sf: "",
  property_size: "",
  hasExtraSpace: false,
  outdoor_size: "",
  exclusive_parking_spaces: false,
  reserved_spaces: "",

  initial_term_years: "",
  delivery_condition: "",
  commencement_trigger: "",
  commencement_date_certain: "",
  rent_commencement_offset_days: "",

  rent_type: "",
  monthly_rent: "",
  security_deposit: "",
  prepaid_rent: "",
  percentage_lease_percent: "",
  schedule_basis: "Monthly",
  base_rent_schedule_rows: [],

  lease_structure: "",
  gross_estimate_amount: 0,
  cam_include_exclude: "",
  management_fee_cap_percent: "",
  capital_amortization_rules: "",
  est_cam_per_sf: "",
  est_taxes_per_sf: "",
  est_insurance_per_sf: "",
  nnn_est_annual: "",
  audit_right: false,

  insurance_party_cgl: "",
  insurance_limit_cgl: "",
  insurance_party_workers_comp: "",
  insurance_limit_workers_comp: "",
  insurance_party_liquor_liability: "",
  insurance_limit_liquor_liability: "",

  maintenance_structural: "",
  maintenance_non_structural: "",
  maintenance_hvac: "",
  maintenance_plumbing: "",
  maintenance_electrical: "",
  maintenance_common_areas: "",
  maintenance_utilities: "",
  maintenance_special_equipment: "",

  hvac_contract_required: false,
  service_hours: "",
  vent_hood: false,
  grease_trap: false,
  utilities: [],
  utility_responsibility: "",

  permitted_use: "",
  prohibited_custom: false,
  prohibited_uses: "",
  operating_hours: "",
  exclusive_requested: "",
  exclusive_description: "",
  cotenancy_applicable: false,
  cotenancy_opening: "",
  cotenancy_ongoing: "",
  cotenancy_remedies: "",
  rentEscalationType: "percent",
  rentEscalationPercent: "",
  includeRenewalOption: false,
  renewalOptionsCount: "",
  renewalYears: "",
  rofr_yes: "",
  rofr_scope: "",
  ltp_yes: "",
  ltp_terms_window_days: "",
  ltp_notes: "",
  subordination_automatic: "",
  non_disturbance_required: "",
  nondisturbance_condition: "",
  estoppel_delivery_days: "",
  exhibits: [],
  confidentiality_required: false,
};