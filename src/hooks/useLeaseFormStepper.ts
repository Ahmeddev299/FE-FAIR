// hooks/useFormStepper.ts
import { Step } from '@/types/loi';
import { useState, useCallback } from 'react';

export const STEPS: Step[] = [
    { id: 1, title: "Basic Information", subtitle: "Parties & meta" },
    { id: 2, title: "Property Details", subtitle: "Premises & parking" },

    { id: 3, title: "Term & Timing", subtitle: "Dates & triggers" },
    { id: 4, title: "Rent & Economics", subtitle: "Base rent & escalation" },
    { id: 5, title: "Operations & Maintenance", subtitle: "NNN, insurance, upkeep" },
    { id: 6, title: "Rights, Options & Conditions", subtitle: "Use, options, legal terms" },
    { id: 7, title: "Review & Submit", subtitle: "Final review" },
];


export const useFormStepper = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const nextStep = useCallback(() => {
        console.log('nextStep called, current:', currentStep);
        setCurrentStep(prev => {
            const next = Math.min(prev + 1, STEPS.length);
            return next;
        });
    }, []);

    const prevStep = useCallback(() => {
        console.log('prevStep called, current:', currentStep);
        setCurrentStep(prev => {
            const previous = Math.max(prev - 1, 1);
            return previous;
        });
    }, []);

    const goToStep = useCallback((step: number) => {
        setCurrentStep(Math.max(1, Math.min(step, STEPS.length)));
    }, []);

    const isStepComplete = useCallback((step: number) => {
        return step < currentStep;
    }, [currentStep]);

    const resetStepper = useCallback(() => {
        setCurrentStep(1);
    }, []);


    const jumpToStep = (step: number) => {
        if (step >= 1 && step <= STEPS.length) setCurrentStep(step);
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return {
        currentStep,
        nextStep,
        prevStep,
        goToStep,
        isStepComplete,
        resetStepper,
        steps: STEPS,
        jumpToStep
    };
};