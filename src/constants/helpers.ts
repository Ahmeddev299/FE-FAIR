import { EMPTY_MAINT, FormValues, MaintenanceDTO, MaintKey } from "@/types/loi";
import * as Yup from "yup";

export const mapMaintenanceFromDTO = (m?: MaintenanceDTO): FormValues["maintenance"] => {
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

export const extractAmount = (s?: string): string => {
  const m = String(s ?? "").match(/[\d,.]+/);
  return m ? m[0].replace(/,/g, "") : "";
};

export const parseSingleLineAddress = (s?: string) => {
  // naive split: "S1, S2, City, ST, ZIP"
  const parts = String(s ?? "").split(",").map(p => p.trim()).filter(Boolean);
  const [S1 = "", S2 = "", City = "", State = "", Zip = ""] = parts;
  return {
    property_address_S1: S1,
    property_address_S2: S2,
    property_city: City,
    property_state: State,
    property_zip: Zip,
  };
};

export const normalizeParkingSpaces = (amenities?: unknown): string =>
  amenities ? String(amenities).trim() : "";

export const mapUtilitiesToBoolean = (list?: readonly string[]) => ({
  electricity: !!list?.includes("Electricity"),
  waterSewer: !!list?.includes("Water/Sewer"),
  naturalGas: !!list?.includes("Natural Gas"),
  internetCable: !!list?.includes("Internet/Cable"),
  hvac: !!list?.includes("HVAC"),
  securitySystem: !!list?.includes("Security System"),
  other: !!list?.includes("Other"),
});


export const mustBeOff = (msg: string) =>
  Yup.boolean().oneOf([false], msg).default(false);

export const STATE_2 = /^[A-Za-z]{2}$/;                
export const ZIP_5_9 = /^\d{5}(?:-\d{4})?$/;        