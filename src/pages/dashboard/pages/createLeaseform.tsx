// pages/.../CreateLeaseForm.tsx
import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { DashboardLayout } from '@/components/layouts';
import { useFormStepper } from '../../../hooks/useLeaseFormStepper';

// Import validation schemas
import { LEASE_VALIDATION_SCHEMAS } from '@/validations/leaseValidation';

// Shared UI
import { FormHeader } from '../../../components/FormHeader';
import { StepperNavigation } from '../../../components/StepperNavigation';
import { FormNavigation } from '../../../components/FormNavigation';
import { LEASE_INITIAL_VALUES, LeaseFormValues } from '@/types/lease';
import { BasicInformationStep } from '@/components/dashboard/lease/steps/leasebasicInformation';
import { LeasePremisesStep } from '@/components/dashboard/lease/steps/premises';
import { LeaseReviewSubmitStep } from '@/components/dashboard/lease/steps/reviewlease';
import { normalizeLease } from '@/utils/normalizeLease';
import { LeaseOpsMaintenanceStep } from '@/components/dashboard/lease/steps/LeaseOpsMaintenance';
import { LeaseRentEconomicsStep } from '@/components/dashboard/lease/steps/rentEconomics';
import { LeaseTermTimingStep } from '@/components/dashboard/lease/steps/termTiming';
import { UseHoursExclusivesSection } from '@/components/dashboard/lease/steps/rightOptions';
import { useAppDispatch } from '@/hooks/hooks';
import { submitLeaseAsync } from '@/services/lease/asyncThunk';
import { useRouter } from 'next/router';
import { clearLoiIdInSession, getLoiIdFromSession } from '@/utils/loisesion';

interface Props {
  mode?: 'edit' | 'create';
  leaseId?: string;
}

const CreateLeaseForm: React.FC<Props> = ({ mode = 'create', loiId }) => {
  const { currentStep, nextStep, prevStep, isStepComplete, steps, jumpToStep } = useFormStepper();
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Add this helper function at the top of your component or in a utils file
  // const downloadFileFromUrl = async (url: string, filename: string = 'lease-document.pdf') => {
  //   try {
  //     const response = await fetch(url);
  //     const blob = await response.blob();
  //     const blobUrl = window.URL.createObjectURL(blob);

  //     const link = document.createElement('a');
  //     link.href = blobUrl;
  //     link.download = filename;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //     // Clean up the blob URL
  //     window.URL.revokeObjectURL(blobUrl);
  //   } catch (error) {
  //     console.error('Download failed:', error);
  //     // Fallback: open in new tab
  //     window.open(url, '_blank');
  //   }
  // };

  // const handleSubmit = async (formValues: LeaseFormValues) => {
  //   try {
  //     if (currentStep === steps.length) {
  //       console.log("values", formValues);
  //       setSubmitting(true);
  //       const payload = normalizeLease(formValues);
  //       console.log("lease payload", payload);

  //       // Submit the lease and get the response
  //       const response = await dispatch(
  //         submitLeaseAsync({ ...payload, submit_status: "Submitted" } as any)
  //       ).unwrap();

  //       setLastSaved(new Date().toLocaleTimeString());
  //       console.log("resposme", response.link)
  //       // Automatically download the document if link is available
  //       if (response?.link) {

  //         console.log('Starting document download from:', response.link);

  //         // Use the download helper function
  //         await downloadFileFromUrl(
  //           response.link,
  //           `lease-${Date.now()}.pdf` // Dynamic filename with timestamp
  //         );
  //       }

  //       // Navigate to leases page after successful submission
  //       // router.push({ pathname: '/dashboard/leases', query: { success: 'lease_submitted' } });
  //     } else {
  //       nextStep();
  //     }
  //   } catch (error) {
  //     console.error('[Lease] Submit failed:', error);
  //     alert('Failed to submit lease. Please try again.');
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
  //   const saveAsDraft = async () => {
  //     try {
  //       setSaving(true);
  //       // await dispatch(submitLeaseAsync({ ...formValues, submit_status: 'Draft' })).unwrap();
  //       setLastSaved(new Date().toLocaleTimeString());
  //     } catch (error) {
  //       console.error('[Lease] Save draft failed:', error);
  //     } finally {
  //       setSaving(false);
  //     }
  //   };

  useEffect(() => {
    if (mode === "create") {
      clearLoiIdInSession();
      // (optional) if you also saved to localstorage-slim earlier, cleaaar that too:
      // ls.remove("loi_id");
      console.log("[LOI] reset loi_id for new Create session");
    }
  }, [mode]);

  const handleSubmit = async (formValues: LeaseFormValues) => {
    console.log("values", formValues)
    try {
      if (currentStep === steps.length) {
        setSubmitting(true);

        const storedLoiId = getLoiIdFromSession();
        const effectiveLoiId = storedLoiId || loiId || undefined;

        const apiPayload = normalizeLease(formValues, effectiveLoiId);


        const response = await dispatch(
          submitLeaseAsync({ ...apiPayload, submit_status: "Submitted" } as any)
        ).unwrap();;

        setLastSaved(new Date().toLocaleTimeString());
        router.push({ pathname: "/dashboard/pages/mainpage", query: { success: "lease_submitted" } });
      } else {
        nextStep();
      }
    } catch (error) {
      console.error("Failed to submit Lease:", error);
    } finally {
      setSubmitting(false);
    }
  };


  const saveAsDraft = async (formValues: LeaseFormValues) => {
    try {
      setSaving(true);

      const storedLoiId = getLoiIdFromSession();
      const effectiveLoiId = storedLoiId || loiId || undefined;

      const draftPayload = normalizeLease(formValues, effectiveLoiId);
      await dispatch(submitLeaseAsync({ ...draftPayload, submit_status: "Draft" })).unwrap();

      router.push({ pathname: "/dashboard/pages/start", query: { success: "loi_submitted" } });
      setLastSaved(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to save draft:", error);
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = (values: LeaseFormValues) => {
    switch (currentStep) {
      case 1: return <BasicInformationStep />;
      case 2: return <LeasePremisesStep />;
      case 3: return <LeaseTermTimingStep />;
      case 4: return <LeaseRentEconomicsStep />;
      case 5: return <LeaseOpsMaintenanceStep />;
      case 6: return <UseHoursExclusivesSection />;
      case 7: return <LeaseReviewSubmitStep values={values} onEdit={jumpToStep} />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full mx-auto">
        <Formik
          initialValues={LEASE_INITIAL_VALUES}
          enableReinitialize
          validationSchema={LEASE_VALIDATION_SCHEMAS[currentStep as keyof typeof LEASE_VALIDATION_SCHEMAS]}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ values, isValid, validateForm, errors, touched }) => (
            <Form>
              <FormHeader
                mode={mode}
                onSaveDraft={() => saveAsDraft()}
                isLoading={saving}
                lastSaved={lastSaved}
                aiEnabled={false}
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
                  const validationErrors = await validateForm();
                  console.log('Validation errors:', validationErrors);
                  console.log('Touched fields:', touched);

                  if (Object.keys(validationErrors).length === 0) {
                    await handleSubmit(values);
                  } else {
                    // Show error message to user
                    alert('Please fill in all required fields before continuing.');
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

export default CreateLeaseForm;
