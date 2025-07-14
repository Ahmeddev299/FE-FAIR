import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Info, RefreshCw, Wrench, FileText, AlertTriangle } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { DashboardLayout } from '@/components/layouts';

// Mock DashboardLayout component

const CreateLoiForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: 'Basic Information', subtitle: 'Property and party details' },
    { id: 2, title: 'Lease Terms', subtitle: 'Key lease particulars' },
    { id: 3, title: 'Property Details', subtitle: 'Size and specifications' },
    { id: 4, title: 'Additional Terms', subtitle: 'Deposit and timelines' },
    { id: 5, title: 'Review & Submit', subtitle: 'Final review' }
  ];

  const initialValues = {
    // Basic Information
    loiTitle: '',
    propertyAddress: '',
    landlordName: '',
    landlordEmail: '',
    tenantName: '',
    tenantEmail: '',

    // Lease Terms
    rentAmount: '',
    securityDeposit: '',
    propertyType: '',
    leaseDuration: '',
    startDate: '',

    // Property Details
    propertySize: '',
    intendedUse: '',
    parkingSpaces: '',

    // Additional Terms
    renewalOption: false,
    improvementAllowance: '',
    specialConditions: '',
    financingApproval: false,
    environmentalAssessment: false,
    zoningCompliance: false,
    permitsLicenses: false,
    propertyInspection: false,
    insuranceApproval: false,

    // Review & Submit
    terms: false
  };

  const validationSchemas = {
    1: Yup.object({
      loiTitle: Yup.string().required('LOI Title is required'),
      propertyAddress: Yup.string().required('Property Address is required'),
      landlordName: Yup.string().required('Landlord Name is required'),
      landlordEmail: Yup.string().email('Invalid email').required('Landlord Email is required'),
      tenantName: Yup.string().required('Tenant Name is required'),
      tenantEmail: Yup.string().email('Invalid email').required('Tenant Email is required'),
    }),
    2: Yup.object({
      rentAmount: Yup.number().positive('Rent amount must be positive').required('Monthly Rent is required'),
      securityDeposit: Yup.number().positive('Security deposit must be positive').required('Security Deposit is required'),
      propertyType: Yup.string().required('Property Type is required'),
      leaseDuration: Yup.string().required('Lease Duration is required'),
      startDate: Yup.date().required('Start Date is required'),
    }),
    3: Yup.object({
      propertySize: Yup.number().positive('Property size must be positive').required('Property Size is required'),
      intendedUse: Yup.string().required('Intended Use is required'),
    }),
    4: Yup.object({
      improvementAllowance: Yup.number().min(0, 'Improvement allowance cannot be negative'),
      specialConditions: Yup.string(),
    }),
    5: Yup.object({
      terms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
    }),
  };

  const isStepComplete = (stepId, values, errors) => {
    const schema = validationSchemas[stepId];
    if (!schema) return false;
    
    try {
      schema.validateSync(values, { abortEarly: false });
      return true;
    } catch (error) {
      return false;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (values) => {
    if (currentStep === steps.length) {
      alert('LOI Submitted Successfully!');
      console.log('Form Values:', values);
    } else {
      nextStep();
    }
  };

  const renderStepContent = (values, setFieldValue, errors, touched) => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <p>Let's start with the essential details about your LOI and the parties involved.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - LOI & Property Details */}
              <div className="space-y-6 border border-gray-300 rounded-lg p-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">1</div>
                    LOI & Property Details
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">LOI Title *</label>
                    <Field
                      name="loiTitle"
                      type="text"
                      placeholder="e.g., Downtown Office Space LOI"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <ErrorMessage name="loiTitle" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Property Address *</label>
                    <Field
                      name="propertyAddress"
                      type="text"
                      placeholder="123 Main Street, City, State, ZIP"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <ErrorMessage name="propertyAddress" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>
              </div>

              {/* Right Column - Party Information */}
              <div className="space-y-6 border border-gray-300 rounded-lg p-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">2</div>
                    Party Information
                  </h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Landlord Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">Landlord Name *</label>
                        <Field
                          name="landlordName"
                          type="text"
                          placeholder="Property Owner or Management Company"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <ErrorMessage name="landlordName" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Landlord Email *</label>
                        <Field
                          name="landlordEmail"
                          type="email"
                          placeholder="landlord@example.com"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <ErrorMessage name="landlordEmail" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4">Tenant Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tenant Name *</label>
                        <Field
                          name="tenantName"
                          type="text"
                          placeholder="Your Company Name"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <ErrorMessage name="tenantName" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Tenant Email *</label>
                        <Field
                          name="tenantEmail"
                          type="email"
                          placeholder="tenant@example.com"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <ErrorMessage name="tenantEmail" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900">Pro Tip</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Use a descriptive LOI title that includes the property type and location. This will help you easily identify this LOI later in your dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Lease Terms</h3>
            <p>Define the financial and temporal aspects of your proposed lease.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Financial Terms */}
              <div className="space-y-6 border border-gray-300 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Financial Terms</h4>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Rent *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Field
                      name="rentAmount"
                      type="number"
                      placeholder="5000"
                      className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <ErrorMessage name="rentAmount" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Security Deposit *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Field
                      name="securityDeposit"
                      type="number"
                      placeholder="10000"
                      className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <ErrorMessage name="securityDeposit" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Property Type *</label>
                  <Field
                    as="select"
                    name="propertyType"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select property type</option>
                    <option value="office">Office</option>
                    <option value="retail">Retail</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="residential">Residential</option>
                    <option value="mixed-use">Mixed Use</option>
                  </Field>
                  <ErrorMessage name="propertyType" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              {/* Timing Terms */}
              <div className="space-y-6 border border-gray-300 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Timing Terms</h4>

                <div>
                  <label className="block text-sm font-medium mb-2">Lease Duration *</label>
                  <Field
                    as="select"
                    name="leaseDuration"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Duration</option>
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                  </Field>
                  <ErrorMessage name="leaseDuration" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Start Date *</label>
                  <Field
                    name="startDate"
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <ErrorMessage name="startDate" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Property Details</h3>
            <p>Specify the physical characteristics and requirements for the property.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Space Specifications */}
              <div className="space-y-6 border border-gray-300 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Space Specifications</h4>

                <div>
                  <label className="block text-sm font-medium mb-2">Property Size *</label>
                  <div className="flex gap-2">
                    <Field
                      name="propertySize"
                      type="number"
                      placeholder="2500"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-500">sq ft</span>
                  </div>
                  <ErrorMessage name="propertySize" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Intended Use *</label>
                  <Field
                    name="intendedUse"
                    type="text"
                    placeholder="e.g., Corporate headquarters, Retail store"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <ErrorMessage name="intendedUse" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              {/* Amenities and Services */}
              <div className="space-y-6 border border-gray-300 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Amenities and Services</h4>

                <div>
                  <label className="block text-sm font-medium mb-2">Parking Spaces Required</label>
                  <Field
                    name="parkingSpaces"
                    type="number"
                    placeholder="10"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Additional Terms</h3>
            <p>Define optional terms, conditions, and special requirements for your lease.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Renewal Options */}
              <div className="space-y-6 border border-gray-300 rounded-lg p-6">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-blue-500" />
                  <h4 className="text-lg font-semibold">Renewal Options</h4>
                </div>
                
                <div className="flex items-center gap-2">
                  <Field
                    name="renewalOption"
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm">Include renewal option in LOI</label>
                </div>
              </div>

              {/* Tenant Improvements */}
              <div className="space-y-6 border border-gray-300 rounded-lg p-6">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-green-500" />
                  <h4 className="text-lg font-semibold">Tenant Improvements</h4>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Improvement Allowance</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Field
                      name="improvementAllowance"
                      type="number"
                      placeholder="25000"
                      className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Amount landlord will contribute to tenant improvements</p>
                </div>
              </div>
            </div>

            {/* Special Conditions */}
            <div className="border border-gray-300 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-purple-500" />
                <h4 className="text-lg font-semibold">Special Conditions</h4>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Special Conditions or Requirements</label>
                <Field
                  as="textarea"
                  name="specialConditions"
                  placeholder="Any special terms, conditions, or requirements specific to this lease..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Contingencies */}
            <div className="border border-gray-300 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <h4 className="text-lg font-semibold">Contingencies</h4>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">Select any conditions that must be met before the lease can be finalized:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Field
                    name="financingApproval"
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm">Financing Approval</label>
                </div>

                <div className="flex items-center gap-2">
                  <Field
                    name="environmentalAssessment"
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm">Environmental Assessment</label>
                </div>

                <div className="flex items-center gap-2">
                  <Field
                    name="zoningCompliance"
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm">Zoning Compliance</label>
                </div>

                <div className="flex items-center gap-2">
                  <Field
                    name="permitsLicenses"
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm">Permits & Licenses</label>
                </div>

                <div className="flex items-center gap-2">
                  <Field
                    name="propertyInspection"
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm">Property Inspection</label>
                </div>

                <div className="flex items-center gap-2">
                  <Field
                    name="insuranceApproval"
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm">Insurance Approval</label>
                </div>
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-orange-900">Important Note</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    These terms are negotiable and may impact the final lease. Consider consulting a commercial real estate attorney for complex issues.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Review & Submit</h3>
            <p>Review all the information below and submit your Letter of Intent.</p>

            {/* Ready to Submit Card */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Ready to Submit</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your LOI is complete and ready to be submitted. You can download a PDF copy or send it directly to the landlord.
                  </p>
                  <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                    Download ↓
                  </button>
                </div>
              </div>
            </div>

            {/* Review Sections */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Basic Information</h4>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>LOI Title:</strong> {values.loiTitle || 'Not Specified'}
                  </div>
                  <div>
                    <strong>Property Address:</strong> {values.propertyAddress || 'Not Specified'}
                  </div>
                  <div>
                    <strong>Landlord:</strong> {values.landlordName || 'Not Specified'}
                  </div>
                  <div>
                    <strong>Tenant:</strong> {values.tenantName || 'Not Specified'}
                  </div>
                </div>
              </div>

              {/* Lease Terms */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Lease Terms</h4>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Monthly Rent:</strong> ${values.rentAmount || 'Not Specified'}
                  </div>
                  <div>
                    <strong>Security Deposit:</strong> ${values.securityDeposit || 'Not Specified'}
                  </div>
                  <div>
                    <strong>Property Type:</strong> {values.propertyType || 'Not Specified'}
                  </div>
                  <div>
                    <strong>Lease Duration:</strong> {values.leaseDuration ? `${values.leaseDuration} months` : 'Not Specified'}
                  </div>
                  <div>
                    <strong>Start Date:</strong> {values.startDate || 'Not Specified'}
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Property Details</h4>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Property Size:</strong> {values.propertySize ? `${values.propertySize} sq ft` : 'Not Specified'}
                  </div>
                  <div>
                    <strong>Intended Use:</strong> {values.intendedUse || 'Not Specified'}
                  </div>
                  <div>
                    <strong>Parking Spaces:</strong> {values.parkingSpaces || 'Not Specified'}
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. LOI will be sent to the landlord for review</li>
                <li>2. You'll receive notifications about the status</li>
                <li>3. Negotiate terms and proceed to lease agreement</li>
              </ol>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-center gap-2">
              <Field
                name="terms"
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm">
                I agree to the terms and conditions and confirm that the information provided is accurate.
              </label>
            </div>
            <ErrorMessage name="terms" component="div" className="text-red-500 text-sm" />
          </div>
        );

      default:
        return null;
    }
  };

 return (
  <DashboardLayout>
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4">
          {/* Left Section: Back Button and Title */}
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ChevronLeft className="w-4 h-4" />
              Back to LOI Dashboard
            </button>
            <div className="w-px h-10 bg-gray-300" />
            <div>
              <h1 className="text-2xl font-bold">Create New LOI</h1>
              <p className="text-sm text-gray-600">
                Complete all steps to generate your Letter of Intent
              </p>
            </div>
          </div>

          {/* Right Section: Action Buttons */}
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
              Save Draft
            </button>
            <button className="px-4 py-2 text-sm border border-blue-600 rounded-md text-blue-600 hover:bg-blue-50">
              AI Assistant
            </button>
          </div>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemas[currentStep]}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form>

              {/* Stepper */}
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep === step.id
                            ? 'bg-blue-500 text-white'
                            : isStepComplete(step.id, values)
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                        }`}>
                          {isStepComplete(step.id, values) && currentStep > step.id ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            step.id
                          )}
                        </div>
                        <div className="text-center mt-2">
                          <div className="text-sm font-medium">{step.title}</div>
                          <div className="text-xs text-gray-500">{step.subtitle}</div>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-24 h-0.5 mx-4 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                {renderStepContent(values, setFieldValue, errors, touched)}
              </div>

              {/* Footer Navigation */}
              <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 bg-gray-50">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    currentStep === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  type="submit"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    isStepComplete(currentStep, values)
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!isStepComplete(currentStep, values)}
                >
                  {currentStep === steps.length ? (
                    <>
                      <Check className="w-4 h-4" />
                      Submit
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  </DashboardLayout>
); 
}
export default CreateLoiForm;
