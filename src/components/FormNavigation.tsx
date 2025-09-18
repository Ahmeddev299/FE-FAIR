"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { LoadingOverlay } from "./loaders/overlayloader";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isStepValid: boolean;
  isSubmitting?: boolean; 
  onPrevStep: () => void;
  onSubmit: () => void;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  isStepValid,
  isSubmitting = false,
  onPrevStep,
  onSubmit,
}) => {
  console.log("FormNavigation - currentStep:", currentStep);

  const isDisabled = !isStepValid || isSubmitting;
  const isLastStep = currentStep === totalSteps;

  return (
    <>
      {/* Fullscreen overlay while submitting/processing */}
    <LoadingOverlay
        visible={isSubmitting}
        size="default"
        fullscreen={true} 
      />
      <div
        className="mt-4 flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4"
        aria-busy={isSubmitting}
      >
        <button
          type="button"
          onClick={() => {
            console.log("Back button clicked, current step:", currentStep);
            onPrevStep();
          }}
          disabled={currentStep === 1 || isSubmitting}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
            currentStep === 1 || isSubmitting
              ? "cursor-not-allowed bg-gray-200 text-gray-500"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={() => {
            onSubmit();
          }}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
            isDisabled ? "cursor-not-allowed bg-gray-200 text-gray-500" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          disabled={isDisabled}
        >
          {isSubmitting ? (
              <LoadingOverlay
                  visible={isSubmitting}
                  size="default"
                  fullscreen={true} 
                />
          ) : isLastStep ? (
            <>
              <Check className="h-4 w-4" />
              Submit
            </>
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </>
  );
};


{/* <LoadingOverlay
        visible={isDownloadingLoi}
        size="default"
        fullscreen={true} 
      /> */}