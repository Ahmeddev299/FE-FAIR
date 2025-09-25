import * as Yup from "yup";

/* -------------------- TYPES -------------------- */
export type Step = { id: number; title: string; subtitle: string };

export interface FormValues {
  // Step 1
  doc_id: string;
  title: string;
  propertyAddress: string;
  landlordName: string;
  landlordEmail: string;
  tenantName: string;
  tenantEmail: string;
  landlord_home_town_address: string;
  tenant_home_town_address: string;
  addFileNumber: boolean;

  // Step 2 (Lease Terms)
  rentAmount: string;                 // $/month (numeric in UI)
  prepaidRent: string;                // $Z
  securityDeposit: string;            // $
  leaseType: string;                  // string only
  leaseDuration: string;              // months (numeric in UI)
  rentEscalationPercent: string;      // % 0..100 (numeric in UI)
  includeRenewalOption: boolean;      // checkbox to reveal the two fields below
  renewalOptionsCount: string;        // integer >= 1
  renewalYears: string;               // integer >= 1
  startDate: string;                  // yyyy-mm-dd
  rentstartDate: string;
  deliveryCondition: string,
  maintenance: {
    structural: { landlord: boolean, tenant: boolean },
    nonStructural: { landlord: boolean, tenant: boolean },
    hvac: { landlord: boolean, tenant: boolean },
    plumbing: { landlord: boolean, tenant: boolean },
    electrical: { landlord: boolean, tenant: boolean },
    commonAreas: { landlord: boolean, tenant: boolean },
    utilities: { landlord: boolean, tenant: boolean },
    specialEquipment: { landlord: boolean, tenant: boolean },
  },

  // (kept for backend compatibility if other code references them)
  RentEscalation?: string;
  PrepaidRent?: string;
  LeaseType?: string;

  // Step 3 (Property Details)
  propertySize: string;               // sq ft (numeric in UI)
  hasExtraSpace: boolean;             // show Patio when true
  patio: string;                      // text, required only if hasExtraSpace
  intendedUse: string;
  exclusiveUse: string;
  propertyType: string;
  parkingSpaces: string;              // e.g. "8–10"
  utilities: {
    electricity: boolean;
    waterSewer: boolean;
    naturalGas: boolean;
    internetCable: boolean;
    hvac: boolean;
    securitySystem: boolean;
    other: boolean;
  };

  // Step 4 (Additional Terms)
  renewalOption: boolean;             // misc checkbox (separate from includeRenewalOption)
  renewalOptionDetails: string;

  rightOfFirstRefusal: boolean;
  rightOfFirstRefusalDetails: string;

  leaseToPurchase: boolean;
  leaseToPurchaseDetails: string;
  leaseToPurchaseDuration: string,

  improvementAllowanceEnabled: boolean;  // toggle
  improvementAllowanceAmount: string;    // $/sf amount (numeric in UI)

  improvementAllowance: string;          // legacy text field (kept for compatibility)
  specialConditions: string;

  financingApproval: boolean;
  environmentalAssessment: boolean;
  zoningCompliance: boolean;
  permitsLicenses: boolean;
  propertyInspection: boolean;
  insuranceApproval: boolean;

  // Step 5
  terms: boolean;
}

/* -------------------- STEPS -------------------- */
export const STEPS: Step[] = [
  { id: 1, title: "Basic Information", subtitle: "Property and party details" },
  { id: 2, title: "Lease Terms", subtitle: "Key lease particulars" },
  { id: 3, title: "Property Details", subtitle: "Size and specifications" },
  { id: 4, title: "Additional Terms", subtitle: "Options and conditions" },
  { id: 5, title: "Review & Submit", subtitle: "Final review" },
];

/* -------------------- INITIAL VALUES -------------------- */
export const INITIAL_VALUES: FormValues = {
  // Step 1
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

  // Step 2
  rentAmount: "",
  prepaidRent: "",
  securityDeposit: "",
  leaseType: "",
  leaseDuration: "",
  RentEscalation: "",
  rentEscalationPercent: "",
  includeRenewalOption: false,
  renewalOptionsCount: "",
  renewalYears: "",
  startDate: "",
  rentstartDate: "",

  // compat (unused by UI)
  PrepaidRent: undefined,
  LeaseType: undefined,

  // Step 3
  propertySize: "",
  hasExtraSpace: false,
  patio: "",
  intendedUse: "",
  exclusiveUse: "",
  propertyType: "",
  parkingSpaces: "",
  deliveryCondition: "", // required in validation
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

  // Step 5
  terms: false,
};


