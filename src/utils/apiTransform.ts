// // // utils/apiTransform.ts
// // import type { LOIApiPayload } from '@/types/loi';
// // import { FormValues } from '../types/loi';

// import { FormValues } from "@/constants/formData";

// // export const transformToApiPayload = (values: FormValues, loiId?: string
// // ): LOIApiPayload => {
// //   const effectiveDocId = (loiId ?? values.doc_id)?.trim();

// //   console.log("values", values.renewalOption)
// //   const selectedUtilities = Object.entries(values.utilities || {})
// //     .filter(([, v]) => v === true)
// //     .map(([k]) => {
// //       const map: Record<string, string> = {
// //         electricity: 'Electricity',
// //         waterSewer: 'Water/Sewer',
// //         naturalGas: 'Natural Gas',
// //         internetCable: 'Internet/Cable',
// //         hvac: 'HVAC',
// //         securitySystem: 'Security System',
// //         other: 'Other',
// //       };
// //       return map[k] ?? k;
// //     });

// //   const contingencies: string[] = [];
// //   if (values.financingApproval) contingencies.push('Financing Approval');
// //   if (values.environmentalAssessment) contingencies.push('Environmental Assessment');
// //   if (values.zoningCompliance) contingencies.push('Zoning Compliance');
// //   if (values.permitsLicenses) contingencies.push('Permits & Licenses');
// //   if (values.propertyInspection) contingencies.push('Property Inspection');
// //   if (values.insuranceApproval) contingencies.push('Insurance Approval');

// //   const Miscellaneous_items: string[] = []

// //   if (values.renewalOption) Miscellaneous_items.push('Include renewal option in LOI');
// //   if (values.rightOfFirstRefusal) Miscellaneous_items.push('Right of First Refusal');
// //   if (values.leaseToPurchase) Miscellaneous_items.push('Lease to Purchase');

// //   const payload: LOIApiPayload = {
// //     title: values.title,
// //     propertyAddress: values.propertyAddress,
// //     addFileNumber: values.addFileNumber,
// //     ...(effectiveDocId ? { doc_id: effectiveDocId } : {}),

// //     partyInfo: {
// //       landlord_name: values.landlordName,
// //       landlord_email: values.landlordEmail,
// //       tenant_name: values.tenantName,
// //       tenant_email: values.tenantEmail,
// //     },

// //     leaseTerms: {
// //       monthlyRent: values.rentAmount,
// //       securityDeposit: values.securityDeposit,
// //       leaseType: values.leaseType,     // <-- REQUIRED: map from form
// //       leaseDuration: values.leaseDuration,
// //       startDate: values.startDate,
// //       RentEscalation: values.rentEsclation,
// //       // patio?: you can add here if your LOIApiPayload includes it
// //       PrepaidRent: values.prepaidRent
// //     },

// //     propertyDetails: {
// //       propertySize: values.propertySize,
// //       intendedUse: values.intendedUse,
// //       exclusiveUse: values.exclusiveUse,
// //       propertyType: values.propertyType,
// //       amenities: values.parkingSpaces ? [values.parkingSpaces] : [], // <-- array of range strings
// //       utilities: selectedUtilities,                                   // ["Electricity", ...]
// //       // hasExtraSpace/patio can be added if present in LOIApiPayload
// //       hasExtraSpace: values.hasExtraSpace,
// //       patio: values.patio
// //     },

// //     additionalDetails: {
// //       Miscellaneous_items: Miscellaneous_items, // boolean ✅
// //       tenantImprovement: values.improvementAllowance,
// //       specialConditions: values.specialConditions,
// //       contingencies,
// //     },

// //     submit_status: 'Submitted',
// //   };

// //   return payload;
// // };


// // utils/apiTransform.ts

// /* ---------- API payload type (update your '@/types/loi' to match) ---------- */
// export type LOIApiPayload = {
//   title: string;
//   propertyAddress: string;
//   addFileNumber: boolean;
//   doc_id?: string; // include only when present

