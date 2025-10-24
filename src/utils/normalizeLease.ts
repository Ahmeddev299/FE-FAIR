// utils/normalizeLease.ts
import { LeaseFormValues } from '@/types/lease';

const toNum = (v: any) =>
  v === '' || v === null || v === undefined ? undefined : Number(v);

export function normalizeLease(values: LeaseFormValues) {
  return {
    // Basic
    party_posture: values.party_posture || undefined,
    lease_type: values.lease_type || undefined,
    governing_law: {
      state: values.governing_law_state || undefined,
      county: values.governing_law_county || undefined,
    },
    parties: {
      landlord: {
        legal_name: values.landlord_legal_name || undefined,
        notice_email: values.landlord_notice_email || undefined,
      },
      tenant: {
        legal_name: values.tenant_legal_name || undefined,
        notice_email: values.tenant_notice_email || undefined,
      },
    },

    // Premises
    premises: {
      address: {
        street: values.street_address || undefined,
        suite_or_floor: values.suite_or_floor || undefined,
        project_name: values.project_name || undefined,
      },
      sizes: {
        rentable_sf: toNum(values.rentable_sf),
        load_factor: values.load_factor ? Number(values.load_factor) : undefined,
        property_size: values.property_size || undefined,
        patio: values.patio || undefined,
        patio_size: toNum(values.patio_size),
      },
      parking: {
        exclusive: !!values.exclusive_parking_spaces,
        ratio: values.parking_ratio || undefined,
        unreserved: toNum(values.unreserved_spaces),
        reserved: toNum(values.reserved_spaces),
      },
      loading_dock_use: !!values.loading_dock_use,
      common_area_rights: values.common_area_rights || undefined,
    },

    // Term & Rent
    term: {
      initial_years: toNum(values.initial_term_years),
      duration_months: toNum(values.lease_duration),
      start_date: values.start_date || undefined,
      rent_start_date: values.rent_start_date || undefined,
      rent_commencement_offset_days: toNum(values.rent_commencement_offset_days),
      outside_opening_deadline_days: toNum(values.outside_opening_deadline_days),
      delivery_condition: values.delivery_condition || undefined,
      commencement_trigger: values.commencement_trigger || undefined,
      holdover_rent_multiplier: values.holdover_rent_multiplier || undefined,
    },
    economics: {
      monthly_rent: toNum(values.monthly_rent),
      security_deposit: toNum(values.security_deposit),
      prepaid_rent: toNum(values.prepaid_rent),
      escalation: {
        type: values.annual_escalation_type || undefined,
        percent: toNum(values.annual_escalation_percent),
        cpi_floor: toNum(values.cpi_floor),
        cpi_ceiling: toNum(values.cpi_ceiling),
      },
      percentage_lease_percent: toNum(values.percentage_lease_percent),
      base_rent_schedule_months: toNum(values.base_rent_schedule),
    },

    // Operating Expenses / NNN
    operating_expenses: {
      structure: values.lease_structure || undefined,
      tenant_pro_rata_share: toNum(values.tenant_pro_rata_share),
      estimates_per_sf: {
        cam: toNum(values.est_cam_per_sf),
        taxes: toNum(values.est_taxes_per_sf),
        insurance: toNum(values.est_insurance_per_sf),
      },
      pass_throughs: values.pass_throughs || undefined,
      cam_include_exclude: values.cam_include_exclude || undefined,
      audit: {
        right: !!values.audit_right,
        window_months: toNum(values.audit_window_months),
        threshold_percent: toNum(values.audit_threshold_percent),
      },
    },

    // Insurance & Risk
    insurance: {
      tenant_gl_coverage: values.tenant_gl_coverage || undefined,
      indemnity_type: values.indemnity_type || undefined,
      property_contents_coverage: !!values.property_contents_coverage,
      waiver_of_subrogation: !!values.waiver_of_subrogation,
    },

    // Maintenance
    maintenance: {
      responsibilities: {
        roof: values.maintenance.roof || undefined,
        structure: values.maintenance.structure || undefined,
        parking: values.maintenance.parking || undefined,
      },
      cosmetic_threshold_usd: toNum(values.cosmetic_threshold_usd),
      hvac_contract_required: !!values.hvac_contract_required,
      alterations_consent_required: !!values.alterations_consent_required,
      restoration_required_on_exit: !!values.restoration_required_on_exit,
    },

    // Use & Rights
    use_rights: {
      permitted_use: values.permitted_use || undefined,
      intended_use: values.intended_use || undefined,
      prohibited_uses: values.prohibited_uses || undefined,
      operating_hours: values.operating_hours || undefined,
      exclusive_use_protection: values.exclusive_use_protection || undefined,
      co_tenancy_terms: values.co_tenancy_terms || undefined,
      go_dark_right: !!values.go_dark_right,
    },

    // Utilities
    utilities: {
      service_hours_per_day: toNum(values.service_hours),
      trash_grease_interceptor: !!values.trash_grease_interceptor,
      available: values.utilities || [],
      responsibility: values.responsibility || [], // if single: store one string
    },

    // Options & Special Rights
    options_rights: {
      renewal_options_count: toNum(values.renewal_options_count),
      renewal_years: toNum(values.renewal_years),
      include_renewal_option: !!values.include_renewal_option,
      rofo: !!values.rofo,
      rofr: !!values.rofr,
      purchase_option: !!values.purchase_option,
      lease_to_purchase: !!values.lease_to_purchase,
    },

    // Assignment
    assignment_subletting: {
      consent_required: !!values.consent_required,
      permitted_transfers_without_consent: values.permitted_transfers_without_consent || undefined,
      continued_liability_on_assignment: !!values.continued_liability_on_assignment,
      recapture_right: !!values.recapture_right,
      profit_sharing_percent: toNum(values.profit_sharing_percent),
    },

    // Defaults & Remedies
    defaults_remedies: {
      monetary_cure_period_days: toNum(values.monetary_cure_period_days),
      non_monetary_cure_period_days: toNum(values.non_monetary_cure_period_days),
      late_fee_percent: toNum(values.late_fee_percent),
      interest_rate_apr: toNum(values.interest_rate_apr),
      attorneys_fees_clause: !!values.attorneys_fees_clause,
    },

    // Signage & Branding
    signage_branding: {
      building: !!values.building_signage,
      monument: !!values.monument_signage,
      pylon: !!values.pylon_signage,
      facade: !!values.facade_signage,
      window_decals_allowed: !!values.window_decals_allowed,
    },

    // TI
    tenant_improvements: values.improvement_allowance_enabled
      ? {
          enabled: true,
          tia_amount: toNum(values.tia_amount),
          tia_per_sf: toNum(values.tia_per_sf),
          disbursement_method: values.disbursement_method || undefined,
          plans_approvals_required: !!values.plans_approvals_required,
          outside_completion_date: values.outside_completion_date || undefined,
        }
      : { enabled: false },

    // Special Conditions
    special_conditions: {
      notes: values.special_conditions || undefined,
      contingencies: values.contingencies || [],
    },
  };
}
