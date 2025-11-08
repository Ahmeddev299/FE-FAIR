// types/lease.ts - Clean LeaseFormValues with only used fields

import { FormValues, LoiDTO, Step } from "@/types/loi";
import * as Yup from "yup";
import { extractAmount, mapMaintenanceFromDTO, mapUtilitiesToBoolean, normalizeParkingSpaces, parseSingleLineAddress, ZIP_5_9 } from "./helpers";

type RentStartMode = "all" | "base-only";

export const STEPS: Step[] = [
  { id: 1, title: "Basic Information", subtitle: "Property and party details" },
  { id: 2, title: "Lease Terms", subtitle: "Key lease particulars" },
  { id: 3, title: "Property Details", subtitle: "Size and specifications" },
  { id: 4, title: "Additional Terms", subtitle: "Options and conditions" },
  { id: 5, title: "Review & Submit", subtitle: "Final review" },
];

export const INITIAL_VALUES: FormValues = {
  title: "",
  addFileNumber: false,
  doc_id: "",
  propertyAddress: "",
  landlordName: "",
  landlordEmail: "",
  tenantName: "",
  tenantEmail: "",
  landlord_home_town_address: "",
  tenant_home_town_address: "",

  property_address_S1: "", property_address_S2: "",
  property_city: "", property_state: "", property_zip: "",

  landlord_address_S1: "", landlord_address_S2: "",
  landlord_city: "", landlord_state: "", landlord_zip: "",

  tenant_address_S1: "", tenant_address_S2: "",
  tenant_city: "", tenant_state: "", tenant_zip: "",

  rentAmount: "",
  prepaidRent: "",
  securityDeposit: "",
  leaseType: "",
  leaseDuration: "",
  RentEscalation: "",
  rentEscalationPercent: "",
  rentEscalationType: "percent",
  includeRenewalOption: false,
  renewalOptionsCount: "",
  renewalYears: "",
  startDate: "",
  rentstartDate: "",
  rentStartMode: "all" as RentStartMode, // All Rent (default)
  percentageLeasePercent: "", // % of gross sales revenue for Percentage Lease
  tenantImprovement_check: false,
  PrepaidRent: undefined,
  escalationBasis: "",
  LeaseType: undefined,

  propertySize: "",
  hasExtraSpace: false,
  patio: "",
  patioSize: "",
  intendedUse: "",
  exclusiveUse: "",
  propertyType: "",
  parkingSpaces: "",
  deliveryCondition: "",
  utilities: {
    electricity: false,
    waterSewer: false,
    naturalGas: false,
    internetCable: false,
    hvac: false,
    securitySystem: false,
    other: false,
  },
  maintenance: {
    structural: { landlord: false, tenant: false },
    nonStructural: { landlord: false, tenant: false },
    hvac: { landlord: false, tenant: false },
    plumbing: { landlord: false, tenant: false },
    electrical: { landlord: false, tenant: false },
    commonAreas: { landlord: false, tenant: false },
    utilities: { landlord: false, tenant: false },
    specialEquipment: { landlord: false, tenant: false },
  },

  // Step 4
  renewalOption: false,
  renewalOptionDetails: "",
  rightOfFirstRefusal: false,
  rightOfFirstRefusalDetails: "",
  leaseToPurchase: false,
  leaseToPurchaseDetails: "",
  leaseToPurchaseDuration: "",

  improvementAllowanceEnabled: false,
  improvementAllowanceAmount: "",
  improvementAllowance: "",

  specialConditions: "",
  financingApproval: false,
  environmentalAssessment: false,
  zoningCompliance: false,
  permitsLicenses: false,
  propertyInspection: false,
  insuranceApproval: false,

  terms: false,
};


