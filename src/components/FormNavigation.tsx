// components/FormNavigation.tsx
import React from 'react';
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isStepValid: boolean;
  isSubmitting?: boolean; // Add this new prop for loading state
  onPrevStep: () => void;
  onSubmit: () => void;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  isStepValid,
  isSubmitting = false, // Default to false if not provided
  onPrevStep,
  onSubmit
}) => {
  console.log("FormNavigation - currentStep:", currentStep);
  
  const isDisabled = !isStepValid || isSubmitting;
  const isLastStep = currentStep === totalSteps;
  
  return (
    <div className="flex items-center mt-4 justify-between border-t border-gray-200 px-6 py-4 bg-gray-50">
      <button
        type="button"
        onClick={() => {
          console.log("Back button clicked, current step:", currentStep);
          onPrevStep();
        }}
        disabled={currentStep === 1 || isSubmitting} // Disable during submission
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
          currentStep === 1 || isSubmitting
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <button
        type="button"
        onClick={() => {
          console.log("Next/Submit button clicked, current step:", currentStep);
          onSubmit();
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
          isDisabled
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        disabled={isDisabled}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {isLastStep ? 'Submitting...' : 'Processing...'}
          </>
        ) : isLastStep ? (
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
};