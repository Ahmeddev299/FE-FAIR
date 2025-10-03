// src/utils/apiTransform.ts
import type { FormValues, LOIApiPayload } from "@/types/loi";
import {
  buildContingencies,
  buildMiscList,
  mapMaintenanceToDTO,
  mapUtilitiesToLabels,
  nonEmpty,
} from "./mappers/loi";

/** Only the keys we actually add into leaseTerms from this block */
type EscalationPieces =
  Partial<NonNullable<LOIApiPayload["leaseTerms"]>> & {
    /** present when FMV is chosen (not part of LOIApiPayload but harmless to send) */
    escalationBasis?: "FMV";
    /** explicitly allow these optional keys even if LOIApiPayload doesn’t list them */
    rentEscalationType?: "percent" | "fmv";
    rentEscalationPercent?: string;
  };

/** Small helper to conditionally add a trimmed string prop */
const addIf = <K extends string>(key: K, val?: string) =>
  nonEmpty(val) ? ({ [key]: String(val).trim() } as Record<K, string>) : {};

/** Address fragments */
const propertyAddressFrom = (v: FormValues) => ({
  ...addIf("property_address_S1", v.property_address_S1),
  ...addIf("property_address_S2", v.property_address_S2),
  ...addIf("property_city", v.property_city),
  ...addIf("property_state", v.property_state),
  ...addIf("property_zip", v.property_zip),
});

const landlordAddressFrom = (v: FormValues) => ({
  ...addIf("landlord_address_S1", v.landlord_address_S1),
  ...addIf("landlord_address_S2", v.landlord_address_S2),
  ...addIf("landlord_city", v.landlord_city),
  ...addIf("landlord_state", v.landlord_state),
  ...addIf("landlord_zip", v.landlord_zip),
});

const tenantAddressFrom = (v: FormValues) => ({
  ...addIf("tenant_address_S1", v.tenant_address_S1),
  ...addIf("tenant_address_S2", v.tenant_address_S2),
  ...addIf("tenant_city", v.tenant_city),
  ...addIf("tenant_state", v.tenant_state),
  ...addIf("tenant_zip", v.tenant_zip),
});

/** Build the escalation subset with proper typing and without `any` */
const buildEscalationPieces = (v: FormValues): EscalationPieces => {
  const out: EscalationPieces = {
    RentEscalation: v.RentEscalation || "",
    rentEscalationType: (v.rentEscalationType as "percent" | "fmv") || "percent",
  };

  if (v.rentEscalationType === "percent" && nonEmpty(v.rentEscalationPercent)) {
    out.rentEscalationPercent = String(v.rentEscalationPercent).trim();
  } else {
    // helpful extra flag for backends that look for FMV explicitly
    out.escalationBasis = "FMV";
  }

  return out;
};

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
      ? values.improvementAllowanceAmount
      : values.improvementAllowance || "";

  // Address fragments
  const propertyAddress = propertyAddressFrom(values);
  const landlordAddress = landlordAddressFrom(values);
  const tenantAddress = tenantAddressFrom(values);

  // Escalation
  const escalationPieces = buildEscalationPieces(values);

  const payload: LOIApiPayload = {
    title: values.title || "",
    ...propertyAddress, // structured property address
    addFileNumber: !!values.addFileNumber,
    ...(effectiveDocId ? { doc_id: effectiveDocId } : {}),

    partyInfo: {
      landlord_name: values.landlordName,
      landlord_email: values.landlordEmail || "",
      tenant_name: values.tenantName,
      tenant_email: values.tenantEmail || "",

      // legacy single-line (only include when not empty)
      ...addIf("landlord_home_town_address", values.landlord_home_town_address),
      ...addIf("tenant_home_town_address", values.tenant_home_town_address),

      // structured
      ...landlordAddress,
      ...tenantAddress,
    },

    leaseTerms: {
      monthlyRent: values.rentAmount || "",
      securityDeposit: values.securityDeposit || "",
      leaseType: values.leaseType || "",
      leaseDuration: values.leaseDuration || "",
      startDate: values.startDate || "",
      rentstartDate: values.rentstartDate || "",
      prepaidRent: values.prepaidRent || "",
      includeRenewalOption: !!values.includeRenewalOption,
      renewalYears: values.renewalYears || "",
      renewalOptionsCount: values.renewalOptionsCount || "",
      rentStartMode : values.rentStartMode || "",

      // if your form adds this when “Percentage Lease” is selected
      ...(nonEmpty(values.percentageLeasePercent)
        ? { percentageLeasePercent: String(values.percentageLeasePercent) }
        : {}),

      ...escalationPieces,
    },

    propertyDetails: {
      propertySize: values.propertySize || "",
      intendedUse: values.intendedUse || "",
      exclusiveUse: values.exclusiveUse,
      propertyType: values.propertyType || "",
      hasExtraSpace: !!values.hasExtraSpace,
      ...(nonEmpty(values.patio) ? { patio: values.patio } : {}),
      amenities: values.parkingSpaces || "",
      utilities: selectedUtilities,
      ...(nonEmpty(values.deliveryCondition)
        ? { deliveryCondition: String(values.deliveryCondition).trim() }
        : {}),
      maintenance: mapMaintenanceToDTO(values.maintenance),
    },

    additionalDetails: {
      Miscellaneous_items: miscItems,
      tenantImprovement,
      leaseToPurchaseDuration: values.leaseToPurchaseDuration || "",
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