export const EDIT_INITIAL_VALUES = (loi: LoiDTO): FormValues => {
  const lt = loi.leaseTerms ?? {};
  const pd = loi.propertyDetails ?? {};
  const ad = loi.additionalDetails ?? {};

  const explicitType = lt.rentEscalationType as ("percent" | "fmv") | undefined;
  const hasPct = String(lt.rentEscalationPercent ?? "").trim() !== "";
  const rentEscalationType: "percent" | "fmv" = explicitType ?? (hasPct ? "percent" : "fmv");

  const propStruct = {
    property_address_S1: loi.property_address_S1 ?? "",
    property_address_S2: loi.property_address_S2 ?? "",
    property_city: loi.property_city ?? "",
    property_state: loi.property_state ?? "",
    property_zip: loi.property_zip ?? "",
  };
  const propNeedsParse =
    !propStruct.property_address_S1 &&
    !propStruct.property_city &&
    !propStruct.property_state &&
    !propStruct.property_zip;

  const parsedLegacy = propNeedsParse ? parseSingleLineAddress(loi.propertyAddress) : {
    property_address_S1: "",
    property_address_S2: "",
    property_city: "",
    property_state: "",
    property_zip: "",
  };

  const pi = loi.partyInfo ?? {};

  return {
    // ---------- Step 1 ----------
    title: loi.title ?? "",
    addFileNumber: !!loi.addFileNumber,
    doc_id: loi.loiId,

    propertyAddress: loi.propertyAddress ?? "",

    property_address_S1: propStruct.property_address_S1 || parsedLegacy.property_address_S1,
    property_address_S2: propStruct.property_address_S2 || parsedLegacy.property_address_S2,
    property_city: propStruct.property_city || parsedLegacy.property_city,
    property_state: propStruct.property_state || parsedLegacy.property_state,
    property_zip: propStruct.property_zip || parsedLegacy.property_zip,

    landlordName: pi.landlord_name ?? "",
    landlordEmail: pi.landlord_email ?? "",
    tenantName: pi.tenant_name ?? "",
    tenantEmail: pi.tenant_email ?? "",

    landlord_home_town_address: pi.landlord_home_town_address ?? "",
    tenant_home_town_address: pi.tenant_home_town_address ?? "",

    landlord_address_S1: pi.landlord_address_S1 ?? "",
    landlord_address_S2: pi.landlord_address_S2 ?? "",
    landlord_city: pi.landlord_city ?? "",
    landlord_state: pi.landlord_state ?? "",
    landlord_zip: pi.landlord_zip ?? "",

    tenant_address_S1: pi.tenant_address_S1 ?? "",
    tenant_address_S2: pi.tenant_address_S2 ?? "",
    tenant_city: pi.tenant_city ?? "",
    tenant_state: pi.tenant_state ?? "",
    tenant_zip: pi.tenant_zip ?? "",

    rentAmount: lt.monthlyRent ?? "",
    prepaidRent: lt.prepaidRent ?? lt.PrepaidRent ?? "",
    securityDeposit: lt.securityDeposit ?? "",
    leaseType: lt.leaseType ?? lt.LeaseType ?? "",
    leaseDuration: lt.leaseDuration ?? "",
    RentEscalation: lt.RentEscalation ?? lt.rentEsclation ?? "",
    rentEscalationPercent: lt.rentEscalationPercent ?? "",
    rentEscalationType,
    percentageLeasePercent: lt.percentageLeasePercent ?? "",// % of gross sales revenue for Percentage Lease

    includeRenewalOption: !!lt.includeRenewalOption,
    renewalOptionsCount: lt.renewalOptionsCount ?? "",
    renewalYears: lt.renewalYears ?? "",
    escalationBasis: lt.escalationBasis ?? "",
    startDate: (lt.startDate ?? "").split("T")[0] || "",
    rentstartDate: (lt.rentstartDate ?? "").split("T")[0] || "",
    rentStartMode: (lt.rentStartMode ?? "").split("T")[0] || "",

    propertySize: pd.propertySize ?? "",
    hasExtraSpace: !!pd.hasExtraSpace,
    patio: pd.patio ?? "",
    patioSize: pd.patioSize ?? "",
    intendedUse: pd.intendedUse ?? "",
    exclusiveUse: pd.exclusiveUse ?? "",
    propertyType: pd.propertyType ?? "",
    parkingSpaces: normalizeParkingSpaces(pd.amenities),
    deliveryCondition: pd.deliveryCondition ?? "",
    utilities: mapUtilitiesToBoolean(pd.utilities),
    maintenance: mapMaintenanceFromDTO(pd.maintenance),

    renewalOption: !!ad.renewalOption,
    renewalOptionDetails: "",
    rightOfFirstRefusal: !!ad.rightOfFirstRefusal,
    rightOfFirstRefusalDetails: "",
    leaseToPurchase: !!ad.leaseToPurchase,
    leaseToPurchaseDetails: "",
    leaseToPurchaseDuration: ad.leaseToPurchaseDuration ?? "",

    improvementAllowanceEnabled: !!ad.tenantImprovement,
    improvementAllowanceAmount: extractAmount(ad.tenantImprovement),
    improvementAllowance: ad.tenantImprovement ?? "",
    specialConditions: ad.specialConditions ?? "",

    financingApproval: !!ad.contingencies?.includes("Financing Approval"),
    environmentalAssessment: !!ad.contingencies?.includes("Environmental Assessment"),
    zoningCompliance: !!ad.contingencies?.includes("Zoning Compliance"),
    permitsLicenses: !!ad.contingencies?.includes("Permits & Licenses"),
    propertyInspection: !!ad.contingencies?.includes("Property Inspection"),
    insuranceApproval: !!ad.contingencies?.includes("Insurance Approval"),
    tenantImprovement_check: ad.tenantImprovement_check ? true : false,

    terms: false,
  };
};

