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


export type MaintKey = keyof typeof EMPTY_MAINT;

export type MaintenanceRowDTO = { landlord?: boolean; tenant?: boolean };

export type MaintenanceDTO = Partial<Record<MaintKey, MaintenanceRowDTO>>;

export type LoiDTO = {
  title?: string;
  loiId: string;
  propertyAddress?: string;

  property_address_S1?: string;
  property_address_S2?: string;
  property_city?: string;
  property_state?: string; 
  property_zip?: string;

  addFileNumber: boolean;
  doc_id: string;

  partyInfo?: {
    landlord_name?: string;
    landlord_email?: string;
    tenant_name?: string;
    tenant_email?: string;

    landlord_home_town_address?: string;
    tenant_home_town_address?: string;

    landlord_address_S1?: string;
    landlord_address_S2?: string;
    landlord_city?: string;
    landlord_state?: string; 
    landlord_zip?: string;

    tenant_address_S1?: string;
    tenant_address_S2?: string;
    tenant_city?: string;
    tenant_state?: string;   
    tenant_zip?: string;
  };

  leaseTerms?: {
    monthlyRent?: string;
    securityDeposit?: string;
    leaseDuration?: string;  
    startDate?: string;      
    rentstartDate?: string;
    prepaidRent?: string;
    leaseType?: string;
   
    RentEscalation?: string;
    PrepaidRent?: string;
    LeaseType?: string;
    rentEsclation?: string;
    rentStartMode?: string;
    escalationBasis?:string;
  
    rentEscalationType?: "percent" | "fmv";
    rentEscalationPercent?: string;

    includeRenewalOption?: boolean;
    renewalYears?: string;
    renewalOptionsCount?: string;
    percentageLeasePercent?: string
  };

  propertyDetails?: {
    propertySize?: string;
    patio?: string;
    patioSize?: string;
    intendedUse?: string;
    exclusiveUse?: string;
    propertyType?: string;
    amenities?: string;      
    utilities?: string[];    
    hasExtraSpace?: boolean;

    deliveryCondition?: string;

    maintenance?: {
      structural?: { landlord?: boolean; tenant?: boolean };
      nonStructural?: { landlord?: boolean; tenant?: boolean };
      hvac?: { landlord?: boolean; tenant?: boolean };
      plumbing?: { landlord?: boolean; tenant?: boolean };
      electrical?: { landlord?: boolean; tenant?: boolean };
      commonAreas?: { landlord?: boolean; tenant?: boolean };
      utilities?: { landlord?: boolean; tenant?: boolean };
      specialEquipment?: { landlord?: boolean; tenant?: boolean };
    };
  };

  additionalDetails?: {
    tenantImprovement?: string;
    renewalOption?: boolean;
    specialConditions?: string;
    contingencies?: string[];
    rightOfFirstRefusal?: boolean;
    leaseToPurchase?: boolean;
    leaseToPurchaseDuration?: string;
    tenantImprovement_check?:boolean;

    Miscellaneous_items?: string[];
    Miscellaneous_details?: {
      rightOfFirstRefusalDetails?: string;
      leaseToPurchaseDetails?: string;
    };
  };
};

export interface FormValues {
  doc_id: string;
  title: string;
  propertyAddress: string;
  landlordName: string;
  landlordEmail: string;
  tenantName: string;
  tenantEmail: string;
  landlord_home_town_address: string;
  tenant_home_town_address: string;
  addFileNumber: boolean;

  property_address_S1: string;
  property_address_S2: string;
  property_city: string;
  property_state: string;
  property_zip: string;

  landlord_address_S1: string;
  landlord_address_S2: string;
  landlord_city: string;
  landlord_state: string;
  landlord_zip: string;
  escalationBasis: string;

