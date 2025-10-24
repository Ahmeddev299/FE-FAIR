// pages/.../CreateLeaseForm.tsx
import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { DashboardLayout } from '@/components/layouts';
import { useAppDispatch } from '@/hooks/hooks';
import { useFormStepper } from '../../../hooks/useLeaseFormStepper';
import { useRouter } from 'next/router';

// —— services (lease) ——
// import { submitLeaseAsync, getLeaseDetailsById } from '@/services/lease/asyncThunk';


// —— shared UI ——
import { FormHeader } from '../../../components/FormHeader';
import { StepperNavigation } from '../../../components/StepperNavigation';
import { FormNavigation } from '../../../components/FormNavigation';
import { LEASE_EDIT_INITIAL_VALUES, LEASE_INITIAL_VALUES, LeaseFormValues } from '@/types/lease';
import { BasicInformationStep } from '@/components/dashboard/lease/steps/leasebasicInformation'
import { LeasePremisesStep } from '@/components/dashboard/lease/steps/premises'
import { LeaseTermRentStep, LeaseTermTimingStep } from '@/components/dashboard/lease/steps/termTiming'
import { LeaseReviewSubmitStep } from '@/components/dashboard/lease/steps/reviewlease';
import { LeaseAdditionalTermsStep } from '@/components/dashboard/lease/steps/leaseadditionalterms';
import { normalizeLease } from '@/utils/normalizeLease';
import { Step } from '@/types/loi';
import { LeaseRightsOptionsStep } from '@/components/dashboard/lease/steps/rightOptions';
import { LeaseOpsMaintenanceStep } from '@/components/dashboard/lease/steps/LeaseOpsMaintenance';
import { LeaseRentEconomicsStep } from '@/components/dashboard/lease/steps/rentEconomics';

// —— lease steps ——


interface Props {
  mode?: 'edit' | 'create';
  leaseId?: string;
}

const CreateLeaseForm: React.FC<Props> = ({ mode = 'create', leaseId }) => {
  const dispatch = useAppDispatch();
  const { currentStep, nextStep, prevStep, isStepComplete, steps, jumpToStep } = useFormStepper();
  const [initialData, setInitialData] = useState<LeaseFormValues | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const router = useRouter();

  //   useEffect(() => {
  //     if (mode === 'edit' && leaseId) {
  //       (async () => {
  //         try {
  //           const resultAction = await dispatch(getLeaseDetailsById(leaseId));
  //           const leaseDetails = unwrapResult(resultAction);
  //           setInitialData(LEASE_EDIT_INITIAL_VALUES(leaseDetails));
  //         } catch (err) {
  //           console.error('[Lease] Error fetching details', err);
  //         }
  //       })();
  //     }
  //   }, [mode, leaseId, dispatch]);

  const handleSubmit = async (formValues: LeaseFormValues) => {
    try {
      if (currentStep === steps.length) {
        console.log("values 59", formValues)
        setSubmitting(true);
        const payload = normalipzeLease(formValues)
        console.log("lease payload", payload)
        // await dispatch(submitLeaseAsync({ ...formValues, submit_status: 'Submitted' })).unwrap();
        setLastSaved(new Date().toLocaleTimeString());
        // router.push({ pathname: '/dashboard/leases', query: { success: 'lease_submitted' } });
      } else {
        nextStep();
      }
    } catch (error) {
      console.error('[Lease] Submit failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  //   const saveAsDraft = async (formValues: LeaseFormValues) => {
  //     try {
  //       setSaving(true);
  //       await dispatch(submitLeaseAsync({ ...formValupes, submit_status: 'Draft' })).unwrap();
  //       setLastSaved(new Date().toLocaleTimeString());
  //     } catch (error) {
  //       console.error('[Lease] Save draft failed:', error);
  //     } finally {
  //       setSaving(false);
  //     }
  //   };

  const renderStepContent = (values: LeaseFormValues) => {
    switch (currentStep) {
      case 1: return <BasicInformationStep />;
            case 2: return <LeasePremisesStep />;
      case 3: return <LeaseTermTimingStep  />;
      case 4: return <LeaseRentEconomicsStep />;
      case 5: return <LeaseOpsMaintenanceStep />;
      case 6: return <LeaseRightsOptionsStep />;
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
          //   validationSchema={LEASE_VALIDATION_SCHEMAS[currentStep as keyof typeof LEASE_VALIDATION_SCHEMAS]}
          onSubmit={handleSubmit}
        >
          {({ values, isValid, validateForm }) => (
            <Form>
              <FormHeader
                mode={mode}
                // onSaveDraft={() => saveAsDraft(values)}
                isLoading={saving}
                lastSaved={lastSaved}
                aiEnabled={false} // keep off for lease (can wire later)
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
          )}
        </Formik>
      </div>
    </DashboardLayout>
  );
};

export default CreateLeaseForm;