//   partyInfo: {
//     landlord_name: string;
//     landlord_email: string;
//     tenant_name: string;
//     tenant_email: string;
//   };

//   leaseTerms: {
//     monthlyRent: string;             // $/mo
//     prepaidRent?: string;            // $
//     securityDeposit: string;         // $
//     leaseType: string;               // string only
//     leaseDuration: string;           // months
//     RentEscalation?: string;         // cadence in months
//     rentEscalationPercent?: string;  // percent (0..100)
//     startDate: string;               // ISO or yyyy-mm-dd
//     renewal?: {                      // present only when includeRenewalOption=true
//       options: number;               // e.g. 2
//       years: number;                 // e.g. 5
//     } | null;
//   };

//   propertyDetails: {
//     propertySize: string;        // sq ft
//     intendedUse: string;
//     exclusiveUse: string;
//     propertyType: string;
//     amenities: string[];         // parking (e.g., ["8–10"])
//     utilities: string[];         // ["Electricity", ...]
//     hasExtraSpace?: boolean;
//     patio?: string;
//   };

//   additionalDetails: {
//     // legacy/simple list (backend currently expects strings)
//     Miscellaneous_items: string[];   // ["Include renewal option in LOI", "Right of First Refusal", ...]
//     // optional richer details (safe to ignore server-side if not used)
//     Miscellaneous_details?: {
//       renewalOptionDetails?: string;
//       rightOfFirstRefusalDetails?: string;
//       leaseToPurchaseDetails?: string;
//     };

//     tenantImprovement?: string;  // either "$<amount> per square footage" or free text
//     specialConditions?: string;
//     contingencies: string[];     // from checkboxes

//     // keep individual booleans too if backend reads them
//     rightOfFirstRefusal?: boolean;
//     leaseToPurchase?: boolean;
//     renewalOption?: boolean;
//   };

//   submit_status: "Submitted" | "Draft";
// };

// /* ----------------- helpers ----------------- */
// const mapUtilitiesToLabels = (flags: FormValues["utilities"] = {} as any): string[] => {
//   const map: Record<string, string> = {
//     electricity: "Electricity",
//     waterSewer: "Water/Sewer",
//     naturalGas: "Natural Gas",
//     internetCable: "Internet/Cable",
//     hvac: "HVAC",
//     securitySystem: "Security System",
//     other: "Other",
//   };
//   return Object.entries(flags)
//     .filter(([, v]) => v === true)
//     .map(([k]) => map[k] ?? k);
// };

// const buildContingencies = (v: FormValues): string[] => {
//   const out: string[] = [];
//   if (v.financingApproval) out.push("Financing Approval");
//   if (v.environmentalAssessment) out.push("Environmental Assessment");
//   if (v.zoningCompliance) out.push("Zoning Compliance");
//   if (v.permitsLicenses) out.push("Permits & Licenses");
//   if (v.propertyInspection) out.push("Property Inspection");
//   if (v.insuranceApproval) out.push("Insurance Approval");
//   return out;
// };

// const buildMiscList = (v: FormValues): string[] => {
//   const list: string[] = [];
//   if (v.renewalOption) list.push("Include renewal option in LOI");
//   if (v.rightOfFirstRefusal) list.push("Right of First Refusal");
//   if (v.leaseToPurchase) list.push("Lease to Purchase");
//   return list;
// };

// const asNonEmpty = (s?: string | null) => (s && String(s).trim() !== "" ? String(s) : undefined);

// /* ----------------- main transform ----------------- */
// export const transformToApiPayload = (
//   values: FormValues,
//   loiId?: string
// ): LOIApiPayload => {
//   const effectiveDocId = (loiId ?? values.doc_id)?.trim();

//   // Utilities
//   const selectedUtilities = mapUtilitiesToLabels(values.utilities);