  tenant_address_S1: string;
  tenant_address_S2: string;
  tenant_city: string;
  tenant_state: string;
  tenant_zip: string;
 tenantImprovement_check : boolean,
  rentAmount: string;
  prepaidRent: string;
  securityDeposit: string;
  leaseType: string;
  leaseDuration: string;
  rentEscalationPercent: string;
  includeRenewalOption: boolean;
  rentStartMode: string;
  renewalOptionsCount: string;
  renewalYears: string;
  startDate: string;
  rentstartDate: string;
  deliveryCondition: string,
  maintenance: {
    structural: { landlord: boolean, tenant: boolean },
    nonStructural: { landlord: boolean, tenant: boolean },
    hvac: { landlord: boolean, tenant: boolean },
    plumbing: { landlord: boolean, tenant: boolean },
    electrical: { landlord: boolean, tenant: boolean },
    commonAreas: { landlord: boolean, tenant: boolean },
    utilities: { landlord: boolean, tenant: boolean },
    specialEquipment: { landlord: boolean, tenant: boolean },
  },
  rentEscalationType: string,
  RentEscalation?: string;
  PrepaidRent?: string;
  LeaseType?: string;
  percentageLeasePercent: string; 

  // Step 3 (Property Details)
  propertySize: string;
  hasExtraSpace: boolean;
  patio: string;
  patioSize: string;
  intendedUse: string;
  exclusiveUse: string;
  propertyType: string;
  parkingSpaces: string;
  utilities: {
    electricity: boolean;
    waterSewer: boolean;
    naturalGas: boolean;
    internetCable: boolean;
    hvac: boolean;
    securitySystem: boolean;
    other: boolean;
  };

  // Step 4 (Additional Terms)
  renewalOption: boolean;
  renewalOptionDetails: string;

  rightOfFirstRefusal: boolean;
  rightOfFirstRefusalDetails: string;

  leaseToPurchase: boolean;
  leaseToPurchaseDetails: string;
  leaseToPurchaseDuration: string,

  improvementAllowanceEnabled: boolean;
  improvementAllowanceAmount: string;

  improvementAllowance: string;
  specialConditions: string;

  financingApproval: boolean;
  environmentalAssessment: boolean;
  zoningCompliance: boolean;
  permitsLicenses: boolean;
  propertyInspection: boolean;
  insuranceApproval: boolean;

  // Step 5
  terms: boolean;
}

export interface Step {
  id: number;
  title: string;
  subtitle: string;
}

export type SubmitStatus = 'Draft' | 'Submitted';

export type LOIApiPayload = {
  title: string;

  addFileNumber: boolean;
  doc_id?: string;

  partyInfo: {
    landlord_name: string;
    landlord_email: string;
    tenant_name: string;
    tenant_email: string;

    landlord_home_town_address?: string;
    tenant_home_town_address?: string;
  };

    leaseTerms?: {
    monthlyRent: string;
    securityDeposit: string;
    leaseDuration: string;
    startDate: string;
    rentstartDate?: string;
    prepaidRent: string;
    leaseType: string;

    RentEscalation?: string;
    PrepaidRent?: string;
    LeaseType?: string;
    rentEsclation?: string;

    rentEscalationType?: "percent" | "fmv";
    rentEscalationPercent?: string;
    rentStartMode?: string;
    includeRenewalOption: boolean;
    renewalYears?: string;
    renewalOptionsCount?: string;

    percentageLeasePercent?: string;
  };

  propertyDetails: {
    propertySize: string;
    intendedUse: string;
    exclusiveUse: string;    
    propertyType: string;
    hasExtraSpace: boolean;
    patio?: string;
    patioSize? : string,
    amenities: string;        
    utilities: string[];      
    
    deliveryCondition?: string; 
    maintenance?: {
      structural?: { landlord?: boolean; tenant?: boolean };
      nonStructural?: { landlord?: boolean; tenant?: boolean };
      hvac?: { landlord?: boolean; tenant?: boolean };
      plumbing?: { landlord?: boolean; tenant?: boolean };
      electrical?: { landlord?: boolean; tenant?: boolean };
      commonAreas?: { landlord?: boolean; tenant?: boolean };
      utilities?: { landlord?: boolean; tenant?: boolean };
      specialEquipment?: { landlord?: boolean; tenant?: boolean };
    };
  };

  additionalDetails: {
    Miscellaneous_items: string[];
    tenantImprovement: string;
    improvementAllowanceEnabled: boolean;
    improvementAllowanceAmount: string;
    specialConditions: string;
    contingencies: string[];
    rightOfFirstRefusal?: boolean;
    tenantImprovement_check?:boolean;

    leaseToPurchase?: boolean;
    leaseToPurchaseDuration?: string
  };

  submit_status: "Submitted" | "Draft" | "Incomplete";
};

