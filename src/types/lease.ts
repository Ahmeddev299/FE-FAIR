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

export interface BaseRentScheduleRow {
  period: string;
  monthly_rent: number | string;
  rate_per_sf_year: number | string;
}

export interface ExhibitRow {
  label: string;
  description: string;
}

// ========================================
// Main Lease Form Values Type
// ========================================

export interface LeaseFormValues {
  // 1. Deal Posture & Basics
  party_posture: 'Landlord' | 'Tenant' | '';
  lease_type: 'Retail' | 'Office' | 'Industrial' | 'Other' | '';
  governing_law_state: string;
  governing_law_county: string;
  
  

  // 2. Parties & Signature Blocks
  title: string;
  addFileNumber: boolean;
  
  landlord_legal_name: string;
  landlord_state_of_formation: string;
  landlord_notice_address: string;
  landlord_notice_email: string;
  landlord_city: string;
  landlord_zip: number | string;

  tenant_legal_name: string;
  tenant_state_of_formation: string;
  tenant_notice_address: string;
  tenant_notice_email: string;
  tenant_city: string;
  tenant_zip: number | string;
  dba_name: string;

  // Party dropdown fields
  landlordId: string;
  landlordName: string;
  landlordEmail: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;

  guarantors: Guarantor[];
  brokers: Broker[];

  // 3. Premises & Project
  property_address_S1: string;
  property_address_S2: string;
  property_city: string;
  property_state: string;
  property_zip: string;
  street_address: string;
  suite_or_floor: string;
  rentable_sf: number | string;
  project_name: string;
  load_factor: string;
  
  // Parking
  exclusive_parking_spaces: boolean;
  exclusive_parking_spaces_count: number | string;
  parking_ratio: string;
  common_area: string;
  common_ratio: string;
  common_area_rights: string;
  unreserved_spaces: number | string;
  reserved_spaces: number | string;
  
  property_size: string;
  
  // Outer space
  hasExtraSpace: boolean;
  patio: string;
  patio_size: number | string;

  // Loading dock
  loading_dock_use: boolean;
  loading_dock_type: '' | 'Industrial' | 'Retail';
  loading_dock_details: string;
  industrial_dock_count: number | string;
  industrial_door_clear_height_ft: number | string;
  industrial_trailer_parking: boolean;

  // 4. Term, Timing & Triggers
  initial_term_years: number | string;
  delivery_condition: string;
  commencement_trigger: string;
  commencement_date_certain: string;
  rent_commencement_offset_days: number | string;
  opening_type: '' | 'Retail' | 'Industrial';
  outside_opening_deadline_days: number | string;
  industrial_operational_deadline_days: number | string;
  holdover_rent_multiplier: string;
  lease_duration: number | string;
  start_date: string;
  rent_start_date: string;

  // 5. Base Rent & Economics
  base_rent_schedule: number | string;
  base_rent_schedule_rows: BaseRentScheduleRow[];
  monthly_rent: number | string;
  security_deposit: number | string;
  prepaid_rent: number | string;
  free_rent_months: number | string;
  free_rent_month_list: string;
  annual_escalation_type: 'Fixed' | 'CPI' | 'None' | '';
  annual_escalation_percent: number | string;
  cpi_floor: number | string;
  cpi_ceiling: number | string;
  rent_escalation: number | string;
  rent_escalation_percent: number | string;
  rent_start_mode: string;
  percentage_lease_percent: number | string;

  // 6. Operating Expenses / NNN
  lease_structure: 'Gross' | 'Modified Gross' | 'Triple Net' | '';
  pass_throughs: string;
  cam_include_exclude: string;
  management_fee_cap_percent: number | string;
  capital_amortization_rules: string;
  est_cam_per_sf: number | string;
  est_taxes_per_sf: number | string;
  est_insurance_per_sf: number | string;
  tenant_pro_rata_share: number | string;
  audit_right: boolean;
  audit_window_months: number | string;
  audit_threshold_percent: number | string;

  // 7. Utilities & Services
  responsibility: string[];
  utility_responsibility: string;
  service_hours: string;
  trash_grease_interceptor: boolean;
  utilities: string[];

  // 8. Insurance & Risk
  tenant_gl_coverage: string;
  property_contents_coverage: boolean;
  property_contents_limit: string;
  waiver_of_subrogation: boolean;
  indemnity_type: 'Mutual' | 'Landlord-favored' | '';

  // 9. Maintenance, Repairs & Alterations
  hvac_contract_required: boolean;
  alterations_consent_required: boolean;
  cosmetic_threshold_usd: number | string;
  restoration_required_on_exit: boolean;
  maintenance: MaintenanceResponsibility;

  // 10. Use, Hours, Exclusives
  permitted_use: string;
  intended_use: string;
  prohibited_custom: boolean;
  prohibited_uses: string;
  operating_hours: string;
  go_dark: string;
  go_dark_conditions: string;
  go_dark_right: boolean;
  exclusive_requested: string;
  exclusive_description: string;
  exclusive_use_protection: string;
  cotenancy_applicable: boolean;
  cotenancy_opening: string;
  cotenancy_ongoing: string;
  cotenancy_remedies: string;
  co_tenancy_terms: string;

