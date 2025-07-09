import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Info } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';

const CreateLoiForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    loiTitle: '',
    propertyAddress: '',

    // Party Information
    landlordName: '',
    landlordEmail: '',
    tenantName: '',
    tenantEmail: '',

    // Property Details
    propertyType: '',
    propertySize: '',
    rentAmount: '',

    // Additional Terms
    leaseLength: '',
    moveInDate: '',
    securityDeposit: '',

    // Review & Submit
    terms: false
  });

  const steps = [
    { id: 1, title: 'Basic Information', subtitle: 'Property and party details' },
    { id: 2, title: 'Lease Terms', subtitle: 'Key lease particulars' },
    { id: 3, title: 'Property Details', subtitle: 'Size and specifications' },
    { id: 4, title: 'Additional Terms', subtitle: 'Deposit and timelines' },
    { id: 5, title: 'Review & Submit', subtitle: 'Final review' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

  const isStepComplete = (stepId) => {
    switch (stepId) {
      case 1:
        return formData.loiTitle && formData.propertyAddress && formData.landlordName && formData.tenantName;
      case 2:
        return formData.propertyType && formData.rentAmount;
      case 3:
        return formData.propertySize;
      case 4:
        return formData.leaseLength && formData.moveInDate;
      case 5:
        return formData.terms;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Basic  Information
            </h3>
            <p>Let's start with the essential details about your LOI and the parties involved.</p>
            {/* Two-column grid: LOI & Property Details (left) and Party Information (right) */}
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
                    <input
                      type="text"
                      value={formData.loiTitle}
                      onChange={(e) => handleInputChange('loiTitle', e.target.value)}
                      placeholder="e.g., Downtown Office Space LOI"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Property Address *</label>
                    <input
                      type="text"
                      value={formData.propertyAddress}
                      onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                      placeholder="123 Main Street, City, State, ZIP"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    Landlord Information
                  </h3>
                </div>


                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Landlord Name *</label>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.landlordName}
                        onChange={(e) => handleInputChange('landlordName', e.target.value)}
                        placeholder="Property Owner or Management Company"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className="block text-sm font-medium mb-2">Landlord Email *</label>

                    <input
                      type="email"
                      value={formData.landlordEmail}
                      onChange={(e) => handleInputChange('landlordEmail', e.target.value)}
                      placeholder="landlord@example.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        Tenant Information
                      </h3>
                    </div>

                    <label className="block text-sm font-medium mb-2">Tenant Name *</label>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.landlordName}
                        onChange={(e) => handleInputChange('landlordName', e.target.value)}
                        placeholder="Property Owner or Management Company"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className="block text-sm font-medium mb-2">Landlord Email *</label>

                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.tenantName}
                        onChange={(e) => handleInputChange('tenantName', e.target.value)}
                        placeholder="Your Company Name"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />

                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Pro Tip - Full Width */}
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
              {/* {right side} */}

              <div className="space-y-6 border border-gray-300 rounded-lg p-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Rent *</label>
                  <input
                    type="text"
                    value={formData.loiTitle}
                    onChange={(e) => handleInputChange('loiTitle', e.target.value)}
                    placeholder="$ 5000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Security Deposit *</label>
                  <input
                    type="text"
                    value={formData.loiTitle}
                    onChange={(e) => handleInputChange('loiTitle', e.target.value)}
                    placeholder="$ 10,000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Lease Type *</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select property type</option>
                    <option value="office">Office</option>
                    <option value="retail">Retail</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="residential">Residential</option>
                    <option value="mixed-use">Mixed Use</option>
                  </select>
                </div>
              </div>

              {/* left side */}
              <div className="space-y-6 border border-gray-300 rounded-lg p-6">
                 <h3 className="text-lg font-semibold mb-4">Timing Terms </h3>

                <div>
                  <label className="block text-sm font-medium mb-2">Lease Duration *</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange('LeaseDurationmonths', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Duration</option>
                    <option value="12months">12 months</option>
                    <option value="24months">24 months</option>
                    <option value="36months">36 months</option>
                    <option value="48months">48 months</option>
                    <option value="60months">60 months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Start Date *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="date"
                      value={formData.rentAmount}
                      onChange={(e) => handleInputChange('rentAmount', e.target.value)}
                      className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Property Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Property Size *</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.propertySize}
                    onChange={(e) => handleInputChange('propertySize', e.target.value)}
                    placeholder="1,200"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="sq-ft">sq ft</option>
                    <option value="sq-m">sq m</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional Features</label>
                <textarea
                  placeholder="Parking spaces, amenities, special features..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Additional Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Lease Length *</label>
                <select
                  value={formData.leaseLength}
                  onChange={(e) => handleInputChange('leaseLength', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select lease length</option>
                  <option value="6-months">6 months</option>
                  <option value="1-year">1 year</option>
                  <option value="2-years">2 years</option>
                  <option value="3-years">3 years</option>
                  <option value="5-years">5 years</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preferred Move-in Date *</label>
                <input
                  type="date"
                  value={formData.moveInDate}
                  onChange={(e) => handleInputChange('moveInDate', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Security Deposit</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.securityDeposit}
                    onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                    placeholder="5,000"
                    className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Review & Submit</h3>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>LOI Title:</strong> {formData.loiTitle}
                </div>
                <div>
                  <strong>Property Address:</strong> {formData.propertyAddress}
                </div>
                <div>
                  <strong>Landlord:</strong> {formData.landlordName}
                </div>
                <div>
                  <strong>Tenant:</strong> {formData.tenantName}
                </div>
                <div>
                  <strong>Property Type:</strong> {formData.propertyType}
                </div>
                <div>
                  <strong>Monthly Rent:</strong> ${formData.rentAmount}
                </div>
                <div>
                  <strong>Property Size:</strong> {formData.propertySize} sq ft
                </div>
                <div>
                  <strong>Lease Length:</strong> {formData.leaseLength}
                </div>
                <div>
                  <strong>Move-in Date:</strong> {formData.moveInDate}
                </div>
                <div>
                  <strong>Security Deposit:</strong> ${formData.securityDeposit}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.terms}
                onChange={(e) => handleInputChange('terms', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm">
                I agree to the terms and conditions and confirm that the information provided is accurate.
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg px-6 py-4 mb-8">
          {/* Left Section: Back Button and Title */}
          <div className="flex items-center gap-6">
            {/* Back Button */}
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ChevronLeft className="w-4 h-4" />
              Back to LOI Dashboard
            </button>

            {/* Divider */}
            <div className="w-px h-10 bg-gray-300" />

            {/* Title and Subtitle */}
            <div>
              <h1 className="text-2xl font-bold">Create New LOI</h1>
              <p className="text-sm text-gray-600">Complete all steps to generate your Letter of Intent</p>
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

        {/* Stepper */}
        <div className="border border-gray-300 bg-white rounded-lg p-3 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === step.id
                    ? 'bg-blue-500 text-white'
                    : isStepComplete(step.id)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                    }`}>
                    {isStepComplete(step.id) && currentStep > step.id ? (
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
                  <div className={`w-24 h-0.5 mx-4 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="border border-gray-300  bg-white rounded-lg p-3 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentStep === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </div>

          <button
            onClick={currentStep === steps.length ? () => alert('LOI Submitted!') : nextStep}
            disabled={!isStepComplete(currentStep)}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg ${isStepComplete(currentStep)
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {currentStep === steps.length ? 'Submit LOI' : 'Next Step'}
            {currentStep < steps.length && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateLoiForm;