// utils/apiTransform.ts
import { FormValues } from '../types/loi';


export const transformToApiPayload = (values: FormValues, loiId: String) => {

  const selectedUtilities = Object.entries(values.utilities)
    .filter(([, value]) => value === true)
    .map(([key]) => {
      const utilityMap: { [key: string]: string } = {
        electricity: 'Electricity',
        waterSewer: 'Water/Sewer',
        naturalGas: 'Natural Gas',
        internetCable: 'Internet/Cable',
        hvac: 'HVAC',
        securitySystem: 'Security System'
      };
      return utilityMap[key] || key;
    });

  const contingencies = [];
  if (values.financingApproval) contingencies.push('Financing Approval');
  if (values.environmentalAssessment) contingencies.push('Environmental Assessment');
  if (values.zoningCompliance) contingencies.push('Zoning Compliance');
  if (values.permitsLicenses) contingencies.push('Permits & Licenses');
  if (values.propertyInspection) contingencies.push('Property Inspection');
  if (values.insuranceApproval) contingencies.push('Insurance Approval');

  const amenities = [];
  if (values.parkingSpaces && parseInt(values.parkingSpaces) > 0) {
    amenities.push(`${values.parkingSpaces} Parking Spaces`);
  }

  return {
    doc_id: loiId,
    title: values.title,
    propertyAddress: values.propertyAddress,
    partyInfo: {
      landlord_name: values.landlordName,
      landlord_email: values.landlordEmail,
      tenant_name: values.tenantName,
      tenant_email: values.tenantEmail,
    },
    leaseTerms: {
      monthlyRent: values.rentAmount,
      securityDeposit: values.securityDeposit,
      leaseType: values.propertyType,
      leaseDuration: values.leaseDuration,
      startDate: values.startDate,
    },
    propertyDetails: {
      propertySize: values.propertySize,
      intendedUse: values.intendedUse,
      propertyType: values.propertyType,
      amenities: amenities,
      utilities: selectedUtilities,
    },
    additionalDetails: {
      renewalOption: values.renewalOption,
      tenantImprovement: values.improvementAllowance,
      specialConditions: values.specialConditions,
      contingencies: contingencies.join(', '),
    },
    submit_status: 'Submitted',
  };
};