export type LoiDTO = {
  title?: string;
  loiId: string;
  propertyAddress?: string;
  addFileNumber: boolean;
  doc_id: string;

  partyInfo?: {
    landlord_name?: string;
    landlord_email?: string;
    tenant_name?: string;
    tenant_email?: string;

    // NEW: addresses
    landlord_home_town_address?: string;
    tenant_home_town_address?: string;
  };

  leaseTerms?: {
    monthlyRent?: string;
    securityDeposit?: string;
    leaseDuration?: string;   // months
    startDate?: string;       // ISO string
    rentstartDate?: string;
    prepaidRent?: string;
    leaseType?: string;

    // legacy/alt spellings
    RentEscalation?: string;
    PrepaidRent?: string;
    LeaseType?: string;

    // UI fields
    rentEscalationPercent?: string;
    includeRenewalOption?: boolean;
    renewalYears?: string;
    renewalOptionsCount?: string;
    rentEsclation?: string; // legacy misspelling
  };

  propertyDetails?: {
    propertySize?: string;
    patio?: string;
    intendedUse?: string;
    exclusiveUse?: string;   // now boolean in UI
    propertyType?: string;
    amenities?: string;       // Parking spaces (e.g., "8–10")
    utilities?: string[];     // e.g., ["Electricity","HVAC"]
    hasExtraSpace?: boolean;

    // NEW:
    deliveryCondition?: string; // "as_is" | "shell" | "vanilla_shell" | "turnkey" | "white_box"

    // NEW: maintenance responsibilities
    maintenance?: {
      structural?: { landlord?: boolean; tenant?: boolean };
      nonStructural?: { landlord?: boolean; tenant?: boolean };
      hvac?: { landlord?: boolean; tenant?: boolean };
      plumbing?: { landlord?: boolean; tenant?: boolean };
      electrical?: { landlord?: boolean; tenant?: boolean };
      commonAreas?: { landlord?: boolean; tenant?: boolean };
      utilities?: { landlord?: boolean; tenant?: boolean };
      specialEquipment?: { landlord?: boolean; tenant?: boolean };
    };
  };

  additionalDetails?: {
    tenantImprovement?: string;
    renewalOption?: boolean;
    specialConditions?: string;
    contingencies?: string[];
    rightOfFirstRefusal?: boolean;
    leaseToPurchase?: boolean;
    leaseToPurchaseDuration?: string;

    Miscellaneous_items?: string[];
    Miscellaneous_details?: {
      rightOfFirstRefusalDetails?: string;
      leaseToPurchaseDetails?: string;
    };
  };
};
/* -------------------- HELPERS -------------------- */
const mapUtilitiesToBoolean = (list?: readonly string[]) => ({
  electricity: !!list?.includes("Electricity"),
  waterSewer: !!list?.includes("Water/Sewer"),
  naturalGas: !!list?.includes("Natural Gas"),
  internetCable: !!list?.includes("Internet/Cable"),
  hvac: !!list?.includes("HVAC"),
  securitySystem: !!list?.includes("Security System"),
  other: !!list?.includes("Other"),
});

const normalizeParkingSpaces = (amenities?: unknown): string => {
  if (!amenities) return "";
  return String(amenities).trim();
};

type MaintenanceRowDTO = { landlord?: boolean; tenant?: boolean };

type MaintenanceDTO = Partial<Record<MaintKey, MaintenanceRowDTO>>;

/* Maintenance mappers */
const EMPTY_MAINT = {
  structural: { landlord: false, tenant: false },
  nonStructural: { landlord: false, tenant: false },
  hvac: { landlord: false, tenant: false },
  plumbing: { landlord: false, tenant: false },
  electrical: { landlord: false, tenant: false },
  commonAreas: { landlord: false, tenant: false },
  utilities: { landlord: false, tenant: false },
  specialEquipment: { landlord: false, tenant: false },
} as const;