  // 11. Options & Special Rights
  renewal_options: RenewalOption[];
  rentEscalationType: 'percent' | 'fmv';
  rentEscalationPercent: number | string;
  includeRenewalOption: boolean;
  renewalOptionsCount: number | string;
  renewalYears: number | string;
  
  rofo: boolean;
  rofo_yes: string;
  rofo_scope: string;
  
  rofr: boolean;
  rofr_yes: string;
  rofr_scope: string;
  
  purchase_option: boolean;
  purchase_yes: string;
  purchase_terms_window_days: number | string;
  purchase_notes: string;
  
  lease_to_purchase: boolean;
  ltp_yes: string;
  ltp_terms_window_days: number | string;
  ltp_notes: string;
  lease_to_purchase_duration: number | string;

  // 12. Assignment & Subletting
  consent_required: string;
  consent_standard: string;
  permitted_transfers_without_consent: boolean;
  permitted_transfers_yes: string;
  permitted_transfers_scope: string;
  continued_liability_on_assignment: boolean;
  recapture_right: string;
  recapture_applies_to: string;
  profit_sharing_percent: number | string;

  // 13. Defaults & Remedies
  monetary_cure_period_days: number | string;
  non_monetary_cure_period_days: number | string;
  late_fee_percent: number | string;
  interest_rate_apr: number | string;
  attorneys_fees_clause: boolean;

  // 14. Casualty & Condemnation
  casualty_termination_threshold: string;
  casualty_threshold_percent: number | string;
  rent_abatement: boolean;
  rent_abatement_during_restoration: string;
  rent_abatement_scope: string;

  // 15. Subordination / SNDA / Estoppel
  subordination_auto: boolean;
  subordination_automatic: string;
  nondisturbance_required: boolean;
  non_disturbance_required: string;
  nondisturbance_condition: string;
  estoppel_window_days: number | string;
  estoppel_delivery_days: number | string;

  // 16. Signage & Branding
  building_signage: boolean;
  monument_signage: boolean;
  monument_panel_spec: string;
  pylon_signage: boolean;
  pylon_panel_spec: string;
  facade_signage: boolean;
  window_decals_allowed: boolean;
  roof_signage: boolean;
  blade_sign: boolean;
  temp_grand_opening: string;
  temp_grand_opening_days: number | string;
  banner_signage: string;
  banner_signage_days: number | string;
  ll_signage_approval_days: number | string;
  signage_permits_responsible: string;
  signage_maintenance_responsible: string;
  signage_criteria_waiver: string;
  signage_waiver_notes: string;
  sign_criteria_ack: boolean;

  // 17. Parking & Loading (additional fields already covered above)

  // 18. Work Letter / TIA
  tia_amount: number | string;
  tia_per_sf: number | string;
  disbursement_method: string;
  plans_approvals_required: boolean;
  outside_completion_date: string;
  tenant_improvement: string;
  improvement_allowance_amount: number | string;
  improvement_allowance_enabled: boolean;

  // 19. Rules, Compliance & Misc.
  rules_attached: string;
  exclusive_list_attached: string | boolean;
  prohibited_hazardous_beyond_standard: string;
  hazardous_specifics: string;
  hazardous_use_details: string;
  confidentiality_lease_terms: string;
  confidentiality_required: boolean;
  option_to_relocate: string;
  relocate_notice_days: number | string;
  relocate_conditions: string;
  relocation_option: boolean;
  special_conditions: string;
  contingencies: string[];

  // 20. Exhibits
  exhibit_rows: ExhibitRow[];
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
  effective_date_placeholder: string;
  counterparts_allowed: boolean;
  e_sign_permitted: boolean;
  esign_permitted: string;
  email_notice_accepted: boolean;
  notice_email_accepted: string;
  notice_email_notes: string;

  // Form metadata
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
  title: '',
  addFileNumber: false,
  
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

  // Party dropdowns
  landlordId: '',
  landlordName: '',
  landlordEmail: '',
  tenantId: '',
  tenantName: '',
  tenantEmail: '',

  guarantors: [],
  brokers: [],

  // 3. Premises & Project
  property_address_S1: '',
  property_address_S2: '',
  property_city: '',
  property_state: '',
  property_zip: '',
  street_address: '',
  suite_or_floor: '',
  rentable_sf: '',
  project_name: '',
  load_factor: '',
  
  // Parking
  exclusive_parking_spaces: false,
  exclusive_parking_spaces_count: '',
  parking_ratio: '',
  common_area: '',
  common_ratio: '',
  common_area_rights: '',
  unreserved_spaces: '',
  reserved_spaces: '',
  
  property_size: '',
  
  // Outer space
  hasExtraSpace: false,
  patio: '',
  patio_size: '',

