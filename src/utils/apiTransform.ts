import { FormValues } from "@/constants/formData";
import type { LOIApiPayload } from "@/types/loi";


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

// This alias matches the DTO shape for a single row:
type MaintenanceRowDTO = { landlord?: boolean; tenant?: boolean };

// This is a partial map of all rows the backend may return:
type MaintenanceDTO = Partial<Record<MaintKey, MaintenanceRowDTO>>;

const mapMaintenanceToDTO = (m?: MaintenanceDTO): FormValues["maintenance"] => {
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
  if (v.includeRenewalOption || v.renewalOption) list.push("Include renewal option in LOI");
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
      landlord_name: values.landlordName,
      landlord_email: values.landlordEmail || "",
      tenant_name: values.tenantName,
      tenant_email: values.tenantEmail || "",
      // NEW
      ...(nonEmpty(values.landlord_home_town_address)
        ? { landlord_home_town_address: String(values.landlord_home_town_address).trim() }
        : {}),
      ...(nonEmpty(values.tenant_home_town_address)
        ? { tenant_home_town_address: String(values.tenant_home_town_address).trim() }
        : {}),
    },

    leaseTerms: {
      monthlyRent: values.rentAmount || "",
      securityDeposit: values.securityDeposit || "",
      leaseType: values.leaseType || "",
      leaseDuration: values.leaseDuration || "",
      startDate: values.startDate || "",
      rentstartDate:values.rentstartDate || "", 
      RentEscalation: values.RentEscalation || "",
      prepaidRent: values.prepaidRent || "",
      includeRenewalOption: !!values.includeRenewalOption,
      renewalYears: values.renewalYears || "",
      renewalOptionsCount: values.renewalOptionsCount || "",
      // keep if you need it server-side:
      ...(nonEmpty(values.rentEscalationPercent)
        ? { rentEscalationPercent: String(values.rentEscalationPercent).trim() }
        : {}),
    },

    propertyDetails: {
      propertySize: values.propertySize || "",
      intendedUse: values.intendedUse || "",
      exclusiveUse: !!values.exclusiveUse, // FIX: boolean
      propertyType: values.propertyType || "",
      hasExtraSpace: !!values.hasExtraSpace,
      ...(nonEmpty(values.patio) ? { patio: values.patio } : {}),
      amenities: values.parkingSpaces || "", // FIX: string, not array
      utilities: selectedUtilities,
      // NEW
      ...(nonEmpty(values.deliveryCondition)
        ? { deliveryCondition: String(values.deliveryCondition).trim() }
        : {}),
      maintenance: mapMaintenanceToDTO(values.maintenance),
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