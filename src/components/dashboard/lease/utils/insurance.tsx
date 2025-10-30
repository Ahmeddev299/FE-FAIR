// components/dashboard/lease/utils/insurance.ts
export type InsuranceOption = {
  key: string;
  label: string;
  help?: string;
  limitOptions: { label: string; value: string }[];
  defaultLimit?: string;
  defaultParty?: "Landlord" | "Tenant";
};

export const INSURANCE_CATEGORIES: InsuranceOption[] = [
  {
    key: "cgl",
    label: "Commercial General Liability (CGL)",
    help:
      "Includes: Personal Injury $1M ea. occ.; Products & Completed Ops $2M agg.; Contractual $1M; Independent Contractors $1M; Premises Damage $1M.",
    limitOptions: [
      { label: "$1,000,000 each occurrence / $2,000,000 aggregate", value: "1M/2M" },
      // keep room for future variants:
      { label: "$2,000,000 each occurrence / $4,000,000 aggregate", value: "2M/4M" },
      { label: "Custom", value: "custom" },
    ],
    defaultLimit: "1M/2M",
    defaultParty: "Tenant",
  },
  {
    key: "workers_comp",
    label: "Workers’ Compensation",
    limitOptions: [
      { label: "$1,000,000", value: "1M" },
      { label: "Statutory + $1,000,000 EL", value: "statutory_1MEL" },
      { label: "Custom", value: "custom" },
    ],
    defaultLimit: "1M",
    defaultParty: "Tenant",
  },
  {
    key: "liquor_liability",
    label: "Liquor Liability (if applicable)",
    limitOptions: [
      { label: "$1,000,000", value: "1M" },
      { label: "$2,000,000", value: "2M" },
      { label: "Custom", value: "custom" },
    ],
    defaultLimit: "1M",
    defaultParty: "Tenant",
  },
];
