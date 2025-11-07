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
import { getLeaseDetailsById, submitLeaseAsync } from '@/services/lease/asyncThunk';
import { useRouter } from 'next/router';
import {  getLoiIdFromSession } from '@/utils/loisesion';
import { unwrapResult } from '@reduxjs/toolkit';
import { mapLeaseApiToForm } from '@/components/dashboard/lease/utils/leaseMappers';
import { clearLeaseIdInSession, getLeaseIdFromSession } from '@/utils/leasesession';

interface Props {
  mode?: 'edit' | 'create';
  leaseId?: string;
}

const CreateLeaseForm: React.FC<Props> = ({ mode = 'create', leaseId }) => {
  const { currentStep, nextStep, prevStep, isStepComplete, steps, jumpToStep } = useFormStepper();
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<LeaseFormValues | null>(null);
  console.log("initialDayta", initialData)

  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (mode === "create") {
      clearLeaseIdInSession();
      console.log("[LOI] reset loi_id for new Create session");
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "edit" && leaseId) {
      (async () => {
        try {
          const resultAction = await dispatch(getLeaseDetailsById(leaseId));
          const payload = unwrapResult(resultAction);   // your JSON shown above
          setInitialData(mapLeaseApiToForm(payload));
        } catch (err) {
          console.error("Error fetching LOI details", err);
        }
      })();
    }
  }, [mode, leaseId, dispatch]);


  const handleSubmit = async (formValues: LeaseFormValues) => {
    console.log("values", formValues)
    try {
      if (currentStep === steps.length) {
        setSubmitting(true);

        const storedLoiId = getLeaseIdFromSession();
        const effectiveLoiId = storedLoiId || leaseId || undefined;

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

      const storedLoiId = getLeaseIdFromSession();
      const effectiveLoiId = storedLoiId || leaseId || undefined;

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
    console.log("values", values)
    switch (currentStep) {
      case 1: return <BasicInformationStep />;
      case 2: return <LeasePremisesStep />;
      case 3: return <LeaseTermTimingStep />;
      case 4: return <LeaseRentEconomicsStep />;
      case 5: return <LeaseOpsMaintenanceStep />;
      case 6: return <UseHoursExclusivesSection />;
      case 7: return <LeaseReviewSubmitStep leaseId={leaseId} values={values} onEdit={jumpToStep} />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full mx-auto">
        <Formik
          initialValues={initialData || LEASE_INITIAL_VALUES}
          enableReinitialize
          validationSchema={LEASE_VALIDATION_SCHEMAS[currentStep as keyof typeof LEASE_VALIDATION_SCHEMAS]}
          onSubmit={handleSubmit}
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
