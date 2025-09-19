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
