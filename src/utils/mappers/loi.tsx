/* ---------- helpers ---------- */

import { FormValues } from "@/types/loi";

export type MaintKey = keyof typeof EMPTY_MAINT;
export type MaintenanceRowDTO = { landlord?: boolean; tenant?: boolean };
export type MaintenanceDTO = Partial<Record<MaintKey, MaintenanceRowDTO>>;

export const nonEmpty = (s?: string | null) =>
  s && String(s).trim() !== "" ? String(s).trim() : undefined;

export const EMPTY_MAINT = {
  structural: { landlord: false, tenant: false },
  nonStructural: { landlord: false, tenant: false },
  hvac: { landlord: false, tenant: false },
  plumbing: { landlord: false, tenant: false },
  electrical: { landlord: false, tenant: false },
  commonAreas: { landlord: false, tenant: false },
  utilities: { landlord: false, tenant: false },
  specialEquipment: { landlord: false, tenant: false },
} as const;

export const UTIL_LABELS: Record<string, string> = {
  electricity: "Electricity",
  waterSewer: "Water/Sewer",
  naturalGas: "Natural Gas",
  internetCable: "Internet/Cable",
  hvac: "HVAC",
  securitySystem: "Security System",
  other: "Other",
};

export const mapUtilitiesToLabels = (flags: FormValues["utilities"]): string[] =>
  Object.entries(flags)
    .filter(([, v]) => v === true)
    .map(([k]) => UTIL_LABELS[k] ?? k);

export const buildContingencies = (v: FormValues): string[] => {
  const out: string[] = [];
  if (v.financingApproval) out.push("Financing Approval");
  if (v.environmentalAssessment) out.push("Environmental Assessment");
  if (v.zoningCompliance) out.push("Zoning Compliance");
  if (v.permitsLicenses) out.push("Permits & Licenses");
  if (v.propertyInspection) out.push("Property Inspection");
  if (v.insuranceApproval) out.push("Insurance Approval");
  return out;
};

export const buildMiscList = (v: FormValues): string[] => {
  const list: string[] = [];
  if (v.rightOfFirstRefusal) list.push("Right of First Refusal");
  if (v.leaseToPurchase) list.push("Lease to Purchase");
  return list;
};

export const mapMaintenanceToDTO = (m?: MaintenanceDTO): FormValues["maintenance"] => {
  const src: MaintenanceDTO = m ?? {};
  const result = (Object.keys(EMPTY_MAINT) as MaintKey[]).reduce((acc, k) => {
    const v = src[k] ?? {};
    acc[k] = {
      landlord: Boolean(v.landlord),
      tenant: Boolean(v.tenant),
    };
    return acc;
  }, {} as Record<MaintKey, { landlord: boolean; tenant: boolean }>);
  return result;

};
/* ---------- main mapper ---------- */