  // Loading dock
  loading_dock_use: false,
  loading_dock_type: '',
  loading_dock_details: '',
  industrial_dock_count: '',
  industrial_door_clear_height_ft: '',
  industrial_trailer_parking: false,

  // 4. Term, Timing & Triggers
  initial_term_years: '',
  delivery_condition: '',
  commencement_trigger: '',
  commencement_date_certain: '',
  rent_commencement_offset_days: '',
  opening_type: '',
  outside_opening_deadline_days: '',
  industrial_operational_deadline_days: '',
  holdover_rent_multiplier: '',
  lease_duration: '',
  start_date: '',
  rent_start_date: '',

  // 5. Base Rent & Economics
  base_rent_schedule: '',
  base_rent_schedule_rows: [],
  monthly_rent: '',
  security_deposit: '',
  prepaid_rent: '',
  free_rent_months: '',
  free_rent_month_list: '',
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
  management_fee_cap_percent: '',
  capital_amortization_rules: '',
  est_cam_per_sf: '',
  est_taxes_per_sf: '',
  est_insurance_per_sf: '',
  tenant_pro_rata_share: '',
  audit_right: false,
  audit_window_months: '',
  audit_threshold_percent: '',

  // 7. Utilities & Services
  responsibility: [],
  utility_responsibility: '',
  service_hours: '',
  trash_grease_interceptor: false,
  utilities: [],

  // 8. Insurance & Risk
  tenant_gl_coverage: '',
  property_contents_coverage: false,
  property_contents_limit: '',
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
  prohibited_custom: false,
  prohibited_uses: '',
  operating_hours: '',
  go_dark: '',
  go_dark_conditions: '',
  go_dark_right: false,
  exclusive_requested: '',
  exclusive_description: '',
  exclusive_use_protection: '',
  cotenancy_applicable: false,
  cotenancy_opening: '',
  cotenancy_ongoing: '',
  cotenancy_remedies: '',
  co_tenancy_terms: '',

  // 11. Options & Special Rights
  renewal_options: [],
  rentEscalationType: 'percent',
  rentEscalationPercent: '',
  includeRenewalOption: false,
  renewalOptionsCount: '',
  renewalYears: '',
  
  rofo: false,
  rofo_yes: '',
  rofo_scope: '',
  
  rofr: false,
  rofr_yes: '',
  rofr_scope: '',
  
  purchase_option: false,
  purchase_yes: '',
  purchase_terms_window_days: '',
  purchase_notes: '',
  
  lease_to_purchase: false,
  ltp_yes: '',
  ltp_terms_window_days: '',
  ltp_notes: '',
  lease_to_purchase_duration: '',

  // 12. Assignment & Subletting
  consent_required: '',
  consent_standard: '',
  permitted_transfers_without_consent: false,
  permitted_transfers_yes: '',
  permitted_transfers_scope: '',
  continued_liability_on_assignment: false,
  recapture_right: '',
  recapture_applies_to: '',
  profit_sharing_percent: '',

  // 13. Defaults & Remedies
  monetary_cure_period_days: '',
  non_monetary_cure_period_days: '',
  late_fee_percent: '',
  interest_rate_apr: '',
  attorneys_fees_clause: false,

  // 14. Casualty & Condemnation
  casualty_termination_threshold: '',
  casualty_threshold_percent: '',
  rent_abatement: false,
  rent_abatement_during_restoration: '',
  rent_abatement_scope: '',

  // 15. Subordination / SNDA / Estoppel
  subordination_auto: false,
  subordination_automatic: '',
  nondisturbance_required: false,
  non_disturbance_required: '',
  nondisturbance_condition: '',
  estoppel_window_days: '',
  estoppel_delivery_days: '',

  // 16. Signage & Branding
  building_signage: false,
  monument_signage: false,
  monument_panel_spec: '',
  pylon_signage: false,
  pylon_panel_spec: '',
  facade_signage: false,
  window_decals_allowed: false,
  roof_signage: false,
  blade_sign: false,
  temp_grand_opening: '',
  temp_grand_opening_days: '',
  banner_signage: '',
  banner_signage_days: '',
  ll_signage_approval_days: '',
  signage_permits_responsible: '',
  signage_maintenance_responsible: '',
  signage_criteria_waiver: '',
  signage_waiver_notes: '',
  sign_criteria_ack: false,

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
  rules_attached: '',
  exclusive_list_attached: '',
  prohibited_hazardous_beyond_standard: '',
  hazardous_specifics: '',
  hazardous_use_details: '',
  confidentiality_lease_terms: '',
  confidentiality_required: false,
  option_to_relocate: '',
  relocate_notice_days: '',
  relocate_conditions: '',
  relocation_option: false,
  special_conditions: '',
  contingencies: [],

  // 20. Exhibits
  exhibit_rows: [],
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
  effective_date_placeholder: '',
  counterparts_allowed: false,
  e_sign_permitted: false,
  esign_permitted: '',
  email_notice_accepted: false,
  notice_email_accepted: '',
  notice_email_notes: '',

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