export type LOIStatus = 'Draft' | 'Sent' | 'Approved';
export interface Letter {
  id: string;  
  title: string;
  propertyAddress?: string;
  updated_at?: string;
  submit_status: LOIStatus;
}

export interface PartyInfo {
  landlord_name: string;
  landlord_email: string;
  tenant_name: string;
  tenant_email: string;
}

export interface LeaseTerms {
  monthlyRent: string;
  securityDeposit: string;
  leaseType: string;
  leaseDuration: string;
  startDate: string | null;
}

export interface PropertyDetails {
  propertySize: string;
  intendedUse: string;
  propertyType: string;
  amenities: string[];
  utilities: string[];
}

export interface AdditionalDetails {
  renewalOption: boolean;
  tenantImprovement: string;
  specialConditions: string;
  contingencies: string;
}

export interface FullLOI {
  id?: number;
  title: string;
  propertyAddress: string;
  submit_status: LOIStatus;
  updated_at?: string;
  assignee?: string;

  partyInfo: PartyInfo;
  leaseTerms: LeaseTerms;
  propertyDetails: PropertyDetails;
  additionalDetails: AdditionalDetails;
}

export interface CustomFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  as?: 'input' | 'textarea';
  rows?: number;
  required?: boolean;
}

export interface FileData {
  name: string;
  size: string;      
  type: string;     
  file: File;
}

export interface LeaseFormValues {
  title: string;
  startDate: string;
  endDate: string;
  propertyAddress: string;
  notes: string;
  document: string;
  leaseId?: string;     
  leaseTitle?: string;  
}

export type SetFieldValue = (field: string, value: File | null) => void;

export interface ExtendedFormikErrors {
  document?: string;
}

export type ExtendedClause = Clause & {
  lastEdited?: string;
  editor?: string;
  originalText?: string;
  aiSuggestion?: string;
  currentVersion?: string;
   
  status?: string;
  risk?: string;

  title?: string;
  name?: string;
};


export interface Clause {
  id: number | string;
  name: string;
  description?: string;
  status: ClauseStatus;
  risk: RiskLevel;
  comments?: number;
  unresolved?: boolean;
}

export interface Lease {
  id: number | string;
  title: string;             
  property_address?: string;   
  clauses: Clause[];
  approvedCount?: number;
  totalCount?: number;
  unresolvedCount?: number;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export interface ClauseData {
  risk: string; 
  status: "approved" | "pending" | "rejected";
  current_version: string;
  ai_suggested_clause_details: string;
  clause_details: string;

  clause_id?: string;
  id?: string;
  _id?: string;
}

export type HistoryMap = Record<string, ClauseData>;
export type HistoryMetaMap = Record<string, { id?: string } | undefined>;


export type UILease = {
  id: string;
  title: string;
  property_address: string;
  startDate?: string;
  endDate?: string;
  updatedAt?: string;
  clauseDocId?: string;
  clauses: UIClause[];
  approvedCount: number;
  totalCount: number;
  unresolvedCount: number;
};

export type ApiClause = {
  status?: string;
  risk?: string;
  current_version?: string;
  ai_suggested_clause_details?: string;
  clause_details?: string;
};

export type ApiLease = {
  id: string | number;
  title: string;
  property_address?: string;
  startDate?: string;
  endDate?: string;
  log_updated_at?: string;
  clauses?: Record<string, unknown>;
};

export type RiskLevel = 'Low' | 'Medium' | 'High';
export type ClauseStatus = 'AI Suggested' | 'Edited' | 'Approved' | 'Needs Review' | 'Pending' | 'Suggested';

export type UIClause = {
  id: string;
  name: string;              
  category?: string;          
  status: ClauseStatus;
  risk: RiskLevel;
  lastEditedAt?: string;   
  lastEditedBy?: string;     
  commentsUnresolved?: number;
  currentVersion: string;
  aiSuggestion?: string;
  details?: string;
};

export type UILeaseBrief = {
  id: string;
  title: string;
  type: 'Lease' | 'LOI' | 'Notice' | 'Termination';
  documentId?: string;       
  status?: string;          
  tags?: string[];          
  sizeLabel?: string;
  updatedAt?: string   
};

export type UILeaseFull = {
  id: string;
  title: string;
  propertyAddress?: string;
  clauses: UIClause[];
  approvedCount?: number;
  totalCount?: number;
  unresolvedCount?: number;
};