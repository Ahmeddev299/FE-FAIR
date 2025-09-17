// import { FormValues, Step } from '@/types/loi';
// import * as Yup from 'yup';

// /* -------------------- STEPS -------------------- */
// export const STEPS: Step[] = [
//   { id: 1, title: 'Basic Information', subtitle: 'Property and party details' },
//   { id: 2, title: 'Lease Terms', subtitle: 'Key lease particulars' },
//   { id: 3, title: 'Property Details', subtitle: 'Size and specifications' },
//   { id: 4, title: 'Additional Terms', subtitle: 'Deposit and timelines' },
//   { id: 5, title: 'Review & Submit', subtitle: 'Final review' }
// ];

// /* -------------------- INITIAL VALUES -------------------- */
// export const INITIAL_VALUES: FormValues = {
//   // Step 1
//   title: '',
//   addFileNumber: false,
//   doc_id: '',
//   propertyAddress: '',
//   landlordName: '',
//   landlordEmail: '',
//   tenantName: '',
//   tenantEmail: '',

//   // Step 2
//   rentAmount: '',
//   securityDeposit: '',
//   rentEsclation: '',   // keeping your original key
//   leaseDuration: '',
//   startDate: '',

//   // Step 3 (matches PropertyDetailsStep.tsx)
//   propertySize: '',
//   patio: '',
//   intendedUse: '',
//   exclusiveUse: '',
//   propertyType: '',
//   hasExtraSpace: false,
//   parkingSpaces: '',
//   prepaidRent: '',
//   utilities: {
//     electricity: false,
//     waterSewer: false,
//     naturalGas: false,
//     internetCable: false,
//     hvac: false,
//     securitySystem: false,
//     other: false,
//   },
//   leaseType: '',            // ✅ add this

//   // Step 4
//   rightOfFirstRefusal: false,
//   leaseToPurchase: false,
//   renewalOption: false,
//   improvementAllowance: '',
//   specialConditions: '',
//   financingApproval: false,
//   environmentalAssessment: false,
//   zoningCompliance: false,
//   permitsLicenses: false,
//   propertyInspection: false,
//   insuranceApproval: false,

//   // Step 5
//   terms: false,
// };

// /* -------------------- DTO SHAPE (aligned to UI) -------------------- */
// type LoiDTO = {
//   title?: string;
//   loiId : string,
//   propertyAddress?: string;
//   addFileNumber: boolean;
//   doc_id: string;
//   partyInfo?: {
//     landlord_name?: string;
//     landlord_email?: string;
//     tenant_name?: string;
//     tenant_email?: string;
//   };

//   leaseTerms?: {
//     monthlyRent?: string;
//     securityDeposit?: string;
//     leaseDuration?: string;
//     startDate?: string;       // ISO string
//     rentEsclation?: string;   // keep spelling to match backend
//     prepaidRent: string,
//     leaseType: string,
//     RentEscalation?: string;
//     PrepaidRent?: string;
//     LeaseType?: string;
//   };

//   propertyDetails?: {
//     propertySize?: string;
//     patio?: string;           // new field
//     intendedUse?: string;
//     exclusiveUse?: string;    // new field
//     propertyType?: string;
//     amenities?: string;       // Parking spaces (e.g., "8–10")
//     utilities?: string[];     // e.g., ["Electricity", "HVAC", "Other"]
//     hasExtraSpace?: boolean;  // new field (outer space checkbox)
//   };

//   additionalDetails?: {
//     tenantImprovement?: string;
//     renewalOption?: boolean;
//     specialConditions?: string;
//     contingencies?: string[];
//     rightOfFirstRefusal?: boolean; // NEW
//     leaseToPurchase?: boolean;     // NEW
//   };
// };

// /* -------------------- HELPERS -------------------- */
// const mapUtilitiesToBoolean = (list?: readonly string[]) => ({
//   electricity: !!list?.includes('Electricity'),
//   waterSewer: !!list?.includes('Water/Sewer'),
//   naturalGas: !!list?.includes('Natural Gas'),
//   internetCable: !!list?.includes('Internet/Cable'),
//   hvac: !!list?.includes('HVAC'),
//   securitySystem: !!list?.includes('Security System'),
//   other: !!list?.includes('Other'),
// });

// const normalizeParkingSpaces = (amenities?: unknown): string => {
//   if (!amenities) return '';
//   const str = String(amenities).trim();
//   return str; // keep ranges like "8–10" as-is (matches UI select)
// };

// /* -------------------- EDIT -> INITIAL VALUES -------------------- */
// export const EDIT_INITIAL_VALUES = (loi: LoiDTO): FormValues => ({
//   // Step 1
//   title: loi.title ?? '',
//   propertyAddress: loi.propertyAddress ?? '',
//   addFileNumber: !!loi.addFileNumber,
//   doc_id: loi?.loiId,