type MaintKey = keyof typeof EMPTY_MAINT;
const mapMaintenanceFromDTO = (m?: MaintenanceDTO): FormValues["maintenance"] => {
  const src: MaintenanceDTO = m ?? {};

  const result = (Object.keys(EMPTY_MAINT) as MaintKey[]).reduce(
    (acc, k) => {
      const v = src[k] ?? {};
      acc[k] = {
        landlord: Boolean(v.landlord),
        tenant: Boolean(v.tenant),
      };
      return acc;
    },
    {} as Record<MaintKey, { landlord: boolean; tenant: boolean }>
  );

  return result;
};


// Extract first numeric token from a string (e.g. "$12.50/sf" -> "12.50")
const extractAmount = (s?: string): string => {
  const m = String(s ?? "").match(/[\d,.]+/);
  return m ? m[0].replace(/,/g, "") : "";
};

export const EDIT_INITIAL_VALUES = (loi: LoiDTO): FormValues => {
  const lt: NonNullable<LoiDTO["leaseTerms"]> = loi.leaseTerms ?? {};
  const pd: NonNullable<LoiDTO["propertyDetails"]> = loi.propertyDetails ?? {};
  const ad: NonNullable<LoiDTO["additionalDetails"]> = loi.additionalDetails ?? {};

  const misc: string[] = Array.isArray(ad.Miscellaneous_items) ? ad.Miscellaneous_items : [];
  const hasMisc = (label: string) => misc.includes(label);

  return {
    // Step 1
    title: loi.title ?? "",
    propertyAddress: loi.propertyAddress ?? "",
    addFileNumber: !!loi.addFileNumber,
    doc_id: loi.loiId,

    landlordName: loi.partyInfo?.landlord_name ?? "",
    landlordEmail: loi.partyInfo?.landlord_email ?? "",
    tenantName: loi.partyInfo?.tenant_name ?? "",
    tenantEmail: loi.partyInfo?.tenant_email ?? "",

    // NEW addresses
    landlord_home_town_address: loi.partyInfo?.landlord_home_town_address ?? "",
    tenant_home_town_address: loi.partyInfo?.tenant_home_town_address ?? "",

    // Step 2
    rentAmount: lt.monthlyRent ?? "",
    prepaidRent: lt.prepaidRent ?? lt.PrepaidRent ?? "",
    securityDeposit: lt.securityDeposit ?? "",
    leaseType: lt.leaseType ?? lt.LeaseType ?? "",
    leaseDuration: lt.leaseDuration ?? "",
    RentEscalation: lt.RentEscalation ?? lt.rentEsclation ?? "",
    rentEscalationPercent: lt.rentEscalationPercent ?? "",
    includeRenewalOption: (lt.includeRenewalOption ?? hasMisc("Include renewal option in LOI")) || false,
    renewalOptionsCount: lt.renewalOptionsCount ?? "",
    renewalYears: lt.renewalYears ?? "",
    startDate: (lt.startDate ?? "").split("T")[0] || "",
    rentstartDate: (lt.rentstartDate ?? "").split("T")[0] || "",

    // Step 3
    propertySize: pd.propertySize ?? "",
    hasExtraSpace: !!pd.hasExtraSpace,
    patio: pd.patio ?? "",
    intendedUse: pd.intendedUse ?? "",
    exclusiveUse: pd.exclusiveUse ?? "",
    propertyType: pd.propertyType ?? "",
    parkingSpaces: normalizeParkingSpaces(pd.amenities),
    deliveryCondition: pd.deliveryCondition ?? "",
    utilities: mapUtilitiesToBoolean(pd.utilities),
    maintenance: mapMaintenanceFromDTO(pd.maintenance),

    // Step 4 — derive from Miscellaneous_items
    renewalOption: hasMisc("Include renewal option in LOI"),
    renewalOptionDetails: "",
    rightOfFirstRefusal: ad.rightOfFirstRefusal ?? hasMisc("Right of First Refusal"),
    rightOfFirstRefusalDetails: "",
    leaseToPurchase: ad.leaseToPurchase ?? hasMisc("Lease to Purchase"),
    leaseToPurchaseDetails: "",
    leaseToPurchaseDuration: ad.leaseToPurchaseDuration ?? "", // coerce undefined -> false

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

    // Step 5
    terms: false,
  };
};


