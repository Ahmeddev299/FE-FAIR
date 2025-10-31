// validations/leaseValidation.ts
import * as Yup from 'yup';

// Step 1: Basic Information
const step1Schema = Yup.object({
  title: Yup.string().required('Lease title is required'),
  lease_type: Yup.string().required('Lease type is required'),
  landlordName: Yup.string().required('Landlord name is required'),
  landlordEmail: Yup.string().email('Invalid email').required('Landlord email is required'),
  landlord_address_S1: Yup.string().required('Landlord address is required'),
  landlord_city: Yup.string().required('Landlord city is required'),
  landlord_state: Yup.string().required('Landlord state is required'),
  landlord_zip: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format')
    .required('Landlord ZIP is required'),
  tenantName: Yup.string().required('Tenant name is required'),
  tenantEmail: Yup.string().email('Invalid email').required('Tenant email is required'),
  tenant_address_S1: Yup.string().required('Tenant address is required'),
  tenant_city: Yup.string().required('Tenant city is required'),
  tenant_state: Yup.string().required('Tenant state is required'),
  tenant_zip: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format')
    .required('Tenant ZIP is required'),
});

// Step 2: Premises & Property Details
const step2Schema = Yup.object({
  premisses_property_address_S1: Yup.string().required('Property address is required'),
  premisses_property_city: Yup.string().required('Property city is required'),
  premisses_property_state: Yup.string().required('Property state is required'),
  premisses_property_zip: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format')
    .required('Property ZIP is required'),
  rentable_sf: Yup.number().optional().positive('Must be positive'),
  hasExtraSpace: Yup.boolean(),
  outdoor_size: Yup.number().when('hasExtraSpace', {
    is: true,
    then: (schema) => schema.required('Outdoor space size is required').positive('Must be positive'),
    otherwise: (schema) => schema.optional(),
  }),
  exclusive_parking_spaces: Yup.boolean(),
  reserved_spaces: Yup.number().when('exclusive_parking_spaces', {
    is: true,
    then: (schema) => schema.required('Parking spaces count is required').positive('Must be positive').integer('Must be a whole number'),
    otherwise: (schema) => schema.optional(),
  }),
});

// Step 3: Term, Timing & Triggers
const step3Schema = Yup.object({
  initial_term_years: Yup.number()
    .required('Initial term is required')
    .positive('Must be positive')
    .integer('Must be a whole number'),
  commencement_trigger: Yup.string(),
  commencement_date_certain: Yup.string().when('commencement_trigger', {
    is: 'Date certain',
    then: (schema) => schema.required('Commencement date is required'),
    otherwise: (schema) => schema.optional(),
  }),
});

// Step 4: Rent & Economics (with Operating Expenses/Structure moved here)
const step4Schema = Yup.object({
  rent_type: Yup.string().required('Rent type is required'),
  monthly_rent: Yup.number().when('rent_type', {
    is: (val: string) => val !== 'Percentage',
    then: (schema) => schema.required('Base rent is required').positive('Must be positive'),
    otherwise: (schema) => schema.optional(),
  }),
  percentage_lease_percent: Yup.number().when('rent_type', {
    is: 'Percentage',
    then: (schema) => schema.required('Percentage rent is required').positive('Must be positive').max(100, 'Cannot exceed 100%'),
    otherwise: (schema) => schema.optional(),
  }),
  lease_structure: Yup.string().required('Lease structure is required'),
});

// Step 5: Operations & Maintenance
const step5Schema = Yup.object({
  maintenance_structural: Yup.string().required('Structural maintenance responsibility is required'),
  maintenance_non_structural: Yup.string().required('Non-structural maintenance responsibility is required'),
  maintenance_hvac: Yup.string().required('HVAC maintenance responsibility is required'),
  maintenance_plumbing: Yup.string().required('Plumbing maintenance responsibility is required'),
  maintenance_electrical: Yup.string().required('Electrical maintenance responsibility is required'),
  maintenance_common_areas: Yup.string().required('Common areas maintenance responsibility is required'),
  maintenance_utilities: Yup.string().required('Utilities maintenance responsibility is required'),
  maintenance_special_equipment: Yup.string().required('Special equipment maintenance responsibility is required'),
});

// Step 6: Rights, Options & Conditions
const step6Schema = Yup.object({
  permitted_use: Yup.string().required('Permitted use is required'),
  prohibited_custom: Yup.boolean(),
  prohibited_uses: Yup.string().when('prohibited_custom', {
    is: true,
    then: (schema) => schema.required('Prohibited uses are required when custom option is selected'),
    otherwise: (schema) => schema.optional(),
  }),
  exclusive_requested: Yup.string(),
  exclusive_description: Yup.string().when('exclusive_requested', {
    is: 'Yes',
    then: (schema) => schema.required('Exclusive description is required'),
    otherwise: (schema) => schema.optional(),
  }),
  cotenancy_applicable: Yup.boolean(),
  cotenancy_opening: Yup.string().when('cotenancy_applicable', {
    is: true,
    then: (schema) => schema.required('Opening co-tenancy is required'),
    otherwise: (schema) => schema.optional(),
  }),
  cotenancy_ongoing: Yup.string().when('cotenancy_applicable', {
    is: true,
    then: (schema) => schema.required('Ongoing co-tenancy is required'),
    otherwise: (schema) => schema.optional(),
  }),
  cotenancy_remedies: Yup.string().when('cotenancy_applicable', {
    is: true,
    then: (schema) => schema.required('Co-tenancy remedies are required'),
    otherwise: (schema) => schema.optional(),
  }),
  includeRenewalOption: Yup.boolean(),
  renewalOptionsCount: Yup.number().when('includeRenewalOption', {
    is: true,
    then: (schema) => schema.required('Number of renewal options is required').positive('Must be positive').integer('Must be a whole number'),
    otherwise: (schema) => schema.optional(),
  }),
  renewalYears: Yup.number().when('includeRenewalOption', {
    is: true,
    then: (schema) => schema.required('Renewal years is required').positive('Must be positive').integer('Must be a whole number'),
    otherwise: (schema) => schema.optional(),
  }),
  rofr_yes: Yup.string(),
  rofr_scope: Yup.string().when('rofr_yes', {
    is: 'Yes',
    then: (schema) => schema.required('ROFR scope is required'),
    otherwise: (schema) => schema.optional(),
  }),
  ltp_yes: Yup.string(),
  ltp_terms_window_days: Yup.number().when('ltp_yes', {
    is: 'Yes',
    then: (schema) => schema.required('Terms window is required').positive('Must be positive').integer('Must be a whole number'),
    otherwise: (schema) => schema.optional(),
  }),
  non_disturbance_required: Yup.string(),
  nondisturbance_condition: Yup.string().when('non_disturbance_required', {
    is: 'Yes',
    then: (schema) => schema.required('Non-disturbance condition is required'),
    otherwise: (schema) => schema.optional(),
  }),
});

// Export all schemas by step
export const LEASE_VALIDATION_SCHEMAS = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: step4Schema,
  5: step5Schema,
  6: step6Schema,
  7: Yup.object(), // Review step has no validation
};