//   landlordName: loi.partyInfo?.landlord_name ?? '',
//   landlordEmail: loi.partyInfo?.landlord_email ?? '',
//   tenantName: loi.partyInfo?.tenant_name ?? '',
//   tenantEmail: loi.partyInfo?.tenant_email ?? '',

//   // Step 2
//   rentAmount: loi.leaseTerms?.monthlyRent ?? '',
//   securityDeposit: loi.leaseTerms?.securityDeposit ?? '',
//   leaseDuration: loi.leaseTerms?.leaseDuration ?? '',
//   leaseType: loi.leaseTerms?.leaseType ?? '',
//   rentEsclation: loi.leaseTerms?.RentEscalation ?? '',
//   startDate: (loi.leaseTerms?.startDate ?? '').split('T')[0] || '',
//   prepaidRent: loi.leaseTerms?.PrepaidRent ?? '',
//   // Step 3
//   propertySize: loi.propertyDetails?.propertySize ?? '',
//   patio: loi.propertyDetails?.patio ?? '',
//   intendedUse: loi.propertyDetails?.intendedUse ?? '',
//   exclusiveUse: loi.propertyDetails?.exclusiveUse ?? '',
//   propertyType: loi.propertyDetails?.propertyType ?? '',
//   hasExtraSpace: !!loi.propertyDetails?.hasExtraSpace,

//   parkingSpaces: normalizeParkingSpaces(loi.propertyDetails?.amenities),
//   utilities: mapUtilitiesToBoolean(loi.propertyDetails?.utilities),

//   // Step 4
//   improvementAllowance: loi.additionalDetails?.tenantImprovement ?? '',
//   renewalOption: !!loi.additionalDetails?.renewalOption,
//   specialConditions: loi.additionalDetails?.specialConditions ?? '',

//   financingApproval: !!loi.additionalDetails?.contingencies?.includes('Financing Approval'),
//   environmentalAssessment: !!loi.additionalDetails?.contingencies?.includes('Environmental Assessment'),
//   zoningCompliance: !!loi.additionalDetails?.contingencies?.includes('Zoning Compliance'),
//   permitsLicenses: !!loi.additionalDetails?.contingencies?.includes('Permits & Licenses'),
//   propertyInspection: !!loi.additionalDetails?.contingencies?.includes('Property Inspection'),
//   insuranceApproval: !!loi.additionalDetails?.contingencies?.includes('Insurance Approval'),

//   // 🔹 Add the two required booleans (default false)
//   rightOfFirstRefusal: !!loi.additionalDetails?.rightOfFirstRefusal,
//   leaseToPurchase: !!loi.additionalDetails?.leaseToPurchase,

//   // Step 5
//   terms: false,
// });

// /* -------------------- VALIDATION (matches UI) -------------------- */
// export const VALIDATION_SCHEMAS = {
//   // Step 1: You wanted proper validation – checkbox must be checked
//   1: Yup.object({
//     title: Yup.string().required('LOI Title is required'),
//     propertyAddress: Yup.string().required('Property Address is required'),
//     landlordName: Yup.string().required('Landlord Name is required'),
//     landlordEmail: Yup.string().email('Invalid email').required('Landlord Email is required'),
//     tenantName: Yup.string().required('Tenant Name is required'),
//     tenantEmail: Yup.string().email('Invalid email').required('Tenant Email is required'),
//   }),

//   // Step 2: keep only fields actually present in your Lease Terms step
//   2: Yup.object({
//     rentAmount: Yup.string().required('Monthly Rent is required'),
//     leaseType: Yup.string().required('Lease Type is required'), // ✅ add this
//     securityDeposit: Yup.string().required('Security Deposit is required'),
//     leaseDuration: Yup.string().required('Lease Duration is required'),
//     startDate: Yup.date().required('Start Date is required'),
//     // rentEsclation is optional in your UI – add .required(...) if you want it mandatory
//   }),

//   // Step 3: exactly the fields shown in PropertyDetailsStep.tsx
//   3: Yup.object({
//     propertySize: Yup.string().required('Property size is required'),
//     intendedUse: Yup.string().required('Intended use is required'),
//     exclusiveUse: Yup.string().required('Exclusive use is required'),
//     propertyType: Yup.string().required('Property type is required'),
//     parkingSpaces: Yup.string().required('Parking Spaces is required'),
//     patio: Yup.string(),          // optional text
//     hasExtraSpace: Yup.boolean(), // optional checkbox
//   }),

//   4: Yup.object({
//   }),
// };


