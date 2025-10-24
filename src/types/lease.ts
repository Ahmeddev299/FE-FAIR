// types/lease.ts

// ========================================
// Nested Types
// ========================================

export interface Guarantor {
  name: string;
  address: string;
}

export interface Broker {
  name: string;
  firm: string;
  email: string;
  role: 'Landlord' | 'Tenant';
  commission: string;
}

export interface RenewalOption {
  term_years: number;
  rent_increase_percent?: number;
  rent_increase_type?: 'Fixed' | 'CPI' | 'Fair Market Value';
}

export interface MaintenanceResponsibility {
  roof?: string;
  structure?: string;
  parking?: string;
  hvac?: string;
  plumbing?: string;
  electrical?: string;
  common_areas?: string;
}

// ========================================
// Main Lease Form Values Type
// ========================================

export interface LeaseFormValues {
  // 1. Deal Posture & Basics
  party_posture: 'Landlord-favored' | 'Tenant-favored' | 'Neutral' | '';
  lease_type: 'Retail' | 'Office' | 'Industrial' | '';
  governing_law_state: string;
  governing_law_county: string;

  // 2. Parties & Signature Blocks
  landlord_legal_name: string;
  landlord_state_of_formation: string;
  landlord_notice_address: string;
  landlord_notice_email: string;
  landlord_city: string;
  landlord_zip: number | '';

  tenant_legal_name: string;
  tenant_state_of_formation: string;
  tenant_notice_address: string;
  tenant_notice_email: string;
  tenant_city: string;
  tenant_zip: number | '';
  dba_name: string;

  guarantors: Guarantor[];
  brokers: Broker[];

  // 3. Premises & Project
  street_address: string;
  suite_or_floor: string;
  rentable_sf: number | '';
  project_name: string;
  load_factor: string;
  exclusive_parking_spaces: boolean;
  parking_ratio: string;
  common_area_rights: string;
  property_size: string;
  patio: string;
  patio_size: number | '';

  // 4. Term, Timing & Triggers
  initial_term_years: number | '';
  delivery_condition: string;
  commencement_trigger: string;
  commencement_date_certain: string;
  rent_commencement_offset_days: number | '';
  outside_opening_deadline_days: number | '';
  holdover_rent_multiplier: string;
  lease_duration: number | '';
  start_date: string;
  rent_start_date: string;

  // 5. Base Rent & Economics
  base_rent_schedule: number | '';
  monthly_rent: number | '';
  security_deposit: number | '';
  prepaid_rent: number | '';
  free_rent_month_list: string[];
  annual_escalation_type: 'Fixed' | 'CPI' | 'None' | '';
  annual_escalation_percent: number | '';
  cpi_floor: number | '';
  cpi_ceiling: number | '';
  rent_escalation: number | string;
  rent_escalation_percent: number | '';
  rent_start_mode: string;
  percentage_lease_percent: number | '';

  // 6. Operating Expenses / NNN
  lease_structure: 'Gross' | 'Modified Gross' | 'Triple Net' | '';
  pass_throughs: string;
  cam_include_exclude: string;
  est_cam_per_sf: number | '';
  est_taxes_per_sf: number | '';
  est_insurance_per_sf: number | '';
  tenant_pro_rata_share: number | '';
  audit_right: boolean;
  audit_window_months: number | '';
  audit_threshold_percent: number | '';

  // 7. Utilities & Services
  responsibility: string[];
  service_hours: number | '';
  trash_grease_interceptor: boolean;
  utilities: string[];

  // 8. Insurance & Risk
  tenant_gl_coverage: string;
  property_contents_coverage: boolean;
  waiver_of_subrogation: boolean;
  indemnity_type: 'Mutual' | 'Landlord-favored' | '';

  // 9. Maintenance, Repairs & Alterations
  hvac_contract_required: boolean;
  alterations_consent_required: boolean;
  cosmetic_threshold_usd: number | '';
  restoration_required_on_exit: boolean;
  maintenance: MaintenanceResponsibility;

  // 10. Use, Hours, Exclusives
  permitted_use: string;
  intended_use: string;
  prohibited_uses: string;
  operating_hours: string;
  go_dark_right: boolean;
  exclusive_use_protection: string;
  co_tenancy_terms: string;

