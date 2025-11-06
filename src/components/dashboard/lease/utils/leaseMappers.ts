// utils/leaseMappers.ts
import { LeaseFormValues } from "@/types/lease";
import { LEASE_INITIAL_VALUES } from "@/types/lease";

const toBool = (v: any) =>
  v === true || v === 1 || (typeof v === "string" && ["yes","true","1"].includes(v.toLowerCase()));

const toDateInput = (s?: string | null) =>
  s ? new Date(s).toISOString().slice(0, 10) : "";

export function mapLeaseApiToForm(api: any): LeaseFormValues {
  const d = api?.lease_data ?? {};
  const bi = d.BASIC_INFORMATION ?? {};
  const pp = d.PREMISES_PROPERTY_DETAILS ?? {};
  const tt = d.TERM_TIMING_TRIGGERS ?? {};
  const re = d.RENT_ECONOMICS ?? {};
  const om = d.OPERATIONS_MAINTENANCE ?? {};
  const rc = d.RIGHTS_OPTIONS_CONDITIONS ?? {};

  return {
    ...LEASE_INITIAL_VALUES,

    // BASIC INFO
    title: bi.title ?? "",
    addFileNumber: toBool(bi.addFileNumber),
    lease_type: bi.lease_type ?? "",
    landlordId: "",
    landlordName: bi.landlord_legal_name ?? "",
    landlordEmail: bi.landlord_notice_email ?? "",
    tenantId: "",
    tenantName: bi.tenant_legal_name ?? "",
    tenantEmail: bi.tenant_notice_email ?? "",
    landlord_address_S1: bi.landlord_notice_address_1 ?? "",
    landlord_address_S2: bi.landlord_notice_address_2 ?? "",
    landlord_city: bi.landlord_city ?? "",
    landlord_state: bi.landlord_state ?? "",
    landlord_zip: String(bi.landlord_zip ?? ""),
    tenant_address_S1: bi.tenant_notice_address_1 ?? "",
    tenant_address_S2: bi.tenant_notice_address_2 ?? "",
    tenant_city: bi.tenant_city ?? "",
    tenant_state: bi.tenant_state ?? "",
    tenant_zip: String(bi.tenant_zip ?? ""),

    // PREMISES
    premisses_property_address_S1: pp.property_address_line1 ?? "",
    premisses_property_address_S2: pp.property_address_line2 ?? "",
    premisses_property_city: pp.property_city ?? "",
    premisses_property_state: pp.property_state ?? "",
    premisses_property_zip: String(pp.property_zip ?? ""),
    rentable_sf: String(pp.rentable_sf ?? ""),
    property_size: pp.property_size ?? "",
    hasExtraSpace: toBool(pp.has_extra_space),
    outdoor_size: String(pp.patio_size ?? ""),
    exclusive_parking_spaces: toBool(pp.exclusive_parking_spaces),
    reserved_spaces: String(pp.reserved_spaces ?? ""),

    // TERM
    initial_term_years: String(tt.initial_term_years ?? ""),
    delivery_condition: tt.delivery_condition ?? "",
    commencement_trigger: tt.commencement_trigger ?? "",
    commencement_date_certain: toDateInput(tt.commencement_date_certain),
    rent_commencement_offset_days: "",

    // RENT
    rent_type: re.rent_type ?? "",
    monthly_rent: String(re.monthly_rent ?? ""),
    security_deposit: String(re.security_deposit ?? ""),
    prepaid_rent: String(re.prepaid_rent ?? ""),
    percentage_lease_percent: String(re.percentage_lease_percent ?? ""),
    schedule_basis: re.schedule_basis ?? "Monthly",
    base_rent_schedule_rows: re.base_rent_schedule_rows ?? [],

    // O&M
    lease_structure: om.lease_structure ?? "",
    gross_estimate_amount: Number(om.gross_estimate_amount ?? 0),
    cam_include_exclude: om.cam_include_exclude ?? "",
    management_fee_cap_percent: String(om.management_fee_cap_percent ?? ""),
    capital_amortization_rules: om.capital_amortization_rules ?? "",
    est_cam_per_sf: String(om.est_cam_per_sf ?? ""),
    est_taxes_per_sf: String(om.est_taxes_per_sf ?? ""),
    est_insurance_per_sf: String(om.est_insurance_per_sf ?? ""),
    nnn_est_annual: String(om.nnn_est_annual ?? ""),
    audit_right: toBool(om.audit_right),

    insurance_party_cgl: "",
    insurance_limit_cgl: "",
    insurance_party_workers_comp: "",
    insurance_limit_workers_comp: "",
    insurance_party_liquor_liability: "",
    insurance_limit_liquor_liability: "",

    maintenance_structural: om.maintenance_structural ?? "",
    maintenance_non_structural: om.maintenance_non_structural ?? "",
    maintenance_hvac: om.maintenance_hvac ?? "",
    maintenance_plumbing: om.maintenance_plumbing ?? "",
    maintenance_electrical: om.maintenance_electrical ?? "",
    maintenance_common_areas: om.maintenance_common_areas ?? "",
    maintenance_utilities: om.maintenance_utilities ?? "",
    maintenance_special_equipment: om.maintenance_special_equipment ?? "",
    hvac_contract_required: toBool(om.hvac_contract_required),
    service_hours: om.service_hours ?? "",
    vent_hood: false,
    grease_trap: toBool(om.trash_grease_interceptor),
    utilities: om.utilities ?? [],
    utility_responsibility: om.utility_responsibility ?? "",

    // RIGHTS / OPTIONS
    permitted_use: rc.permitted_use ?? "",
    prohibited_custom: toBool(rc.prohibited_custom),
    prohibited_uses: rc.prohibited_uses ?? "",
    operating_hours: rc.operating_hours ?? "",
    exclusive_requested: rc.exclusive_requested ?? "",
    exclusive_description: rc.exclusive_description ?? "",
    cotenancy_applicable: toBool(rc.cotenancy_applicable),
    cotenancy_opening: rc.cotenancy_opening ?? "",
    cotenancy_ongoing: rc.cotenancy_ongoing ?? "",
    cotenancy_remedies: rc.cotenancy_remedies ?? "",
    rentEscalationType: "percent",
    rentEscalationPercent: "",
    includeRenewalOption: toBool(rc.include_renewal_option),
    renewalOptionsCount: String(rc.renewal_options_count ?? ""),
    renewalYears: String(rc.renewal_years ?? ""),
    rofr_yes: rc.rofr_yes ?? "",
    rofr_scope: rc.rofr_scope ?? "",

    ltp_yes: toBool(rc.LeaseToPurchase) ? "Yes" : "No",
    ltp_terms_window_days: String(rc.termWindow ?? ""),
    ltp_notes: rc.noteLeasetoPurchase ?? "",

    subordination_automatic: rc.subordination_automatic ?? "",
    non_disturbance_required: rc.non_disturbance_required ?? "",
    nondisturbance_condition: rc.nondisturbance_condition ?? "",
    estoppel_delivery_days: String(rc.estoppel_delivery_days ?? ""),
    exhibits: rc.exhibits ?? [],

    confidentiality_required: toBool(rc.confidentiality_lease_terms),
  };
}
