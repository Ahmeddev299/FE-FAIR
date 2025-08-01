// UploadLeaseForm.tsx - Refactored Main Component
import React, { useState } from 'react';
import { Formik, Form, FormikProps } from 'formik';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/layouts';

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

const UploadLeaseForm: React.FC = () => {
    const [uploadedFile, setUploadedFile] = useState<FileData | null>(null);
    const router = useRouter();

    const initialValues: LeaseFormValues = {
        title: '',
        startDate: '',
        endDate: '',
        propertyAddress: '',
        notes: '',
        document: ''
    };

    const handleSubmit = (values: LeaseFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }): void => {
        // Simulate API call
        setTimeout(() => {
            console.log('Form submitted with values:', values);
            console.log('Uploaded file:', uploadedFile);
            alert('Lease document uploaded successfully!');
            setSubmitting(false);
            router.push('/dashboard/pages/uploadLeaseReview');
        }, 2000);
    };

    const handleStartNewLOI = (): void => {
        router.push('/dashboard/pages/uploadLeaseReview');
    };

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

                            {/* Submit Button */}
                            <SubmitButton
                                isSubmitting={isSubmitting}
                                onClick={handleStartNewLOI}
                            />
                        </Form>
                    )}
                </Formik>
            </div>
        </DashboardLayout>
    );
};

export default UploadLeaseForm;