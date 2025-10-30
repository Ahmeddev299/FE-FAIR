// types/lease.ts - Clean LeaseFormValues with only used fields

export interface LeaseFormValues {
  // === STEP 1: BASIC INFORMATION ===
  title: string;
  addFileNumber: boolean;
  lease_type: string;
  
  // Party Quick-select IDs (from PartyDropdowns)
  landlordId: string;
  landlordName: string;
  landlordEmail: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  
  // Landlord Address (from PartyDropdowns)
  landlord_address_S1: string;
  landlord_address_S2: string;
  landlord_city: string;
  landlord_state: string;
  landlord_zip: string;
  
  // Tenant Address (from PartyDropdowns)
  tenant_address_S1: string;
  tenant_address_S2: string;
  tenant_city: string;
  tenant_state: string;
  tenant_zip: string;

  // === STEP 2: PREMISES & PROPERTY DETAILS ===
  // Property Address (from LeasePremisesStep)
  premisses_property_address_S1: string;
  premisses_property_address_S2: string;
  premisses_property_city: string;
  premisses_property_state: string;
  premisses_property_zip: string;
  
  // Space Details
  rentable_sf: number | string;
  property_size: string;
  
  // Outdoor Space
  hasExtraSpace: boolean;
  outdoor_size: number | string;
  
  // Parking
  exclusive_parking_spaces: boolean;
  exclusive_parking_spaces_count: number | string;

  // === STEP 3: TERM, TIMING & TRIGGERS ===
  initial_term_years: number | string;
  delivery_condition: string;
  commencement_trigger: string;
  commencement_date_certain: string;
  rent_commencement_offset_days: number | string;

  // === STEP 4: RENT & ECONOMICS ===
  rent_type: string; // "Fixed" | "Percentage"
  monthly_rent: number | string;
  security_deposit: number | string;
  prepaid_rent: number | string;
  percentage_lease_percent: number | string;
  
  // Base Rent Schedule
  schedule_basis: string; // "Monthly" | "$/SF/yr"
  base_rent_schedule_rows: Array<{
    period: string;
    monthly_rent: number | string;
    rate_per_sf_year: number | string;
  }>;

  // === STEP 5: OPERATIONS & MAINTENANCE ===
  lease_structure: string;
  
  // Pass-Through (only for Modified Gross / Triple Net)
  cam_include_exclude: string;
  management_fee_cap_percent: number | string;
  capital_amortization_rules: string;
  
  // Disclosure Estimates
  est_cam_per_sf: number | string;
  est_taxes_per_sf: number | string;
  est_insurance_per_sf: number | string;
  nnn_est_annual: number | string; // Triple Net only
  
  // Insurance & Risk - Coverage rows with only Party + Limit
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
  
  // Utilities & Services
  service_hours: string;
  vent_hood: boolean;
  grease_trap: boolean;
  utilities: string[]; // Array of selected utilities
  utility_responsibility: string;

  // === STEP 6: RIGHTS, OPTIONS & CONDITIONS ===
  // Use, Hours & Exclusives
  permitted_use: string;
  prohibited_custom: boolean;
  prohibited_uses: string;
  operating_hours: string;
  exclusive_requested: string;
  exclusive_description: string;
  
  // Co-tenancy
  cotenancy_applicable: boolean;
  cotenancy_opening: string;
  cotenancy_ongoing: string;
  cotenancy_remedies: string;
  
  // Options & Special Rights
  rentEscalationType: "percent" | "fmv";
  rentEscalationPercent: number | string;
  includeRenewalOption: boolean;
  renewalOptionsCount: number | string;
  renewalYears: number | string;
  
  // ROFR (ROFO removed) / LTP
  rofr_yes: string;
  rofr_scope: string;
  ltp_yes: string;
  ltp_terms_window_days: number | string;
  ltp_notes: string;
  
  // Subordination / SNDA / Estoppel
  subordination_automatic: string;
  non_disturbance_required: string;
  nondisturbance_condition: string;
  estoppel_delivery_days: number | string;
  
  // Exhibits
  exhibits: Array<{
    title: string;
    notes?: string;
    file?: File | null;
    previewUrl?: string;
  }>;
  
  // Final Admin
  confidentiality_required: boolean;
}

// === INITIAL VALUES ===
export const LEASE_INITIAL_VALUES: LeaseFormValues = {
  // STEP 1
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

  // STEP 2a
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
  exclusive_parking_spaces_count: "",

  // STEP 3
  initial_term_years: "",
  delivery_condition: "",
  commencement_trigger: "",
  commencement_date_certain: "",
  rent_commencement_offset_days: "",

  // STEP 4
  rent_type: "",
  monthly_rent: "",
  security_deposit: "",
  prepaid_rent: "",
  percentage_lease_percent: "",
  schedule_basis: "Monthly",
  base_rent_schedule_rows: [],

  // STEP 5
  lease_structure: "",
  cam_include_exclude: "",
  management_fee_cap_percent: "",
  capital_amortization_rules: "",
  est_cam_per_sf: "",
  est_taxes_per_sf: "",
  est_insurance_per_sf: "",
  nnn_est_annual: "",
  
  // Insurance
  insurance_party_cgl: "",
  insurance_limit_cgl: "",
  insurance_party_workers_comp: "",
  insurance_limit_workers_comp: "",
  insurance_party_liquor_liability: "",
  insurance_limit_liquor_liability: "",
  
  // Maintenance (radio groups)
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

  // STEP 6
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