  // 11. Options & Special Rights
  renewal_options: RenewalOption[];
  rofo: boolean;
  rofr: boolean;
  purchase_option: boolean;
  lease_to_purchase: boolean;
  lease_to_purchase_duration: number | '';
  renewal_years: number | '';
  renewal_options_count: number | '';
  include_renewal_option: boolean;

  // 12. Assignment & Subletting
  consent_required: boolean;
  permitted_transfers_without_consent: boolean;
  continued_liability_on_assignment: boolean;
  recapture_right: boolean;
  recapture_applies_to: string;
  profit_sharing_percent: number | '';

  // 13. Defaults & Remedies
  monetary_cure_period_days: number | '';
  non_monetary_cure_period_days: number | '';
  late_fee_percent: number | '';
  interest_rate_apr: number | '';
  attorneys_fees_clause: boolean;

  // 14. Casualty & Condemnation
  casualty_threshold_percent: number | '';
  rent_abatement: boolean;

  // 15. Subordination / SNDA / Estoppel
  subordination_auto: boolean;
  nondisturbance_required: boolean;
  estoppel_window_days: number | '';

  // 16. Signage & Branding
  building_signage: boolean;
  monument_signage: boolean;
  pylon_signage: boolean;
  facade_signage: boolean;
  window_decals_allowed: boolean;
  sign_criteria_ack: boolean;

  // 17. Parking & Loading
  unreserved_spaces: number | '';
  reserved_spaces: number | '';
  loading_dock_use: boolean;

  // 18. Work Letter / TIA
  tia_amount: number | '';
  tia_per_sf: number | '';
  disbursement_method: string;
  plans_approvals_required: boolean;
  outside_completion_date: string;
  tenant_improvement: string;
  improvement_allowance_amount: number | '';
  improvement_allowance_enabled: boolean;

  // 19. Rules, Compliance & Misc.
  exclusive_list_attached: boolean;
  hazardous_use_details: string;
  confidentiality_required: boolean;
  relocation_option: boolean;
  special_conditions: string;
  contingencies: string[];

  // 20. Exhibits
  exhibit_a_floor_plan: boolean;
  exhibit_b_rent_schedule: boolean;
  exhibit_c_work_letter: boolean;
  exhibit_d_rules: boolean;
  exhibit_e_guaranty: boolean;
  exhibit_f_sign_criteria: boolean;
  exhibit_g_snda_form: boolean;
  exhibit_h_exclusive_use: boolean;

  // 21. Final Admin
  effective_date: string;
  counterparts_allowed: boolean;
  e_sign_permitted: boolean;
  email_notice_accepted: boolean;

  // Form metadata (not in schema but useful)
  submit_status?: 'Draft' | 'Submitted';
}

// ========================================
// Initial Values
// ========================================

