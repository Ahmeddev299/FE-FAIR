// types/loi.ts
export interface FormValues {
  title: string;
  propertyAddress: string;
  landlordName: string;
  landlordEmail: string;
  tenantName: string;
  tenantEmail: string;
  rentAmount: string;
  securityDeposit: string;
  propertyType: string;
  leaseDuration: string;
  startDate: string;
  propertySize: string;
  intendedUse: string;
  parkingSpaces: string;
  utilities: {
    electricity: boolean;
    waterSewer: boolean;
    naturalGas: boolean;
    internetCable: boolean;
    hvac: boolean;
    securitySystem: boolean;
  };
  renewalOption: boolean;
  improvementAllowance: string;
  specialConditions: string;
  financingApproval: boolean;
  environmentalAssessment: boolean;
  zoningCompliance: boolean;
  permitsLicenses: boolean;
  propertyInspection: boolean;
  insuranceApproval: boolean;
  terms: boolean;
}

export interface Step {
  id: number;
  title: string;
  subtitle: string;
}

// types/loi.ts or near transformToApiPayload

export interface LOIApiPayload {
  title: string;
  propertyAddress: string;
  partyInfo: {
    landlord_name: string;
    landlord_email: string;
    tenant_name: string;
    tenant_email: string;
  };
  leaseTerms: {
    monthlyRent: string;
    securityDeposit: string;
    leaseType: string;
    leaseDuration: string;
    startDate: string;
  };
  propertyDetails: {
    propertySize: string;
    intendedUse: string;
    propertyType: string;
    amenities: string[];
    utilities: string[];
  };
  additionalDetails: {
    renewalOption: boolean;
    tenantImprovement: string;
    specialConditions: string;
    contingencies: string;
  };
  submit_status: string;
}

