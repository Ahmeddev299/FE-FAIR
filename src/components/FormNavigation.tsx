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
}) => {
  console.log("FormNavigation - currentStep:", currentStep);
  
  return (
    <div className="flex items-center mt-4 justify-between border-t border-gray-200 px-6 py-4 bg-gray-50">
      <button
        type="button"
        onClick={() => {
          console.log("Back button clicked, current step:", currentStep);
          onPrevStep();
        }}
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
        type="button" // Changed from "submit" to "button" to prevent form submission
        onClick={() => {
          console.log("Next/Submit button clicked, current step:", currentStep);
          onSubmit();
        }}
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
};