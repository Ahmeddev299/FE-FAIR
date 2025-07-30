// Main Component - CreateLoiForm.tsx
import React from 'react';
import { Formik, Form } from 'formik';
import { DashboardLayout } from '@/components/layouts';
import { submitLOIAsync } from '@/services/loi/asyncThunk';
import { useAppDispatch } from '@/hooks/hooks';
import { useFormStepper } from '../../../hooks/useFormStepper';
import { transformToApiPayload } from '../../../utils/apiTransform';
import { INITIAL_VALUES, VALIDATION_SCHEMAS } from '../../../constants/formData'
import { FormHeader } from '../../../components/FormHeader';
import { StepperNavigation } from '../../../components/StepperNavigation';
import { FormNavigation } from '../../../components/FormNavigation';
import { BasicInformationStep } from '../../../components/steps/BasicInformation';
import { FormValues } from '@/types/loi';
import { LeaseTermsStep } from '@/components/steps/LeaseTermsSteps';
import { PropertyDetailsStep } from '@/components/steps/PropertyDetailsStep';
import { AdditionalTermsStep } from '@/components/steps/AdditionalTermsSteps';
import { ReviewSubmitStep } from '@/components/steps/ReviewSubmitStep';
// Import other step components...

const CreateLoiForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentStep, nextStep, prevStep, isStepComplete, steps } = useFormStepper();

  const handleSubmit = async (formValues: FormValues) => {
    try {
      if (currentStep === steps.length) {
        const apiPayload = transformToApiPayload(formValues);
        await dispatch(submitLOIAsync(apiPayload)).unwrap();
        console.log('LOI submitted successfully!');
      } else {
        nextStep();
      }
    } catch (error) {
      console.error('Failed to submit LOI:', error);
    }
  };

   const saveAsDraft = async (formValues: FormValues) => {
    try {
      const draftPayload = transformToApiPayload(formValues);
      await dispatch(submitLOIAsync({ ...draftPayload, submit_status: 'Draft' })).unwrap();
      console.log('LOI saved as draft!');
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const renderStepContent = (formValues: FormValues) => {
    switch (currentStep) {
      case 1: return <BasicInformationStep />;
      case 2: return <LeaseTermsStep />;
      case 3: return <PropertyDetailsStep />;
      case 4: return <AdditionalTermsStep />;
      case 5: return <ReviewSubmitStep values={formValues} />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>

      <div className="max-w-5xl mx-auto">
        <Formik
          initialValues={INITIAL_VALUES}
          validationSchema={VALIDATION_SCHEMAS[currentStep as keyof typeof VALIDATION_SCHEMAS]}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form>
              <FormHeader onSaveDraft={() => saveAsDraft(values)} />
              <StepperNavigation
                steps={steps}
                currentStep={currentStep}
                isStepComplete={isStepComplete}
                values={values}
              />

              <div className="p-6 space-y-6 bg-white mt-2 rounded-lg mt-4">
                {renderStepContent(values)}
              </div>

              <FormNavigation
                currentStep={currentStep}
                totalSteps={steps.length}
                isStepValid={isStepComplete(currentStep, values)}
                onPrevStep={prevStep}
                onSubmit={() => handleSubmit(values)}
              />
            </Form>
          )}
        </Formik>
      </div>
    </DashboardLayout>
  );
};

export default CreateLoiForm;

