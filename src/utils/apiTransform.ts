// utils/apiTransform.ts
import type { LOIApiPayload } from '@/types/loi';
import { FormValues } from '../types/loi';

export const transformToApiPayload = (values: FormValues): LOIApiPayload => {
  // Utilities -> array of labels
  const selectedUtilities = Object.entries(values.utilities || {})
    .filter(([, v]) => v === true)
    .map(([k]) => {
      const map: Record<string, string> = {
        electricity: 'Electricity',
        waterSewer: 'Water/Sewer',
        naturalGas: 'Natural Gas',
        internetCable: 'Internet/Cable',
        hvac: 'HVAC',
        securitySystem: 'Security System',
        other: 'Other',
      };
      return map[k] ?? k;
    });

  // Contingencies -> array of strings
  const contingencies: string[] = [];
  if (values.financingApproval) contingencies.push('Financing Approval');
  if (values.environmentalAssessment) contingencies.push('Environmental Assessment');
  if (values.zoningCompliance) contingencies.push('Zoning Compliance');
  if (values.permitsLicenses) contingencies.push('Permits & Licenses');
  if (values.propertyInspection) contingencies.push('Property Inspection');
  if (values.insuranceApproval) contingencies.push('Insurance Approval');

  const payload: LOIApiPayload = {
    title: values.title,
    propertyAddress: values.propertyAddress,
    addFileNumber:values.addFileNumber,

    partyInfo: {
      landlord_name: values.landlordName,
      landlord_email: values.landlordEmail,
      tenant_name: values.tenantName,
      tenant_email: values.tenantEmail,
    },

    leaseTerms: {
      monthlyRent: values.rentAmount,
      securityDeposit: values.securityDeposit,
      leaseType: values.propertyType,     // <-- REQUIRED: map from form
      leaseDuration: values.leaseDuration,
      startDate: values.startDate,
      rentEsclation: values.rentEsclation,
      // patio?: you can add here if your LOIApiPayload includes it
    },

    propertyDetails: {
      propertySize: values.propertySize,
      intendedUse: values.intendedUse,
      exclusiveUse: values.exclusiveUse,
      propertyType: values.propertyType,
      amenities: values.parkingSpaces ? [values.parkingSpaces] : [], // <-- array of range strings
      utilities: selectedUtilities,                                   // ["Electricity", ...]
      // hasExtraSpace/patio can be added if present in LOIApiPayload
        hasExtraSpace: values.hasExtraSpace
    },

    additionalDetails: {
      renewalOption: !!values.renewalOption,
      tenantImprovement: values.improvementAllowance,
      specialConditions: values.specialConditions,
      contingencies, // <-- array as per updated type
      // rightOfFirstRefusal / leaseToPurchase optional if your API type has them
    },

    submit_status: 'Submitted',
  };

  return payload;
};
