/* eslint-disable @typescript-eslint/no-explicit-any */
import { LeaseFormValues } from "@/types/lease";

export function normalizeLease(values: LeaseFormValues , id?:string ) {
  console.log("running")
  // helpers
  const n = (v: any) =>
    v === "" || v == null ? undefined : (isNaN(Number(v)) ? undefined : Number(v));
  const s = (v: any) => (v === "" || v == null ? undefined : String(v).trim());
  const b = (v: any) => v === true || v === "true" || v === "Yes";
  const arr = (v: any) =>
    Array.isArray(v) ? v.filter((x) => x !== "" && x != null) : undefined;

  const capitalize = (str: string | undefined) =>
    !str ? undefined : str.charAt(0).toUpperCase() + str.slice(1);

  const isModGross = values.lease_structure === "Modified Gross";
  const isNNN = values.lease_structure === "Triple Net";
  const showPassThrough = isModGross || isNNN;

  // ----- Insurance (reads from insurance_requirements.{key}.limit/custom_limit) -----
  const getInsLimit = (k: "cgl" | "workers_comp" | "liquor_liability") => {
    const v = (values as any).insurance_requirements?.[k];
    const raw = s(v?.limit);
    if (!raw) return undefined;
    return raw === "custom" ? s(v?.custom_limit) : raw;
  };
  const insuranceObj: any = {};
  const cgl = getInsLimit("cgl");
  if (cgl) insuranceObj.cgl = { limit: cgl };
  const wc = getInsLimit("workers_comp");
  if (wc) insuranceObj.workers_comp = { limit: wc };
  const liquor = getInsLimit("liquor_liability");
  if (liquor) insuranceObj.liquor_liability = { limit: liquor };

  // ----- Base-rent derivations (server wants monthly_rent present) -----
  const rentable = n(values.rentable_sf) ?? 0;
  const to2 = (x: number | undefined) =>
    typeof x === "number" && isFinite(x) ? Number(x.toFixed(2)) : undefined;
  const monthlyFromRate = (ratePerSfYear?: number) =>
    rentable > 0 && typeof ratePerSfYear === "number"
      ? to2((ratePerSfYear * rentable) / 12)
      : undefined;
  const rateFromMonthly = (monthly?: number) =>
    rentable > 0 && typeof monthly === "number"
      ? to2((monthly * 12) / rentable)
      : undefined;

  // ----- Map your RIGHTS_OPTIONS escalation to API's RENT_ECONOMICS.annual_* -----
  // If you keep using rentEscalationType ("percent" | "fmv"), map to Fixed/None.
  // const mappedAnnualEscType =
  //   values.rentEscalationType === "percent" ? "Fixed" : "None";
  const mappedAnnualEscPct =
    values.rentEscalationType === "percent" ? n(values.rentEscalationPercent) : undefined;

      const effectiveDocId = id 
      
  return {
    submitted_status: "submitted",
      ...(effectiveDocId ? { doc_id: effectiveDocId } : {}),

    // === STEP 1: BASIC INFORMATION (flat address fields required by API) ===
    BASIC_INFORMATION: {
      // Titles & Type
      title: s(values.title),
      addFileNumber: b(values.addFileNumber),
      lease_type: s(values.lease_type),

      // Party IDs (optional but keep)
      landlordId: s(values.landlordId),
      landlordName: s(values.landlordName),
      landlordEmail: s(values.landlordEmail),
      tenantId: s(values.tenantId),
      tenantName: s(values.tenantName),
      tenantEmail: s(values.tenantEmail),

      // REQUIRED by API:
      landlord_legal_name: s(values.landlordName) || s((values as any).landlord_legal_name),
      landlord_notice_email: s(values.landlordEmail) || s((values as any).landlord_notice_email),
      landlord_notice_address_1: s(values.landlord_address_S1),
      landlord_notice_address_2: s(values.landlord_address_S2),
      landlord_city: s(values.landlord_city),
      landlord_state: s(values.landlord_state),
      landlord_zip: s(values.landlord_zip),

      tenant_legal_name: s(values.tenantName) || s((values as any).tenant_legal_name),
      tenant_notice_email: s(values.tenantEmail) || s((values as any).tenant_notice_email),
      tenant_notice_address_1: s(values.tenant_address_S1),
      tenant_notice_address_2: s(values.tenant_address_S2),
      tenant_city: s(values.tenant_city),
      tenant_state: s(values.tenant_state),
      tenant_zip: s(values.tenant_zip),
    },

    // === STEP 2: PREMISES & PROPERTY DETAILS ===
    PREMISES_PROPERTY_DETAILS: {
      property_address_line1: s(values.premisses_property_address_S1),
      property_address_line2: s(values.premisses_property_address_S2),
      property_city: s(values.premisses_property_city),
      property_state: s(values.premisses_property_state),
      property_zip: s(values.premisses_property_zip),
      property_address_full: [
        s(values.premisses_property_address_S1),
        s(values.premisses_property_address_S2),
        [s(values.premisses_property_city), s(values.premisses_property_state), s(values.premisses_property_zip)]
          .filter(Boolean)
          .join(" "),
      ]
        .filter(Boolean)
        .join(", "),

      rentable_sf: n(values.rentable_sf),
      property_size: n(values.property_size), // <-- numeric per API

      hasExtraSpace: b(values.hasExtraSpace),
      outdoor_size: b(values.hasExtraSpace) ? n(values.outdoor_size) : undefined,

      exclusive_parking_spaces: b(values.exclusive_parking_spaces),
      reserved_spaces: b(values.exclusive_parking_spaces)
        ? n(values.reserved_spaces)
        : undefined,
    },

    // === STEP 3: TERM, TIMING & TRIGGERS ===
    TERM_TIMING_TRIGGERS: {
      initial_term_years: n(values.initial_term_years),
      delivery_condition: s(values.delivery_condition),
      commencement_trigger: s(values.commencement_trigger),
      commencement_date_certain:
        values.commencement_trigger === "Date certain" ? s(values.commencement_date_certain) : undefined,
      rent_commencement_offset_days: n(values.rent_commencement_offset_days),
    },

    // === STEP 4: RENT & ECONOMICS ===
    RENT_ECONOMICS: {
        base_rent_schedule: s(values.base_rent_schedule),

      rent_type: s(values.rent_type),
      monthly_rent: values.rent_type !== "Percent" ? n(values.monthly_rent) : undefined,
      percentage_lease_percent: values.rent_type === "Percent" ? n(values.percentage_lease_percent) : undefined,
      security_deposit: n(values.security_deposit),
      prepaid_rent: n(values.prepaid_rent),

      // REQUIRED by API
      // annual_escalation_type: s((values as any).annual_escalation_type) || mappedAnnualEscType,
      annual_escalation_percent:
        (values as any).annual_escalation_percent != null
          ? n((values as any).annual_escalation_percent)
          : mappedAnnualEscPct,

      schedule_basis: s(values.schedule_basis),
      base_rent_schedule_rows: (values.base_rent_schedule_rows || [])
        .filter((r) => r.period || r.monthly_rent || r.rate_per_sf_year)
        .map((r) => {
          const inMonthly = n(r.monthly_rent);
          const inRate = n(r.rate_per_sf_year);
          const monthly = inMonthly ?? monthlyFromRate(inRate);
          const rate = inRate ?? rateFromMonthly(inMonthly);
          return {
            period: s(r.period),
            monthly_rent: monthly ?? 0,       // server demands presence
            rate_per_sf_year: rate ?? 0,      // keep both consistent
          };
        }),
    },

    // === STEP 5: OPERATIONS & MNTC ===
    OPERATIONS_MAINTENANCE: {
      lease_structure: s(values.lease_structure),
      audit_right: s(values.audit_right),
        gross_estimate_amount:s(values.gross_estimate_amount),

      cam_include_exclude: showPassThrough ? s(values.cam_include_exclude) : undefined,
      management_fee_cap_percent: showPassThrough ? n(values.management_fee_cap_percent) : undefined,
      capital_amortization_rules: showPassThrough ? s(values.capital_amortization_rules) : undefined,
      est_cam_per_sf: showPassThrough ? n(values.est_cam_per_sf) : undefined,
      est_taxes_per_sf: showPassThrough ? n(values.est_taxes_per_sf) : undefined,
      est_insurance_per_sf: showPassThrough ? n(values.est_insurance_per_sf) : undefined,
      nnn_est_annual: isNNN ? n(values.nnn_est_annual) : undefined,

      ...(Object.keys(insuranceObj).length ? { insurance: insuranceObj } : {}),

      maintenance_structural: capitalize(s(values.maintenance_structural)),
      maintenance_non_structural: capitalize(s(values.maintenance_non_structural)),
      maintenance_hvac: capitalize(s(values.maintenance_hvac)),
      maintenance_plumbing: capitalize(s(values.maintenance_plumbing)),
      maintenance_electrical: capitalize(s(values.maintenance_electrical)),
      maintenance_common_areas: capitalize(s(values.maintenance_common_areas)),
      maintenance_utilities: capitalize(s(values.maintenance_utilities)),
      maintenance_special_equipment: capitalize(s(values.maintenance_special_equipment)),

      hvac_contract_required: b(values.hvac_contract_required),

      service_hours: s(values.service_hours),
      vent_hood: b(values.vent_hood),
      grease_trap: b(values.grease_trap),
      utilities: arr(values.utilities),
      utility_responsibility: s(values.utility_responsibility),
    },

    // === STEP 6: RIGHTS / OPTIONS ===
    RIGHTS_OPTIONS_CONDITIONS: {
      permitted_use: s(values.permitted_use),
      prohibited_custom: b(values.prohibited_custom),
      prohibited_uses: b(values.prohibited_custom) ? s(values.prohibited_uses) : undefined,
      operating_hours: s(values.operating_hours),
      exclusive_requested: s(values.exclusive_requested),
      exclusive_description: values.exclusive_requested === "Yes" ? s(values.exclusive_description) : undefined,

      cotenancy_applicable: b(values.cotenancy_applicable),
      cotenancy_opening: b(values.cotenancy_applicable) ? s(values.cotenancy_opening) : undefined,
      cotenancy_ongoing: b(values.cotenancy_applicable) ? s(values.cotenancy_ongoing) : undefined,
      cotenancy_remedies: b(values.cotenancy_applicable) ? s(values.cotenancy_remedies) : undefined,

      rentEscalationType: s(values.rentEscalationType),
      rentEscalationPercent:
        values.rentEscalationType === "percent" ? n(values.rentEscalationPercent) : undefined,
      includeRenewalOption: b(values.includeRenewalOption),
      renewalOptionsCount: b(values.includeRenewalOption) ? n(values.renewalOptionsCount) : undefined,
      renewalYears: b(values.includeRenewalOption) ? n(values.renewalYears) : undefined,

      rofr_yes: s(values.rofr_yes),
      rofr_scope: values.rofr_yes === "Yes" ? s(values.rofr_scope) : undefined,

      ltp_yes: s(values.ltp_yes),
      ltp_terms_window_days: values.ltp_yes === "Yes" ? n(values.ltp_terms_window_days) : undefined,
      ltp_notes: values.ltp_yes === "Yes" ? s(values.ltp_notes) : undefined,

      subordination_automatic: s(values.subordination_automatic),
      non_disturbance_required: s(values.non_disturbance_required),
      nondisturbance_condition:
        values.non_disturbance_required === "Yes" ? s(values.nondisturbance_condition) : undefined,
      estoppel_delivery_days: n(values.estoppel_delivery_days),
    },

    // === STEP 7: ADMIN/MISC ===
    ADMIN_MISC: {
      confidentiality_required: b(values.confidentiality_required),
      exhibits: (values.exhibits || []).map((ex) => ({
        title: s(ex.title),
        notes: s(ex.notes),
        file: ex.file || null,
        previewUrl: ex.previewUrl || "",
      })),
    },
  };
}