export const VALIDATION_SCHEMAS = {
  1: Yup.object({
    title: Yup.string().required("LOI Title is required"),

    property_address_S1: Yup.string().trim().required("Street Address Line 1 is required"),
    property_address_S2: Yup.string().trim().nullable(),
    property_city: Yup.string().trim().required("City is required"),
    property_state: Yup.string()
      .trim()
      .required("State is required"),
    property_zip: Yup.string()
      .trim()
      .matches(ZIP_5_9, "Use 12345 or 12345-6789")
      .required("ZIP is required"),

    landlordName: Yup.string().trim().required("Landlord Name is required"),
    landlordEmail: Yup.string().trim().email("Invalid email").required("Landlord Email is required"),
    tenantName: Yup.string().trim().required("Tenant Name is required"),
    tenantEmail: Yup.string().trim().email("Invalid email").required("Tenant Email is required"),

    landlord_address_S1: Yup.string().trim().required("Landlord street is required"),
    landlord_address_S2: Yup.string().trim().nullable(),
    landlord_city: Yup.string().trim().required("Landlord city is required"),
    landlord_state: Yup.string().trim().required("Landlord state is required"),
    landlord_zip: Yup.string().trim().matches(ZIP_5_9, "Invalid ZIP").required("Landlord ZIP is required"),

    tenant_address_S1: Yup.string().trim().required("Tenant street is required"),
    tenant_address_S2: Yup.string().trim().nullable(),
    tenant_city: Yup.string().trim().required("Tenant city is required"),
    tenant_state: Yup.string().trim().required("Tenant state is required"),
    tenant_zip: Yup.string().trim().matches(ZIP_5_9, "Invalid ZIP").required("Tenant ZIP is required"),
  }),

  2: Yup.object({
    rentAmount: Yup.number()
      .typeError("Enter a valid amount")
      .min(0, "Must be ≥ 0")
      .required("Monthly Rent is required"),

    prepaidRent: Yup.number()
      .transform((val, orig) => (orig === "" || orig == null ? undefined : val))
      .typeError("Enter a valid amount")
      .min(0, "Must be ≥ 0")
      .nullable(),

    securityDeposit: Yup.number()
      .typeError("Enter a valid amount")
      .min(0, "Must be ≥ 0")
      .required("Security Deposit is required"),

    leaseType: Yup.string().required("Lease Type is required"),

    leaseDuration: Yup.number()
      .typeError("Enter duration in months")
      .integer("Use whole months")
      .min(1, "Minimum 1 month")
      .max(600, "Keep under 600 months")
      .required("Lease Duration is required"),

    RentEscalation: Yup.number()
      .transform((val, orig) => (orig === "" || orig == null ? undefined : val))
      .typeError("Enter months between increases")
      .integer("Use whole months")
      .min(1, "Minimum 1 month")
      .max(600, "Keep under 600 months")
      .required("Rent escalation (months) is required"),

    rentEscalationType: Yup.mixed<"percent" | "fmv">()
      .oneOf(["percent", "fmv"])
      .required("Choose an escalation type"),

    rentEscalationPercent: Yup.number()
      .transform((val, orig) => (orig === "" || orig == null ? undefined : val))
      .when("rentEscalationType", {
        is: "percent",
        then: (s) =>
          s.typeError("Enter a valid percent")
            .min(0, "Must be ≥ 0")
            .max(100, "Must be ≤ 100")
            .required("Rent escalation % is required"),
        otherwise: (s) => s.strip(),
      }),

    includeRenewalOption: Yup.boolean(),

    renewalOptionsCount: Yup.number()
      .transform((val, orig) => (orig === "" || orig == null ? undefined : val))
      .typeError("Enter a valid number")
      .integer("Use whole numbers")
      .min(1, "At least 1 option")
      .when("includeRenewalOption", {
        is: true,
        then: (s) => s.required("Required when renewal is included"),
        otherwise: (s) => s.strip(),
      }),

    renewalYears: Yup.number()
      .transform((val, orig) => (orig === "" || orig == null ? undefined : val))
      .typeError("Enter a valid number")
      .integer("Use whole numbers")
      .min(1, "At least 1 year")
      .when("includeRenewalOption", {
        is: true,
        then: (s) => s.required("Required when renewal is included"),
        otherwise: (s) => s.strip(),
      }),

    startDate: Yup.date().required("Start Date is required"),
    rentstartDate: Yup.date().nullable(),
    percentageLeasePercent: Yup.number()
      .transform((val, orig) => (orig === "" || orig == null ? undefined : val))
      .when("leaseType", {
        is: "Percentage Lease",
        then: (s) =>
          s
            .typeError("Enter a valid percent")
            .min(0, "Must be ≥ 0")
            .max(100, "Must be ≤ 100")
            .required("Enter % of gross sales revenue"),
        otherwise: (s) => s.strip(), // remove from submission for other lease types
      }),
  }),

  3: Yup.object({
    propertySize: Yup.number()
      .typeError("Enter a valid number")
      .min(0, "Must be ≥ 0")
      .required("Property size is required"),
    hasExtraSpace: Yup.boolean(),
    patio: Yup.string().when("hasExtraSpace", {
      is: true,
      then: (s) => s.min(2, "Please describe the outer space").required("Patio is required"),
      otherwise: (s) => s.strip(),
    }),
    intendedUse: Yup.string().required("Intended use is required"),
    exclusiveUse: Yup.string().required("Exclusive use is required"),
    propertyType: Yup.string().required("Property type is required"),
    parkingSpaces: Yup.string().required("Parking Spaces is required"),
  }),

  4: Yup.object({
    rightOfFirstRefusal: Yup.boolean().default(false),

    leaseToPurchase: Yup.boolean().default(false),
    improvementAllowanceEnabled: Yup.boolean().default(false),

    leaseToPurchaseDuration: Yup.number()
      .transform((val, orig) => (orig === "" || orig == null ? undefined : val))
      .when("leaseToPurchase", {
        is: true,
        then: (schema) =>
          schema
            .typeError("Enter a valid number")
            .required("Duration is required")
            .moreThan(0, "Must be greater than 0"),
        otherwise: (schema) => schema.notRequired(),
      }),

    leaseToPurchaseDurationUnit: Yup.string()
      .default("months")
      .notRequired(),

    improvementAllowanceAmount: Yup.number()
      .transform((val, orig) => (orig === "" || orig == null ? undefined : val))
      .when("improvementAllowanceEnabled", {
        is: true,
        then: (schema) =>
          schema
            .typeError("Enter a valid amount")
            .required("Amount is required")
            .moreThan(0, "Must be greater than 0"),
        otherwise: (schema) => schema.notRequired(),
      }),

    specialConditions: Yup.string().nullable(),

    financingApproval: Yup.boolean().default(false),
    environmentalAssessment: Yup.boolean().default(false),
    zoningCompliance: Yup.boolean().default(false),
    permitsLicenses: Yup.boolean().default(false),
    propertyInspection: Yup.boolean().default(false),
    insuranceApproval: Yup.boolean().default(false),
  }),
};


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
  reserved_spaces: number | string;

  // === STEP 3: TERM, TIMING & TRIGGERS ===
  initial_term_years: number | string;
  delivery_condition: string;
  commencement_trigger: string;
  commencement_date_certain: string;
  rent_commencement_offset_days: number | string;

  // === STEP 4: RENT & ECONOMICS ===
  rent_type: string; // "Fixed" | "Percent"
  monthly_rent: number | string;
  security_deposit: number | string;
  prepaid_rent: number | string;
  percentage_lease_percent: number | string;

  // Base Rent Schedule
  base_rent_schedule: string; // new

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
  audit_right: boolean;
  gross_estimate_amount: number;
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
  submit_status:string;
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
  base_rent_schedule: "",


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
  reserved_spaces: "",

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
  audit_right: false,
  gross_estimate_amount: 0,

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
    submit_status:""

};