/* -------------------- VALIDATION (matches UI) -------------------- */
export const VALIDATION_SCHEMAS = {
  1: Yup.object({
    title: Yup.string().required("LOI Title is required"),
    propertyAddress: Yup.string().required("Property Address is required"),
    landlordName: Yup.string().required("Landlord Name is required"),
    landlordEmail: Yup.string()
      .email("Invalid email")
      .required("Landlord Email is required"),
    tenantName: Yup.string().required("Tenant Name is required"),
    tenantEmail: Yup.string()
      .email("Invalid email")
      .required("Tenant Email is required"),
  }),

  2: Yup.object({
    rentAmount: Yup.number()
      .typeError("Enter a valid amount")
      .min(0, "Must be ≥ 0")
      .required("Monthly Rent is required"),
    prepaidRent: Yup.number()
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

    rentEsclation: Yup.number()
      .typeError("Enter months between increases")
      .integer("Use whole months")
      .min(1, "Minimum 1 month")
      .max(600, "Keep under 600 months")
      .nullable(),

    rentEscalationPercent: Yup.number()
      .typeError("Enter a valid percent")
      .min(0, "Must be ≥ 0")
      .max(100, "Must be ≤ 100")
      .nullable(),

    includeRenewalOption: Yup.boolean(),
    renewalOptionsCount: Yup.number()
      .typeError("Enter a valid number")
      .integer("Use whole numbers")
      .min(1, "At least 1 option")
      .when("includeRenewalOption", {
        is: true,
        then: (s) => s.required("Required when renewal is included"),
        otherwise: (s) => s.strip(),
      }),
    renewalYears: Yup.number()
      .typeError("Enter a valid number")
      .integer("Use whole numbers")
      .min(1, "At least 1 year")
      .when("includeRenewalOption", {
        is: true,
        then: (s) => s.required("Required when renewal is included"),
        otherwise: (s) => s.strip(),
      }),

    startDate: Yup.date().required("Start Date is required"),
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
    // renewalOption: Yup.boolean(),
    // renewalOptionDetails: Yup.string().when("renewalOption", {
    //   is: true,
    //   then: (s) => s.min(2, "Please add details").required("Details required"),
    //   otherwise: (s) => s.strip(),
    // }),

    // rightOfFirstRefusal: Yup.boolean(),
    // rightOfFirstRefusalDetails: Yup.string().when("rightOfFirstRefusal", {
    //   is: true,
    //   then: (s) => s.min(2, "Please add details").required("Details required"),
    //   otherwise: (s) => s.strip(),
    // }),

    // leaseToPurchase: Yup.boolean(),
    // leaseToPurchaseDetails: Yup.string().when("leaseToPurchase", {
    //   is: true,
    //   then: (s) => s.min(2, "Please add details").required("Details required"),
    //   otherwise: (s) => s.strip(),
    // }),

    // improvementAllowanceEnabled: Yup.boolean(),
    // improvementAllowanceAmount: Yup.number()
    //   .typeError("Enter a valid amount")
    //   .min(0, "Must be ≥ 0")
    //   .when("improvementAllowanceEnabled", {
    //     is: true,
    //     then: (s) => s.required("Enter allowance amount"),
    //     otherwise: (s) => s.strip(),
    //   }),

    // specialConditions: Yup.string().nullable(),
    // financingApproval: Yup.boolean(),
    // environmentalAssessment: Yup.boolean(),
    // zoningCompliance: Yup.boolean(),
    // permitsLicenses: Yup.boolean(),
    // propertyInspection: Yup.boolean(),
    // insuranceApproval: Yup.boolean(),
  }),
  // If you want to force acceptance on Step 5, uncomment:
  // 5: Yup.object({
  //   terms: Yup.boolean().oneOf([true], "You must accept the terms to continue"),
  // }),
};