//   // Contingencies / Misc.
//   const contingencies = buildContingencies(values);
//   const miscItems = buildMiscList(values);

//   // Tenant Improvements: either numeric $/sf (toggle on) or free text fallback
//   const improvementText = values.improvementAllowanceEnabled
//     ? asNonEmpty(values.improvementAllowanceAmount)
//       ? `$${String(values.improvementAllowanceAmount).trim()} per square footage`
//       : undefined
//     : asNonEmpty(values.improvementAllowance);

//   // Renewal object inside leaseTerms only if checkbox is on
//   const renewalObj =
//     values.includeRenewalOption &&
//     values.renewalOptionsCount &&
//     values.renewalYears
//       ? {
//           options: Number(values.renewalOptionsCount),
//           years: Number(values.renewalYears),
//         }
//       : null;

//   const payload: LOIApiPayload = {
//     title: values.title,
//     propertyAddress: values.propertyAddress,
//     addFileNumber: !!values.addFileNumber,
//     ...(effectiveDocId ? { doc_id: effectiveDocId } : {}),

//     partyInfo: {
//       landlord_name: values.landlordName,
//       landlord_email: values.landlordEmail,
//       tenant_name: values.tenantName,
//       tenant_email: values.tenantEmail,
//     },

//     leaseTerms: {
//       monthlyRent: String(values.rentAmount ?? ""),
//       prepaidRent: asNonEmpty(values.prepaidRent),
//       securityDeposit: String(values.securityDeposit ?? ""),
//       leaseType: String(values.leaseType ?? ""),
//       leaseDuration: String(values.leaseDuration ?? ""),      // months
//       RentEscalation: asNonEmpty(values.rentEsclation),       // months
//       rentEscalationPercent: asNonEmpty(values.rentEscalationPercent),
//       startDate: String(values.startDate ?? ""),
//       renewal: renewalObj,
//     },

//     propertyDetails: {
//       propertySize: String(values.propertySize ?? ""),
//       intendedUse: String(values.intendedUse ?? ""),
//       exclusiveUse: String(values.exclusiveUse ?? ""),
//       propertyType: String(values.propertyType ?? ""),
//       amenities: values.parkingSpaces ? [values.parkingSpaces] : [],
//       utilities: selectedUtilities,
//       hasExtraSpace: values.hasExtraSpace || undefined,
//       patio: asNonEmpty(values.patio),
//     },

//     additionalDetails: {
//       Miscellaneous_items: miscItems,
//       Miscellaneous_details: {
//         renewalOptionDetails: asNonEmpty(values.renewalOptionDetails),
//         rightOfFirstRefusalDetails: asNonEmpty(values.rightOfFirstRefusalDetails),
//         leaseToPurchaseDetails: asNonEmpty(values.leaseToPurchaseDetails),
//       },
//       tenantImprovement: improvementText,
//       specialConditions: asNonEmpty(values.specialConditions),
//       contingencies,
//       // keep booleans for compatibility
//       rightOfFirstRefusal: values.rightOfFirstRefusal || undefined,
//       leaseToPurchase: values.leaseToPurchase || undefined,
//       renewalOption: values.renewalOption || undefined,
//     },

//     submit_status: "Submitted",
//   };

//   return payload;
// };

// utils/apiTransform.ts
// import { FormValues } from "@/constants/formData";
// import type { LOIApiPayload } from "@/types/loi";

// const UTIL_LABELS: Record<string, string> = {
//   electricity: "Electricity",
//   waterSewer: "Water/Sewer",
//   naturalGas: "Natural Gas",
//   internetCable: "Internet/Cable",
//   hvac: "HVAC",
//   securitySystem: "Security System",
//   other: "Other",
// };

// const mapUtilitiesToLabels = (flags: FormValues["utilities"] = {} as any): string[] =>
//   Object.entries(flags)
//     .filter(([, v]) => v === true)
//     .map(([k]) => UTIL_LABELS[k] ?? k);

