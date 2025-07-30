// constants/formData.ts
import { FormValues, Step } from '@/types/loi';
import * as Yup from 'yup';

export const STEPS: Step[] = [
  { id: 1, title: 'Basic Information', subtitle: 'Property and party details' },
  { id: 2, title: 'Lease Terms', subtitle: 'Key lease particulars' },
  { id: 3, title: 'Property Details', subtitle: 'Size and specifications' },
  { id: 4, title: 'Additional Terms', subtitle: 'Deposit and timelines' },
  { id: 5, title: 'Review & Submit', subtitle: 'Final review' }
];

export const INITIAL_VALUES: FormValues = {
  title: "Basic Information",
  propertyAddress: '',
  landlordName: 'Landlord A',
  landlordEmail: 'shakirshakeelahmad121@gmail.com',
  tenantName: '',
  tenantEmail: '',
  rentAmount: '',
  securityDeposit: '',
  propertyType: '',
  leaseDuration: '',
  startDate: '',
  propertySize: '',
  intendedUse: '',
  parkingSpaces: '',
  utilities: {
    electricity: false,
    waterSewer: false,
    naturalGas: false,
    internetCable: false,
    hvac: false,
    securitySystem: false,
  },
  renewalOption: false,
  improvementAllowance: '',
  specialConditions: '',
  financingApproval: false,
  environmentalAssessment: false,
  zoningCompliance: false,
  permitsLicenses: false,
  propertyInspection: false,
  insuranceApproval: false,
  terms: false
};

export const VALIDATION_SCHEMAS = {
  1: Yup.object({
    title: Yup.string().required('LOI Title is required'),
    propertyAddress: Yup.string().required('Property Address is required'),
    landlordName: Yup.string().required('Landlord Name is required'),
    landlordEmail: Yup.string().email('Invalid email').required('Landlord Email is required'),
    tenantName: Yup.string().required('Tenant Name is required'),
    tenantEmail: Yup.string().email('Invalid email').required('Tenant Email is required'),
  }),
  2: Yup.object({
    rentAmount: Yup.string().required('Monthly Rent is required'),
    securityDeposit: Yup.string().required('Security Deposit is required'),
    propertyType: Yup.string().required('Property Type is required'),
    leaseDuration: Yup.string().required('Lease Duration is required'),
    startDate: Yup.date().required('Start Date is required'),
  }),
  3: Yup.object({
    propertySize: Yup.string().required('Property Size is required'),
    intendedUse: Yup.string().required('Intended Use is required'),
  }),
  4: Yup.object({
    improvementAllowance: Yup.string().max(1000, 'Too long').required('Improvement allowance is required'),
  }),
  5: Yup.object({
    terms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
  }),
};
