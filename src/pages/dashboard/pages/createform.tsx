// Main Component - CreateLoiForm.tsx
import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { DashboardLayout } from '@/components/layouts';
import { submitLOIAsync, getLOIDetailsById } from '@/services/loi/asyncThunk';
import { useAppDispatch } from '@/hooks/hooks';
import { useFormStepper } from '../../../hooks/useFormStepper';
import { transformToApiPayload } from '../../../utils/apiTransform';
import { INITIAL_VALUES, VALIDATION_SCHEMAS, EDIT_INITIAL_VALUES } from '../../../constants/formData'
import { FormHeader } from '../../../components/FormHeader';
import { StepperNavigation } from '../../../components/StepperNavigation';
import { FormNavigation } from '../../../components/FormNavigation';
import { BasicInformationStep } from '../../../components/steps/BasicInformation';
import { FormValues } from '@/types/loi';
import { LeaseTermsStep } from '@/components/steps/LeaseTermsSteps';
import { PropertyDetailsStep } from '@/components/steps/PropertyDetailsStep';
import { AdditionalTermsStep } from '@/components/steps/AdditionalTermsSteps';
import { ReviewSubmitStep } from '@/components/steps/ReviewSubmitStep';
import { unwrapResult } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';

interface Props {
  mode?: 'edit' | 'create';
  loiId?: string;
}

const CreateLoiForm: React.FC<Props> = ({ mode = 'create', loiId }) => {
  const dispatch = useAppDispatch();
  const { currentStep, nextStep, prevStep, isStepComplete, steps } = useFormStepper();
  const [initialData, setInitialData] = useState<FormValues | null>(null);
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false); // New state for final submission
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const router = useRouter(); // For Next.js
  useEffect(() => {
    if (mode === 'edit' && loiId) {
      (async () => {
        try {
          const resultAction = await dispatch(getLOIDetailsById(loiId));
          const loiDetails = unwrapResult(resultAction);
          console.log("loiDetails", loiDetails)
          setInitialData(EDIT_INITIAL_VALUES(loiDetails));
        } catch (err) {
          console.error('Error fetching LOI details', err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [mode, loiId]);

  const handleSubmit = async (formValues: FormValues) => {
    try {
      if (currentStep === steps.length) {
        console.log("currentStep", currentStep)
        setSubmitting(true); // Set loading state for final submission
        const apiPayload = transformToApiPayload(formValues, loiId);
        await dispatch(submitLOIAsync(apiPayload)).unwrap();
        console.log('LOI submitted successfully!');
        setLastSaved(new Date().toLocaleTimeString());
        router.push({
          pathname: '/dashboard/pages/start',
          query: {
            success: 'loi_submitted',
          }
        });
      } else {
        nextStep();
      }
    } catch (error) {
      console.error('Failed to submit LOI:', error);
    } finally {
      setSubmitting(false); // Reset loading state
    }
  };

  const saveAsDraft = async (formValues: FormValues) => {
    try {
      setSaving(true); // Set loading state for draft save
      const draftPayload = transformToApiPayload(formValues, loiId);
      await dispatch(submitLOIAsync({ ...draftPayload, submit_status: 'Draft' })).unwrap();
      console.log('LOI saved as draft!');
      router.push({
        pathname: '/dashboard/pages/start',
        query: {
          success: 'loi_submitted',
        }
      });
      setLastSaved(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setSaving(false); // Reset loading state
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

  if (loading && mode === 'edit') {
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-gray-500">Loading form data...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <Formik
          initialValues={initialData || INITIAL_VALUES}
          enableReinitialize
          validationSchema={VALIDATION_SCHEMAS[currentStep as keyof typeof VALIDATION_SCHEMAS]}
          onSubmit={handleSubmit}
        >
          {({ values, isValid, validateForm }) => (
            <Form>
              <FormHeader
                mode={mode}
                onSaveDraft={() => saveAsDraft(values)}
                isLoading={saving}
                lastSaved={lastSaved}
              />
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
                isStepValid={isValid}
                isSubmitting={submitting} // Pass submitting state
                onPrevStep={prevStep}
                onSubmit={async () => {
                  const errors = await validateForm();

                  if (Object.keys(errors).length === 0) {
                    await handleSubmit(values);
                  }
                }}
              />
            </Form>
          )}
        </Formik>
      </div>
    </DashboardLayout>
  );
};

export default CreateLoiForm;