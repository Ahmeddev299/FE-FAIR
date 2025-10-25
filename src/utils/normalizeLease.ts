/* eslint-disable @typescript-eslint/no-explicit-any */

// /utils/normalizeLease.ts

import { LeaseFormValues } from "@/types/lease";

/**
 * Normalize/transform form values before sending to API.
 * Example: coerce numbers, strip empty strings, map exhibits files to FormData, etc.
 */
export function normalizeLease(values: LeaseFormValues) {
  // Simple example: coerce numeric strings → numbers where appropriate
  const n = (v: any) => (v === "" || v === null || v === undefined ? undefined : Number(v));

  return {
    ...values,
    rentable_sf: n(values.rentable_sf),
    patio_size: n(values.patio_size),
    unreserved_spaces: n(values.unreserved_spaces),
    reserved_spaces: n(values.reserved_spaces),
    initial_term_years: n(values.initial_term_years),
    outside_opening_deadline_days: n(values.outside_opening_deadline_days),
    industrial_operational_deadline_days: n(values.industrial_operational_deadline_days),
    rent_commencement_offset_days: n(values.rent_commencement_offset_days),
    monthly_rent: n(values.monthly_rent),
    security_deposit: n(values.security_deposit),
    prepaid_rent: n(values.prepaid_rent),
    free_rent_months: n(values.free_rent_months),
    base_rent_schedule: n(values.base_rent_schedule),
    annual_escalation_percent: n(values.annual_escalation_percent),
    cpi_floor: n(values.cpi_floor),
    cpi_ceiling: n(values.cpi_ceiling),
    percentage_lease_percent: n(values.percentage_lease_percent),
    monetary_cure_period_days: n(values.monetary_cure_period_days),
    non_monetary_cure_period_days: n(values.non_monetary_cure_period_days),
    late_fee_percent: n(values.late_fee_percent),
    interest_rate_apr: n(values.interest_rate_apr),
    purchase_terms_window_days: n(values.purchase_terms_window_days),
    ltp_terms_window_days: n(values.ltp_terms_window_days),
    estoppel_delivery_days: n(values.estoppel_delivery_days),
    ll_signage_approval_days: n(values.ll_signage_approval_days),
    profit_sharing_percent: n(values.profit_sharing_percent),
    base_rent_schedule_rows: (values.base_rent_schedule_rows || []).map(r => ({
      ...r,
      monthly_rent: n(r.monthly_rent),
      rate_per_sf_year: n(r.rate_per_sf_year),
    })),
    // exhibits: handle separately if uploading files (FormData) — left as-is
  };
}
