// components/FormNavigation.tsx
import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isStepValid: boolean;
  onPrevStep: () => void;
  onSubmit: () => void;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  isStepValid,
  onPrevStep,
  onSubmit
}) => (
  <div className="flex items-center mt-4 justify-between border-t border-gray-200 px-6 py-4 bg-gray-50">
    <button
      type="button"
      onClick={onPrevStep}
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
      onClick={onSubmit}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
        isStepValid
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
      }`}
      disabled={!isStepValid}
    >
      {currentStep === totalSteps ? (
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
);