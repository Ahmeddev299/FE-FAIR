
// hooks/useFormStepper.ts
import { useState } from 'react';
import { STEPS, VALIDATION_SCHEMAS } from '../constants/formData';
import { FormValues } from '../types/loi';

export const useFormStepper = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = (stepId: number, values: FormValues): boolean => {
    const schema = VALIDATION_SCHEMAS[stepId as keyof typeof VALIDATION_SCHEMAS];
    if (!schema) return false;

    try {
      schema.validateSync(values, { abortEarly: false });
      return true;
    } catch {
      return false;
    }
  };

  return {
    currentStep,
    nextStep,
    prevStep,
    isStepComplete,
    steps: STEPS
  };
};