// loi.config.ts (copy-paste this whole file)
// All types + constants aligned with your latest UI

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
  addFileNumber: boolean;

  // Step 2 (Lease Terms)
  rentAmount: string;                 // $/month (numeric in UI)
  prepaidRent: string;                // $
  securityDeposit: string;            // $
  leaseType: string;                  // string only
  leaseDuration: string;              // months (numeric in UI)
  rentEsclation: string;              // cadence in months (numeric in UI; keep key spelling)
  rentEscalationPercent: string;      // % 0..100 (numeric in UI)
  includeRenewalOption: boolean;      // checkbox to reveal the two fields below
  renewalOptionsCount: string;        // integer >= 1
  renewalYears: string;               // integer >= 1
  startDate: string;                  // yyyy-mm-dd

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
  utilities: {
    electricity: false,
    waterSewer: false,
    naturalGas: false,
    internetCable: false,
    hvac: false,
    securitySystem: false,
    other: false,
  },

  // Step 4
  renewalOption: false,
  renewalOptionDetails: "",
  rightOfFirstRefusal: false,
  rightOfFirstRefusalDetails: "",
  leaseToPurchase: false,
  leaseToPurchaseDetails: "",

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

/* -------------------- DTO SHAPE (aligned to backend) -------------------- */
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
  };

  leaseTerms?: {
    monthlyRent?: string;
    securityDeposit?: string;
    leaseDuration?: string;   // months
    startDate?: string;       // ISO string
    rentEsclation?: string;   // months (legacy spelling)
    prepaidRent?: string;
    leaseType?: string;
    // occasionally used (some payloads):
    RentEscalation?: string;
    PrepaidRent?: string;
    LeaseType?: string;
  };

  propertyDetails?: {
    propertySize?: string;
    patio?: string;
    intendedUse?: string;
    exclusiveUse?: string;
    propertyType?: string;
    amenities?: string;       // Parking spaces (e.g., "8–10")
    utilities?: string[];     // e.g., ["Electricity","HVAC"]
    hasExtraSpace?: boolean;
  };

  additionalDetails?: {
    tenantImprovement?: string;   // free text or "$/sf"
    renewalOption?: boolean;
    specialConditions?: string;
    contingencies?: string[];
    rightOfFirstRefusal?: boolean;
    leaseToPurchase?: boolean;
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

// Extract first numeric token from a string (e.g. "$12.50/sf" -> "12.50")
const extractAmount = (s?: string): string => {
  const m = String(s ?? "").match(/[\d,.]+/);
  return m ? m[0].replace(/,/g, "") : "";
};

/* -------------------- EDIT -> INITIAL VALUES -------------------- */
// export const EDIT_INITIAL_VALUES = (loi: LoiDTO): FormValues => ({
//   // Step 1
//   title: loi.title ?? "",
//   propertyAddress: loi.propertyAddress ?? "",
//   addFileNumber: !!loi.addFileNumber,
//   doc_id: loi?.loiId,

//   landlordName: loi.partyInfo?.landlord_name ?? "",
//   landlordEmail: loi.partyInfo?.landlord_email ?? "",
//   tenantName: loi.partyInfo?.tenant_name ?? "",
//   tenantEmail: loi.partyInfo?.tenant_email ?? "",

//   // Step 2
//   rentAmount: loi.leaseTerms?.monthlyRent ?? "",
//   prepaidRent: loi.leaseTerms?.prepaidRent ?? loi.leaseTerms?.PrepaidRent ?? "",
//   securityDeposit: loi.leaseTerms?.securityDeposit ?? "",
//   leaseType: loi.leaseTerms?.leaseType ?? loi.leaseTerms?.LeaseType ?? "",
//   leaseDuration: loi.leaseTerms?.leaseDuration ?? "",
//   rentEsclation:
//     loi.leaseTerms?.rentEsclation ?? loi.leaseTerms?.RentEscalation ?? "",
//   rentEscalationPercent: loi.leaseTerms.rentEscalationPercent,
//   includeRenewalOption: loi.leaseTerms.includeRenewalOption,
//   renewalOptionsCount: loi.leaseTerms.renewalOptionsCount,
//   renewalYears: loi.leaseTerms.renewalYears,
//   startDate: (loi.leaseTerms?.startDate ?? "").split("T")[0] || "",

//   // Step 3
//   propertySize: loi.propertyDetails?.propertySize ?? "",
//   hasExtraSpace: !!loi.propertyDetails?.hasExtraSpace,
//   patio: loi.propertyDetails?.patio ?? "",
//   intendedUse: loi.propertyDetails?.intendedUse ?? "",
//   exclusiveUse: loi.propertyDetails?.exclusiveUse ?? "",
//   propertyType: loi.propertyDetails?.propertyType ?? "",
//   parkingSpaces: normalizeParkingSpaces(loi.propertyDetails?.amenities),
//   utilities: mapUtilitiesToBoolean(loi.propertyDetails?.utilities),

//   // Step 4
//   renewalOption: !!loi.additionalDetails?.renewalOption,
//   renewalOptionDetails: "",
//   rightOfFirstRefusal: !!loi.additionalDetails?.rightOfFirstRefusal,
//   rightOfFirstRefusalDetails: "",
//   leaseToPurchase: !!loi.additionalDetails?.leaseToPurchase,
//   leaseToPurchaseDetails: "",

//   improvementAllowanceEnabled: !!loi.additionalDetails?.tenantImprovement,
//   improvementAllowanceAmount: extractAmount(
//     loi.additionalDetails?.tenantImprovement
//   ),
//   improvementAllowance: loi.additionalDetails?.tenantImprovement ?? "",
//   specialConditions: loi.additionalDetails?.specialConditions ?? "",

//   financingApproval: !!loi.additionalDetails?.contingencies?.includes(
//     "Financing Approval"
//   ),
//   environmentalAssessment: !!loi.additionalDetails?.contingencies?.includes(
//     "Environmental Assessment"
//   ),
//   zoningCompliance: !!loi.additionalDetails?.contingencies?.includes(
//     "Zoning Compliance"
//   ),
//   permitsLicenses: !!loi.additionalDetails?.contingencies?.includes(
//     "Permits & Licenses"
//   ),
//   propertyInspection: !!loi.additionalDetails?.contingencies?.includes(
//     "Property Inspection"
//   ),
//   insuranceApproval: !!loi.additionalDetails?.contingencies?.includes(
//     "Insurance Approval"
//   ),

//   additionalDetails : !!loi.additionalDetails?.Miscellaneous_items,

//   // Step 5
//   terms: false,
// });


export const EDIT_INITIAL_VALUES = (loi: LoiDTO): FormValues => {
  const lt = loi.leaseTerms ?? ({} as any);
  const pd = loi.propertyDetails ?? ({} as any);
  const ad = loi.additionalDetails ?? ({} as any);

  const misc: string[] = Array.isArray(ad.Miscellaneous_items) ? ad.Miscellaneous_items : [];

  const hasMisc = (label: string) => misc.includes(label);

  return {
    // Step 1
    title: loi.title ?? "",
    propertyAddress: loi.propertyAddress ?? "",
    addFileNumber: !!loi.addFileNumber,
    doc_id: loi?.loiId,

    landlordName: loi.partyInfo?.landlord_name ?? "",
    landlordEmail: loi.partyInfo?.landlord_email ?? "",
    tenantName: loi.partyInfo?.tenant_name ?? "",
    tenantEmail: loi.partyInfo?.tenant_email ?? "",

    // Step 2
    rentAmount: lt.monthlyRent ?? "",
    prepaidRent: lt.prepaidRent ?? lt.PrepaidRent ?? "",
    securityDeposit: lt.securityDeposit ?? "",
    leaseType: lt.leaseType ?? lt.LeaseType ?? "",
    leaseDuration: lt.leaseDuration ?? "",
    RentEscalation: lt.RentEscalation ?? lt.RentEscalation ?? "",
    rentEscalationPercent: lt.rentEscalationPercent ?? "",

    // renewal (your form keeps these at the ROOT)
    includeRenewalOption:
      // prefer explicit leaseTerms flag if present, else infer from Miscellaneous_items
      (lt.includeRenewalOption ?? hasMisc("Include renewal option in LOI")) || false,
    renewalOptionsCount: lt.renewalOptionsCount ?? "",
    renewalYears: lt.renewalYears ?? "",
    startDate: (lt.startDate ?? "").split("T")[0] || "",

    // Step 3
    propertySize: pd.propertySize ?? "",
    hasExtraSpace: !!pd.hasExtraSpace,
    patio: pd.patio ?? "",
    intendedUse: pd.intendedUse ?? "",
    exclusiveUse: pd.exclusiveUse ?? "",
    propertyType: pd.propertyType ?? "",
    parkingSpaces: normalizeParkingSpaces(pd.amenities),
    utilities: mapUtilitiesToBoolean(pd.utilities),

    // Step 4 — derive from Miscellaneous_items (array of strings)
    // Keep your own text fields empty unless you store them
    renewalOption: hasMisc("Include renewal option in LOI"),
    renewalOptionDetails: "",
    rightOfFirstRefusal: ad.rightOfFirstRefusal ?? hasMisc("Right of First Refusal"),
    rightOfFirstRefusalDetails: "",
    leaseToPurchase: ad.leaseToPurchase ?? hasMisc("Lease to Purchase"),
    leaseToPurchaseDetails: "",

    improvementAllowanceEnabled: !!ad.tenantImprovement,
    improvementAllowanceAmount: extractAmount(ad.tenantImprovement),
    improvementAllowance: ad.tenantImprovement ?? "",
    specialConditions: ad.specialConditions ?? "",

    // Contingencies booleans from array
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
