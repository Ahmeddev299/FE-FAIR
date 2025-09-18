// pages/.../CreateLoiForm.tsx
import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { DashboardLayout } from '@/components/layouts';
import { submitLOIAsync, getLOIDetailsById, runAiAssistantAsync } from '@/services/loi/asyncThunk';
import { useAppDispatch } from '@/hooks/hooks';
import { useFormStepper } from '../../../hooks/useFormStepper';
import { transformToApiPayload } from '../../../utils/apiTransform';
import { INITIAL_VALUES, VALIDATION_SCHEMAS, EDIT_INITIAL_VALUES, FormValues } from '../../../constants/formData'
import { FormHeader } from '../../../components/FormHeader';
import { StepperNavigation } from '../../../components/StepperNavigation';
import { FormNavigation } from '../../../components/FormNavigation';
import { BasicInformationStep } from '../../../components/steps/BasicInformation';
import { LeaseTermsStep } from '@/components/steps/LeaseTermsSteps';
import { PropertyDetailsStep } from '@/components/steps/PropertyDetailsStep';
import { AdditionalTermsStep } from '@/components/steps/AdditionalTermsSteps';
import { ReviewSubmitStep } from '@/components/steps/ReviewSubmitStep';
import { unwrapResult } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import AiAssistantModal from '@/components/models/aIAssistant';

interface Props {
  mode?: "edit" | "create";
  loiId?: string;
}

const CreateLoiForm: React.FC<Props> = ({ mode = 'create', loiId }) => {
  const dispatch = useAppDispatch();
  const { currentStep, nextStep, prevStep, isStepComplete, steps, jumpToStep } = useFormStepper();
  const [initialData, setInitialData] = useState<FormValues | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [applyingAI, setApplyingAI] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (mode === "edit" && loiId) {
      (async () => {
        try {
          const resultAction = await dispatch(getLOIDetailsById(loiId));
          const loiDetails = unwrapResult(resultAction);
          setInitialData(EDIT_INITIAL_VALUES(loiDetails));
        } catch (err) {
          console.error("Error fetching LOI details", err);
        }
      })();
    }
  }, [mode, loiId]);

  const handleSubmit = async (formValues: FormValues) => {
    console.log("values", formValues)
    try {
      if (currentStep === steps.length) {
        setSubmitting(true);
        const apiPayload = transformToApiPayload(formValues, loiId);
        await dispatch(submitLOIAsync(apiPayload)).unwrap();
        setLastSaved(new Date().toLocaleTimeString());
        router.push({ pathname: "/dashboard/pages/mainpage", query: { success: "loi_submitted" } });
      } else {
        nextStep();
      }
    } catch (error) {
      console.error("Failed to submit LOI:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const saveAsDraft = async (formValues: FormValues) => {
    try {
      setSaving(true);
      const draftPayload = transformToApiPayload(formValues , loiId);
      await dispatch(submitLOIAsync({ ...draftPayload, submit_status: "Draft" })).unwrap();
      router.push({ pathname: "/dashboard/pages/start", query: { success: "loi_submitted" } });
      setLastSaved(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to save draft:", error);
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = (formValues: FormValues) => {
    switch (currentStep) {
      case 1: return <BasicInformationStep />;
      case 2: return <LeaseTermsStep />;
      case 3: return <PropertyDetailsStep />;
      case 4: return <AdditionalTermsStep />;
      case 5: return <ReviewSubmitStep values={formValues} onEdit={jumpToStep} mode={mode}  />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <Formik
          initialValues={initialData || INITIAL_VALUES}
          enableReinitialize
          validationSchema={VALIDATION_SCHEMAS[currentStep as keyof typeof VALIDATION_SCHEMAS]}
          onSubmit={handleSubmit}
        >
          {({ values, isValid, validateForm }) => {
            const aiEnabled = currentStep === steps.length; // step 5 only
            // CreateLoiForm.tsx (inside Formik render)
            const askAI = async (note: string) => {
              console.log("note", note)
              setApplyingAI(true);
              try {
                const payload = transformToApiPayload(values);
                // API expects note included
                const res = await dispatch(runAiAssistantAsync({ ...payload, user_message:note })).unwrap();
                // res is expected to look like: { response: "..." }
                return res || {};
              } finally {
                setApplyingAI(false);
              }
            };

            return (
              <Form>
                <FormHeader
                  mode={mode}
                  onSaveDraft={() => saveAsDraft(values)}
                  isLoading={saving}
                  lastSaved={lastSaved}
                  aiEnabled={aiEnabled}
                  onOpenAi={() => setShowAiModal(true)}
                  aiBusy={applyingAI}
                />

                {/* Modal lives outside header */}

                <AiAssistantModal
                  open={showAiModal}
                  onClose={() => setShowAiModal(false)}
                  onAsk={askAI}
                  busy={applyingAI}
                />

                <StepperNavigation
                  steps={steps}
                  currentStep={currentStep}
                  isStepComplete={isStepComplete}
                  values={values}
                />

                <div className="p-6 space-y-6 bg-white rounded-lg mt-4">
                  {renderStepContent(values)}
                </div>

                <FormNavigation
                  currentStep={currentStep}
                  totalSteps={steps.length}
                  isStepValid={isValid}
                  isSubmitting={submitting}
                  onPrevStep={prevStep}
                  onSubmit={async () => {
                    const errors = await validateForm();
                    if (Object.keys(errors).length === 0) {
                      await handleSubmit(values);
                    }
                  }}
                />
              </Form>
            );
          }}
        </Formik>
      </div>
    </DashboardLayout>
  );
};

export default CreateLoiForm;
