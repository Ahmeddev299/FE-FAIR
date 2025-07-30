// components/StepperNavigation.tsx
import React from 'react';
import { Check } from 'lucide-react';
import { Step, FormValues } from '../types/loi';

interface StepperNavigationProps {
  steps: Step[];
  currentStep: number;
  isStepComplete: (stepId: number, values: FormValues) => boolean;
  values: FormValues;
}

export const StepperNavigation: React.FC<StepperNavigationProps> = ({
  steps,
  currentStep,
  isStepComplete,
  values
}) => (
  <div className="bg-white mt-4 rounded-lg shadow-sm px-3 py-4 overflow-x-auto">
    <div className="flex items-start justify-between min-w-[600px] sm:min-w-full">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
              ${currentStep === step.id
                ? 'bg-blue-500 text-white'
                : isStepComplete(step.id, values)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'}
            `}>
              {isStepComplete(step.id, values) && currentStep > step.id ? (
                <Check className="w-5 h-5" />
              ) : (
                step.id
              )}
            </div>
            <div className="text-center mt-2 px-2">
              <div className="text-sm font-medium">{step.title}</div>
              <div className="text-xs text-gray-500">{step.subtitle}</div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div 
              className="h-0.5 mx-2 sm:mx-4"
              style={{ 
                width: '60px', 
                backgroundColor: currentStep > step.id ? '#22c55e' : '#e5e7eb' 
              }} 
            />
          )}
        </div>
      ))}
    </div>
  </div>
);