import { FormValues, Step } from '@/types/loi';
import * as Yup from 'yup';

/* -------------------- STEPS -------------------- */
export const STEPS: Step[] = [
  { id: 1, title: 'Basic Information', subtitle: 'Property and party details' },
  { id: 2, title: 'Lease Terms', subtitle: 'Key lease particulars' },
  { id: 3, title: 'Property Details', subtitle: 'Size and specifications' },
  { id: 4, title: 'Additional Terms', subtitle: 'Deposit and timelines' },
  { id: 5, title: 'Review & Submit', subtitle: 'Final review' }
];  

/* -------------------- INITIAL VALUES -------------------- */
export const INITIAL_VALUES: FormValues = {
  // Step 1
  title: '',
  addFileNumber: false,
  propertyAddress: '',
  landlordName: '',
  landlordEmail: '',
  tenantName: '',
  tenantEmail: '',

  // Step 2
  rentAmount: '',
  securityDeposit: '',
  rentEsclation: '',   // keeping your original key
  leaseDuration: '',
  startDate: '',

  // Step 3 (matches PropertyDetailsStep.tsx)
  propertySize: '',
  patio: '',
  intendedUse: '',
  exclusiveUse: '',
  propertyType: '',
  hasExtraSpace: false,
  parkingSpaces: '',
  prepaidRent: '',
  utilities: {
    electricity: false,
    waterSewer: false,
    naturalGas: false,
    internetCable: false,
    hvac: false,
    securitySystem: false,
    other: false,
  },
  leaseType: '',            // ✅ add this

  // Step 4
  rightOfFirstRefusal: false,
  leaseToPurchase: false,
  renewalOption: false,
  improvementAllowance: '',
  specialConditions: '',
  financingApproval: false,
  environmentalAssessment: false,
  zoningCompliance: false,
  permitsLicenses: false,
  propertyInspection: false,
  insuranceApproval: false,

  // Step 5
  terms: false,
};

/* -------------------- DTO SHAPE (aligned to UI) -------------------- */
type LoiDTO = {
  title?: string;
  propertyAddress?: string;
  addFileNumber: boolean;

  partyInfo?: {
    landlord_name?: string;
    landlord_email?: string;
    tenant_name?: string;
    tenant_email?: string;
  };

  leaseTerms?: {
    monthlyRent?: string;
    securityDeposit?: string;
    leaseDuration?: string;
    startDate?: string;       // ISO string
    rentEsclation?: string;   // keep spelling to match backend
    prepaidRent: string,
    leaseType: string,
  };

  propertyDetails?: {
    propertySize?: string;
    patio?: string;           // new field
    intendedUse?: string;
    exclusiveUse?: string;    // new field
    propertyType?: string;
    amenities?: string;       // Parking spaces (e.g., "8–10")
    utilities?: string[];     // e.g., ["Electricity", "HVAC", "Other"]
    hasExtraSpace?: boolean;  // new field (outer space checkbox)
  };

  additionalDetails?: {
    tenantImprovement?: string;
    renewalOption?: boolean;
    specialConditions?: string;
    contingencies?: string[];
    rightOfFirstRefusal?: boolean; // NEW
    leaseToPurchase?: boolean;     // NEW
  };
};

/* -------------------- HELPERS -------------------- */
const mapUtilitiesToBoolean = (list?: readonly string[]) => ({
  electricity: !!list?.includes('Electricity'),
  waterSewer: !!list?.includes('Water/Sewer'),
  naturalGas: !!list?.includes('Natural Gas'),
  internetCable: !!list?.includes('Internet/Cable'),
  hvac: !!list?.includes('HVAC'),
  securitySystem: !!list?.includes('Security System'),
  other: !!list?.includes('Other'),
});

const normalizeParkingSpaces = (amenities?: unknown): string => {
  if (!amenities) return '';
  const str = String(amenities).trim();
  return str; // keep ranges like "8–10" as-is (matches UI select)
};

