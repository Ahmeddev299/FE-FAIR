// UploadLeaseForm.tsx - Refactored Main Component
import React, { useState } from 'react';
import { Formik, Form, FormikProps } from 'formik';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/layouts';
import { useAppDispatch } from '@/hooks/hooks';

// Import types
import { LeaseFormValues, FileData } from '@/types/loi';

// Import validation schema
import { validationSchema } from '@/validations/schemas';

// Import components
import { PageHeader } from '@/components/uploadLeaseForm/PageHeader';
import { FileUpload } from '@/components/uploadLeaseForm/FileUpload';
import { UploadedFiles } from '@/components/uploadLeaseForm/UploadedFile';
import { ContextForm } from '@/components/uploadLeaseForm/ContextForm';
import { AIBenefits } from '@/components/uploadLeaseForm/AIBenefits';
import { HelpSection } from '@/components/uploadLeaseForm/HelpSection';
import { SubmitButton } from '@/components/buttons/submitButton';
import { uploadLeaseAsync } from '@/services/lease/asyncThunk';
import Toast from '@/components/Toast';

const UploadLeaseForm: React.FC = () => {
    const [uploadedFile, setUploadedFile] = useState<FileData | null>(null);
    const router = useRouter();
    const dispatch = useAppDispatch()

    const initialValues: LeaseFormValues = {
        title: '',
        startDate: '',
        endDate: '',
        propertyAddress: '',
        notes: '',
        document: ''
    };

    const handleSubmit = async (
        values: LeaseFormValues,
        { setSubmitting }: { setSubmitting: (v: boolean) => void }
    ): Promise<void> => {
        try {
            if (!uploadedFile) {
                alert('Please upload a document before submitting.');
                return;
            }

            const formData = new FormData();
            formData.append('loi_id', values.leaseId);
            formData.append('lease_title', values.leaseTitle);
            formData.append('startDate', values.startDate);
            formData.append('endDate', values.endDate);
            formData.append('property_address', values.propertyAddress);
            formData.append('notes', values.notes);
            formData.append('file', uploadedFile.file);

            // unwrap gives you the typed payload or throws on reject
            const payload = await dispatch(uploadLeaseAsync(formData)).unwrap();

            // IDs from your sample response
            const leaseId = payload.Lease._id;
            const clauseDocId = payload.Clauses._id;

            // navigate with IDs (Pages Router)
            router.push({
                pathname: '/dashboard/pages/lease/review/[leaseId]',
                query: {
                    leaseId,
                    clauseDocId,                     // clauses document id
                },
            });
        } catch (err) {
            console.error('Upload error', err);
        Toast.fire({ icon: "error", title: err });
        } finally {
            setSubmitting(false);
        }
    };
    ;

    // uploadLeaseAsync
    return (
        <DashboardLayout>
            {/* Header */}
            <PageHeader />

            {/* Main Content */}
            <div className="w-full max-w-7xl xl:max-w-none mt-6 mx-auto px-4 sm:px-0">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, errors, touched, isSubmitting }: FormikProps<LeaseFormValues>) => (
                        <Form>
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                {/* Left Column - Upload Section */}
                                <div className="xl:col-span-2 space-y-6">
                                    {/* Document Upload */}
                                    <FileUpload
                                        uploadedFile={uploadedFile}
                                        setUploadedFile={setUploadedFile}
                                        setFieldValue={setFieldValue}
                                        errors={errors}
                                        touched={touched}
                                    />

                                    {/* Uploaded Files */}
                                    {uploadedFile && (
                                        <UploadedFiles
                                            uploadedFile={uploadedFile}
                                            setUploadedFile={setUploadedFile}
                                            setFieldValue={setFieldValue}
                                        />
                                    )}
                                </div>

                                {/* Right Column - Context Information */}
                                <div className="space-y-6">
                                    <ContextForm />
                                    <AIBenefits />
                                    <HelpSection />
                                </div>
                            </div>

                            <SubmitButton
                                isSubmitting={isSubmitting}
                            />
                        </Form>
                    )}
                </Formik>
            </div>
        </DashboardLayout>
    );
};

export default UploadLeaseForm;