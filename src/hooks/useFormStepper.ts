// hooks/useFormStepper.ts
import { useState, useCallback } from 'react';
import { STEPS } from '@/constants/formData';

export const useFormStepper = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = useCallback(() => {
    console.log('nextStep called, current:', currentStep);
    setCurrentStep(prev => {
      const next = Math.min(prev + 1, STEPS.length);
      console.log('Moving from step', prev, 'to step', next);
      return next;
    });
  }, []);

  const prevStep = useCallback(() => {
    console.log('prevStep called, current:', currentStep);
    setCurrentStep(prev => {
      const previous = Math.max(prev - 1, 1);
      console.log('Moving from step', prev, 'to step', previous);
      return previous;
    });
  }, []);

  const goToStep = useCallback((step: number) => {
    console.log('goToStep called with:', step);
    setCurrentStep(Math.max(1, Math.min(step, STEPS.length)));
  }, []);

  const isStepComplete = useCallback((step: number) => {
    return step < currentStep;
  }, [currentStep]);

  const resetStepper = useCallback(() => {
    setCurrentStep(1);
  }, []);

  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    isStepComplete,
    resetStepper,
    steps: STEPS
  };
};