/* -------------------- EDIT -> INITIAL VALUES -------------------- */
export const EDIT_INITIAL_VALUES = (loi: LoiDTO): FormValues => ({
  // Step 1
  title: loi.title ?? '',
  propertyAddress: loi.propertyAddress ?? '',
  addFileNumber: !!loi.addFileNumber,

  landlordName: loi.partyInfo?.landlord_name ?? '',
  landlordEmail: loi.partyInfo?.landlord_email ?? '',
  tenantName: loi.partyInfo?.tenant_name ?? '',
  tenantEmail: loi.partyInfo?.tenant_email ?? '',

  // Step 2
  rentAmount: loi.leaseTerms?.monthlyRent ?? '',
  securityDeposit: loi.leaseTerms?.securityDeposit ?? '',
  leaseDuration: loi.leaseTerms?.leaseDuration ?? '',
  leaseType: loi.leaseTerms?.leaseType ?? '',
  rentEsclation: loi.leaseTerms?.RentEscalation ?? '',
  startDate: (loi.leaseTerms?.startDate ?? '').split('T')[0] || '',
  prepaidRent: loi.leaseTerms?.PrepaidRent ?? '',
  // Step 3
  propertySize: loi.propertyDetails?.propertySize ?? '',
  patio: loi.propertyDetails?.patio ?? '',
  intendedUse: loi.propertyDetails?.intendedUse ?? '',
  exclusiveUse: loi.propertyDetails?.exclusiveUse ?? '',
  propertyType: loi.propertyDetails?.propertyType ?? '',
  hasExtraSpace: !!loi.propertyDetails?.hasExtraSpace,

  parkingSpaces: normalizeParkingSpaces(loi.propertyDetails?.amenities),
  utilities: mapUtilitiesToBoolean(loi.propertyDetails?.utilities),

  // Step 4
  improvementAllowance: loi.additionalDetails?.tenantImprovement ?? '',
  renewalOption: !!loi.additionalDetails?.renewalOption,
  specialConditions: loi.additionalDetails?.specialConditions ?? '',

  financingApproval: !!loi.additionalDetails?.contingencies?.includes('Financing Approval'),
  environmentalAssessment: !!loi.additionalDetails?.contingencies?.includes('Environmental Assessment'),
  zoningCompliance: !!loi.additionalDetails?.contingencies?.includes('Zoning Compliance'),
  permitsLicenses: !!loi.additionalDetails?.contingencies?.includes('Permits & Licenses'),
  propertyInspection: !!loi.additionalDetails?.contingencies?.includes('Property Inspection'),
  insuranceApproval: !!loi.additionalDetails?.contingencies?.includes('Insurance Approval'),

  // 🔹 Add the two required booleans (default false)
  rightOfFirstRefusal: !!loi.additionalDetails?.rightOfFirstRefusal,
  leaseToPurchase: !!loi.additionalDetails?.leaseToPurchase,

  // Step 5
  terms: false,
});


/* -------------------- VALIDATION (matches UI) -------------------- */
export const VALIDATION_SCHEMAS = {
  // Step 1: You wanted proper validation – checkbox must be checked
  1: Yup.object({
    title: Yup.string().required('LOI Title is required'),
    addFileNumber: Yup.boolean().oneOf([true], 'You must enable automatic file number'),
    propertyAddress: Yup.string().required('Property Address is required'),
    landlordName: Yup.string().required('Landlord Name is required'),
    landlordEmail: Yup.string().email('Invalid email').required('Landlord Email is required'),
    tenantName: Yup.string().required('Tenant Name is required'),
    tenantEmail: Yup.string().email('Invalid email').required('Tenant Email is required'),
  }),

  // Step 2: keep only fields actually present in your Lease Terms step
  2: Yup.object({
    rentAmount: Yup.string().required('Monthly Rent is required'),
    leaseType: Yup.string().required('Lease Type is required'), // ✅ add this
    securityDeposit: Yup.string().required('Security Deposit is required'),
    leaseDuration: Yup.string().required('Lease Duration is required'),
    startDate: Yup.date().required('Start Date is required'),
    // rentEsclation is optional in your UI – add .required(...) if you want it mandatory
  }),

  // Step 3: exactly the fields shown in PropertyDetailsStep.tsx
  3: Yup.object({
    propertySize: Yup.string().required('Property size is required'),
    intendedUse: Yup.string().required('Intended use is required'),
    exclusiveUse: Yup.string().required('Exclusive use is required'),
    propertyType: Yup.string().required('Property type is required'),
    parkingSpaces: Yup.string().required('Parking Spaces is required'),
    patio: Yup.string(),          // optional text
    hasExtraSpace: Yup.boolean(), // optional checkbox
  }),

  4: Yup.object({
  }),

  5: Yup.object({
    terms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
  }),
};