export const LEASE_INITIAL_VALUES: LeaseFormValues = {
  // 1. Deal Posture & Basics
  party_posture: '',
  lease_type: '',
  governing_law_state: '',
  governing_law_county: '',

  // 2. Parties & Signature Blocks
  landlord_legal_name: '',
  landlord_state_of_formation: '',
  landlord_notice_address: '',
  landlord_notice_email: '',
  landlord_city: '',
  landlord_zip: '',

  tenant_legal_name: '',
  tenant_state_of_formation: '',
  tenant_notice_address: '',
  tenant_notice_email: '',
  tenant_city: '',
  tenant_zip: '',
  dba_name: '',

  guarantors: [],
  brokers: [],

  // 3. Premises & Project
  street_address: '',
  suite_or_floor: '',
  rentable_sf: '',
  project_name: '',
  load_factor: '',
  exclusive_parking_spaces: false,
  parking_ratio: '',
  common_area_rights: '',
  property_size: '',

  // in LEASE_INITIAL_VALUES
  hasExtraSpace: false,
  patio: "",
  patio_size: "",
  exclusive_parking_spaces: false,
  exclusive_parking_spaces_count: "",
  loading_dock_use: false,
  loading_dock_details: "",



  // 4. Term, Timing & Triggers
  initial_term_years: '',
  delivery_condition: '',
  commencement_trigger: '',
  commencement_date_certain: '',
  rent_commencement_offset_days: '',
  outside_opening_deadline_days: '',
  holdover_rent_multiplier: '',
  lease_duration: '',
  start_date: '',
  rent_start_date: '',

  // 5. Base Rent & Economics
  base_rent_schedule: '',
  monthly_rent: '',
  security_deposit: '',
  prepaid_rent: '',
  free_rent_month_list: [],
  annual_escalation_type: '',
  annual_escalation_percent: '',
  cpi_floor: '',
  cpi_ceiling: '',
  rent_escalation: '',
  rent_escalation_percent: '',
  rent_start_mode: '',
  percentage_lease_percent: '',

  // 6. Operating Expenses / NNN
  lease_structure: '',
  pass_throughs: '',
  cam_include_exclude: '',
  est_cam_per_sf: '',
  est_taxes_per_sf: '',
  est_insurance_per_sf: '',
  tenant_pro_rata_share: '',
  audit_right: false,
  audit_window_months: '',
  audit_threshold_percent: '',

  // 7. Utilities & Services
  responsibility: [],
  service_hours: '',
  trash_grease_interceptor: false,
  utilities: [],

  // 8. Insurance & Risk
  tenant_gl_coverage: '',
  property_contents_coverage: false,
  waiver_of_subrogation: false,
  indemnity_type: '',

  // 9. Maintenance, Repairs & Alterations
  hvac_contract_required: false,
  alterations_consent_required: false,
  cosmetic_threshold_usd: '',
  restoration_required_on_exit: false,
  maintenance: {},

  // 10. Use, Hours, Exclusives
  permitted_use: '',
  intended_use: '',
  prohibited_uses: '',
  operating_hours: '',
  go_dark_right: false,
  exclusive_use_protection: '',
  co_tenancy_terms: '',

  // 11. Options & Special Rights
  renewal_options: [],
  rofo: false,
  rofr: false,
  purchase_option: false,
  lease_to_purchase: false,
  lease_to_purchase_duration: '',
  renewal_years: '',
  renewal_options_count: '',
  include_renewal_option: false,

  // 12. Assignment & Subletting
  consent_required: false,
  permitted_transfers_without_consent: false,
  continued_liability_on_assignment: false,
  recapture_right: false,
  recapture_applies_to: '',
  profit_sharing_percent: '',

  // 13. Defaults & Remedies
  monetary_cure_period_days: '',
  non_monetary_cure_period_days: '',
  late_fee_percent: '',
  interest_rate_apr: '',
  attorneys_fees_clause: false,

  // 14. Casualty & Condemnation
  casualty_threshold_percent: '',
  rent_abatement: false,

  // 15. Subordination / SNDA / Estoppel
  subordination_auto: false,
  nondisturbance_required: false,
  estoppel_window_days: '',

  // 16. Signage & Branding
  building_signage: false,
  monument_signage: false,
  pylon_signage: false,
  facade_signage: false,
  window_decals_allowed: false,
  sign_criteria_ack: false,

  // 17. Parking & Loading
  unreserved_spaces: '',
  reserved_spaces: '',
  loading_dock_use: false,

  // 18. Work Letter / TIA
  tia_amount: '',
  tia_per_sf: '',
  disbursement_method: '',
  plans_approvals_required: false,
  outside_completion_date: '',
  tenant_improvement: '',
  improvement_allowance_amount: '',
  improvement_allowance_enabled: false,

  // 19. Rules, Compliance & Misc.
  exclusive_list_attached: false,
  hazardous_use_details: '',
  confidentiality_required: false,
  relocation_option: false,
  special_conditions: '',
  contingencies: [],

  // 20. Exhibits
  exhibit_a_floor_plan: false,
  exhibit_b_rent_schedule: false,
  exhibit_c_work_letter: false,
  exhibit_d_rules: false,
  exhibit_e_guaranty: false,
  exhibit_f_sign_criteria: false,
  exhibit_g_snda_form: false,
  exhibit_h_exclusive_use: false,

  // 21. Final Admin
  effective_date: '',
  counterparts_allowed: false,
  e_sign_permitted: false,
  email_notice_accepted: false,

  // Form metadata
  submit_status: 'Draft',
};

// ========================================
// Helper function for edit mode
// ========================================

export const LEASE_EDIT_INITIAL_VALUES = (leaseData: Partial<LeaseFormValues>): LeaseFormValues => ({
  ...LEASE_INITIAL_VALUES,
  ...leaseData,
});