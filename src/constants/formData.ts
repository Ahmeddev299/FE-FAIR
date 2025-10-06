import { FormValues, LoiDTO, Step } from "@/types/loi";
import * as Yup from "yup";
import { extractAmount, mapMaintenanceFromDTO, mapUtilitiesToBoolean, normalizeParkingSpaces, parseSingleLineAddress,  ZIP_5_9 } from "./helpers";

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

  PrepaidRent: undefined,
  LeaseType: undefined,

  propertySize: "",
  hasExtraSpace: false,
  patio: "",
  patioSize:"",
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