// const buildContingencies = (v: FormValues): string[] => {
//   const out: string[] = [];
//   if (v.financingApproval) out.push("Financing Approval");
//   if (v.environmentalAssessment) out.push("Environmental Assessment");
//   if (v.zoningCompliance) out.push("Zoning Compliance");
//   if (v.permitsLicenses) out.push("Permits & Licenses");
//   if (v.propertyInspection) out.push("Property Inspection");
//   if (v.insuranceApproval) out.push("Insurance Approval");
//   return out;
// };

// const buildMiscList = (v: FormValues): string[] => {
//   const list: string[] = [];
//   if (v.renewalOption) list.push("Include renewal option in LOI");
//   if (v.rightOfFirstRefusal) list.push("Right of First Refusal");
//   if (v.leaseToPurchase) list.push("Lease to Purchase");
//   return list;
// };

// const nonEmpty = (s?: string | null) =>
//   s && String(s).trim() !== "" ? String(s).trim() : undefined;

// export const transformToApiPayload = (
//   values: FormValues,
//   loiId?: string
// ): LOIApiPayload => {
//   const effectiveDocId = (loiId ?? values.doc_id)?.trim();

//   const selectedUtilities = mapUtilitiesToLabels(values.utilities);
//   const contingencies = buildContingencies(values);
//   const miscItems = buildMiscList(values);
  

//   // Tenant Improvements string (your API expects a single text field)
//   const tenantImprovement =
//     values.improvementAllowanceEnabled && nonEmpty(values.improvementAllowanceAmount)
//       ? `$${values.improvementAllowanceAmount} per square footage`
//       : values.improvementAllowance || "";

//   const payload: LOIApiPayload = {
//     title: values.title || "",
//     propertyAddress: values.propertyAddress || "",
//     addFileNumber: !!values.addFileNumber,
//     ...(effectiveDocId ? { doc_id: effectiveDocId } : {}),

//     partyInfo: {
//       landlord_name: values.landlordName || "",
//       landlord_email: values.landlordEmail || "",
//       tenant_name: values.tenantName || "",
//       tenant_email: values.tenantEmail || "",
//     },

//     leaseTerms: {
//       monthlyRent: values.rentAmount || "",
//       securityDeposit: values.securityDeposit || "",
//       leaseType: values.leaseType || "",
//       leaseDuration: values.leaseDuration || "",
//       startDate: values.startDate || "",
//       RentEscalation: values.rentEsclation || "", // <— ALWAYS a string
//       prepaidRent: values.prepaidRent || "",      // <— ALWAYS a string
//     },

//     propertyDetails: {
//       propertySize: values.propertySize || "",
//       intendedUse: values.intendedUse || "",
//       exclusiveUse: values.exclusiveUse || "",
//       propertyType: values.propertyType || "",
//       hasExtraSpace: !!values.hasExtraSpace,
//       ...(nonEmpty(values.patio) ? { patio: values.patio } : {}),
//       amenities: values.parkingSpaces ? [values.parkingSpaces] : [],
//       utilities: selectedUtilities,
//     },

//     additionalDetails: {
//       Miscellaneous_items: miscItems,
//       tenantImprovement: tenantImprovement,               // always string (may be empty)
//       specialConditions: values.specialConditions || "",
//       contingencies,
//       ...(values.rightOfFirstRefusal ? { rightOfFirstRefusal: true } : {}),
//       ...(values.leaseToPurchase ? { leaseToPurchase: true } : {}),
//     },

//     submit_status: "Submitted",
//   };

//   return payload;
// };


// utils/apiTransform.ts
import { FormValues } from "@/constants/formData";
import type { LOIApiPayload } from "@/types/loi";

const UTIL_LABELS: Record<string, string> = {
  electricity: "Electricity",
  waterSewer: "Water/Sewer",
  naturalGas: "Natural Gas",
  internetCable: "Internet/Cable",
  hvac: "HVAC",
  securitySystem: "Security System",
  other: "Other",
};

const mapUtilitiesToLabels = (flags: FormValues["utilities"]): string[] =>
  Object.entries(flags)
    .filter(([, v]) => v === true)
    .map(([k]) => UTIL_LABELS[k] ?? k);

const buildContingencies = (v: FormValues): string[] => {
  const out: string[] = [];
  if (v.financingApproval) out.push("Financing Approval");
  if (v.environmentalAssessment) out.push("Environmental Assessment");
  if (v.zoningCompliance) out.push("Zoning Compliance");
  if (v.permitsLicenses) out.push("Permits & Licenses");
  if (v.propertyInspection) out.push("Property Inspection");
  if (v.insuranceApproval) out.push("Insurance Approval");
  return out;
};

const buildMiscList = (v: FormValues): string[] => {
  const list: string[] = [];
  if (v.includeRenewalOption) list.push("Include renewal option in LOI");
  if (v.rightOfFirstRefusal) list.push("Right of First Refusal");
  if (v.leaseToPurchase) list.push("Lease to Purchase");
  return list;
};

const nonEmpty = (s?: string | null) =>
  s && String(s).trim() !== "" ? String(s).trim() : undefined;

export const transformToApiPayload = (
  values: FormValues,
  loiId?: string
): LOIApiPayload => {
  const effectiveDocId = (loiId ?? values.doc_id)?.trim();

  const selectedUtilities = mapUtilitiesToLabels(values.utilities);
  const contingencies = buildContingencies(values);
  const miscItems = buildMiscList(values);

  // Tenant Improvements string for API
  const tenantImprovement =
    values.improvementAllowanceEnabled && nonEmpty(values.improvementAllowanceAmount)
      ? `$${values.improvementAllowanceAmount} per square footage`
      : values.improvementAllowance || "";

  const payload: LOIApiPayload = {
    title: values.title || "",
    propertyAddress: values.propertyAddress || "",
    addFileNumber: !!values.addFileNumber,
    ...(effectiveDocId ? { doc_id: effectiveDocId } : {}),

    partyInfo: {
      landlord_name: values.landlordName ,
      landlord_email: values.landlordEmail || "",
      tenant_name: values.tenantName ,
      tenant_email: values.tenantEmail || "",
    },

    leaseTerms: {
      monthlyRent: values.rentAmount || "",
      securityDeposit: values.securityDeposit || "",
      leaseType: values.leaseType || "",
      leaseDuration: values.leaseDuration || "",
      startDate: values.startDate || "",
      RentEscalation: values.RentEscalation || "",
      prepaidRent: values.prepaidRent || "",
      includeRenewalOption: !!values.includeRenewalOption,
      renewalYears: values.renewalYears || "",
      renewalOptionsCount: values.renewalOptionsCount || "",
    },

    propertyDetails: {
      propertySize: values.propertySize || "",
      intendedUse: values.intendedUse || "",
      exclusiveUse: values.exclusiveUse || "",
      propertyType: values.propertyType || "",
      hasExtraSpace: !!values.hasExtraSpace,
      ...(nonEmpty(values.patio) ? { patio: values.patio } : {}),
      amenities: values.parkingSpaces ? [values.parkingSpaces] : [],
      utilities: selectedUtilities,
    },

    additionalDetails: {
      Miscellaneous_items: miscItems,
      tenantImprovement,
      improvementAllowanceEnabled: !!values.improvementAllowanceEnabled,
      improvementAllowanceAmount: values.improvementAllowanceAmount || "",
      specialConditions: values.specialConditions || "",
      contingencies,
      ...(values.rightOfFirstRefusal ? { rightOfFirstRefusal: true } : {}),
      ...(values.leaseToPurchase ? { leaseToPurchase: true } : {}),
    },

    submit_status: "Submitted",
  };

  return payload;
};
