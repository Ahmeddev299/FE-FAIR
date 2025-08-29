// // // UploadLeaseForm.tsx - Refactored Main Component
// // import React, { useState } from 'react';
// // import { Formik, Form, FormikProps } from 'formik';
// // import { useRouter } from 'next/router';
// // import { DashboardLayout } from '@/components/layouts';
// // import { useAppDispatch } from '@/hooks/hooks';

// // // Import types
// // import { LeaseFormValues, FileData } from '@/types/loi';

// // // Import validation schema
// // import { validationSchema } from '@/validations/schemas';

// // // Import components
// // import { PageHeader } from '@/components/uploadLeaseForm/PageHeader';
// // import { FileUpload } from '@/components/uploadLeaseForm/FileUpload';
// // import { UploadedFiles } from '@/components/uploadLeaseForm/UploadedFile';
// // import { ContextForm } from '@/components/uploadLeaseForm/ContextForm';
// // import { AIBenefits } from '@/components/uploadLeaseForm/AIBenefits';
// // import { HelpSection } from '@/components/uploadLeaseForm/HelpSection';
// // import { SubmitButton } from '@/components/buttons/submitButton';
// // import { uploadLeaseAsync } from '@/services/lease/asyncThunk';
// // import Toast from '@/components/Toast';

// // const UploadLeaseForm: React.FC = () => {
// //     const [uploadedFile, setUploadedFile] = useState<FileData | null>(null);
// //     const router = useRouter();
// //     const dispatch = useAppDispatch()

// //     const initialValues: LeaseFormValues = {
// //         title: '',
// //         startDate: '',
// //         endDate: '',
// //         propertyAddress: '',
// //         notes: '',
// //         document: ''
// //     };

// //     const handleSubmit = async (
// //         values: LeaseFormValues,
// //         { setSubmitting }: { setSubmitting: (v: boolean) => void }
// //     ): Promise<void> => {
// //         try {
// //             if (!uploadedFile) {
// //                 alert('Please upload a document before submitting.');
// //                 return;
// //             }

// //             const formData = new FormData();
// //             formData.append('loi_id', values.leaseId);
// //             formData.append('lease_title', values.leaseTitle);
// //             formData.append('startDate', values.startDate);
// //             formData.append('endDate', values.endDate);
// //             formData.append('property_address', values.propertyAddress);
// //             formData.append('notes', values.notes);
// //             formData.append('file', uploadedFile.file);

// //             // unwrap gives you the typed payload or throws on reject
// //             const payload = await dispatch(uploadLeaseAsync(formData)).unwrap();

// //             // IDs from your sample response
// //             const leaseId = payload.Lease._id;
// //             const clauseDocId = payload.Clauses._id;

// //             // navigate with IDs (Pages Router)
// //             router.push({
// //                 pathname: '/dashboard/pages/lease/review/[leaseId]',
// //                 query: {
// //                     leaseId,
// //                     clauseDocId,                     // clauses document id
// //                 },
// //             });
// //         } catch (err) {
// //             console.error('Upload error', err);
// //         Toast.fire({ icon: "error", title: err });
// //         } finally {
// //             setSubmitting(false);
// //         }
// //     };
// //     ;

// //     // uploadLeaseAsync
// //     return (
// //         <DashboardLayout>
// //             {/* Header */}
// //             <PageHeader />

// //             {/* Main Content */}
// //             <div className="w-full max-w-7xl xl:max-w-none mt-6 mx-auto px-4 sm:px-0">
// //                 <Formik
// //                     initialValues={initialValues}
// //                     validationSchema={validationSchema}
// //                     onSubmit={handleSubmit}
// //                 >
// //                     {({ setFieldValue, errors, touched, isSubmitting }: FormikProps<LeaseFormValues>) => (
// //                         <Form>
// //                             <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
// //                                 {/* Left Column - Upload Section */}
// //                                 <div className="xl:col-span-2 space-y-6">
// //                                     {/* Document Upload */}
// //                                     <FileUpload
// //                                         uploadedFile={uploadedFile}
// //                                         setUploadedFile={setUploadedFile}
// //                                         setFieldValue={setFieldValue}
// //                                         errors={errors}
// //                                         touched={touched}
// //                                     />

// //                                     {/* Uploaded Files */}
// //                                     {uploadedFile && (
// //                                         <UploadedFiles
// //                                             uploadedFile={uploadedFile}
// //                                             setUploadedFile={setUploadedFile}
// //                                             setFieldValue={setFieldValue}
// //                                         />
// //                                     )}
// //                                 </div>

// //                                 {/* Right Column - Context Information */}
// //                                 <div className="space-y-6">
// //                                     <ContextForm />
// //                                     <AIBenefits />
// //                                     <HelpSection />
// //                                 </div>
// //                             </div>

// //                             <SubmitButton
// //                                 isSubmitting={isSubmitting}
// //                             />
// //                         </Form>
// //                     )}
// //                 </Formik>
// //             </div>
// //         </DashboardLayout>
// //     );
// // };

// // export default UploadLeaseForm;


// // UploadLeaseForm.tsx
// import React, { useState } from 'react';
// import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
// import { useRouter } from 'next/router';
// import { DashboardLayout } from '@/components/layouts';
// import { useAppDispatch } from '@/hooks/hooks';

// // Import types
// import { LeaseFormValues, FileData } from '@/types/loi';

// // Import validation schema
// import { validationSchema } from '@/validations/schemas';

// // Import components
// import { PageHeader } from '@/components/uploadLeaseForm/PageHeader';
// import { FileUpload } from '@/components/uploadLeaseForm/FileUpload';
// import { UploadedFiles } from '@/components/uploadLeaseForm/UploadedFile';
// import { ContextForm } from '@/components/uploadLeaseForm/ContextForm';
// import { AIBenefits } from '@/components/uploadLeaseForm/AIBenefits';
// import { HelpSection } from '@/components/uploadLeaseForm/HelpSection';
// import { SubmitButton } from '@/components/buttons/submitButton';
// import { uploadLeaseAsync } from '@/services/lease/asyncThunk';
// import Toast from '@/components/Toast';

// const toErrorMessage = (e: unknown): string => {
//     if (e instanceof Error) return e.message;
//     if (typeof e === 'string') return e;
//     try { return JSON.stringify(e); } catch { return 'Something went wrong'; }
// };

// const UploadLeaseForm: React.FC = () => {
//     const [uploadedFile, setUploadedFile] = useState<FileData | null>(null);
//     const router = useRouter();
//     const dispatch = useAppDispatch();

//     const initialValues: LeaseFormValues = {
//         title: '',
//         startDate: '',
//         endDate: '',
//         propertyAddress: '',
//         notes: '',
//         document: '', // if you store file name/path; otherwise you can remove from type
//         // If you actually need these, add them as optional in LeaseFormValues:
//         // leaseId?: string;
//         // leaseTitle?: string;
//     };

//     const handleSubmit = async (
//         values: LeaseFormValues,
//         { setSubmitting }: FormikHelpers<LeaseFormValues>
//     ): Promise<void> => {
//         try {
//             if (!uploadedFile) {
//                 alert('Please upload a document before submitting.');
//                 return;
//             }
//             console.log("values", values)

//             const formData = new FormData();

//             // Use your actual keys from LeaseFormValues:
//             // If your API needs `lease_title`, map from `values.title`

//             formData.append('loi_id', values.leaseId)
//             formData.append('lease_title', values.leaseTitle);
//             formData.append('startDate', values.startDate);
//             formData.append('endDate', values.endDate);
//             formData.append('property_address', values.propertyAddress);
//             formData.append('notes', values.notes);

//             // File
//             formData.append('file', uploadedFile.file);

//             // If API truly needs loi_id or leaseId, add leaseId?: string to LeaseFormValues and then:
//             // if (values.leaseId) formData.append('loi_id', values.leaseId);

//             const payload = await dispatch(uploadLeaseAsync(formData)).unwrap();
//             console.log("payload", payload)
//             const leaseId = payload?.Lease._id;
//             const clauseDocId = payload?.Clauses._id;

//             router.push({
//                 pathname: '/dashboard/pages/lease/review/[leaseId]',
//                 query: { leaseId, clauseDocId },
//             });
//         } catch (err) {
//             console.error('Upload error', err);
//             Toast.fire({ icon: 'error', title: toErrorMessage(err) });
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     return (
//         <DashboardLayout>
//             <PageHeader />

//             <div className="w-full max-w-7xl xl:max-w-none mt-6 mx-auto px-4 sm:px-0">
//                 <Formik
//                     initialValues={initialValues}
//                     validationSchema={validationSchema}
//                     onSubmit={handleSubmit}
//                 >
//                     {({ setFieldValue, errors, touched, isSubmitting }: FormikProps<LeaseFormValues>) => (
//                         <Form>
//                             <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//                                 {/* Left Column - Upload Section */}
//                                 <div className="xl:col-span-2 space-y-6">
//                                     <FileUpload
//                                         uploadedFile={uploadedFile}
//                                         setUploadedFile={setUploadedFile}
//                                         setFieldValue={setFieldValue}
//                                         errors={errors}
//                                         touched={touched}
//                                     />

//                                     {uploadedFile && (
//                                         <UploadedFiles
//                                             uploadedFile={uploadedFile}
//                                             setUploadedFile={setUploadedFile}
//                                             setFieldValue={setFieldValue}
//                                         />
//                                     )}
//                                 </div>

//                                 {/* Right Column - Context Information */}
//                                 <div className="space-y-6">
//                                     <ContextForm />
//                                     <AIBenefits />
//                                     <HelpSection />
//                                 </div>
//                             </div>

//                             <SubmitButton isSubmitting={isSubmitting} />
//                         </Form>
//                     )}
//                 </Formik>
//             </div>
//         </DashboardLayout>
//     );
// };

// export default UploadLeaseForm;


// ./src/pages/dashboard/pages/uploadLeaseform.tsx
'use client';

import React, { useState } from 'react';
import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/layouts';
import { useAppDispatch } from '@/hooks/hooks';

// Base types from your app
import { LeaseFormValues, FileData } from '@/types/loi';
import { validationSchema } from '@/validations/schemas';

// UI components
import { PageHeader } from '@/components/uploadLeaseForm/PageHeader';
import { FileUpload } from '@/components/uploadLeaseForm/FileUpload';
import { UploadedFiles } from '@/components/uploadLeaseForm/UploadedFile';
import { ContextForm } from '@/components/uploadLeaseForm/ContextForm';
import { AIBenefits } from '@/components/uploadLeaseForm/AIBenefits';
import { HelpSection } from '@/components/uploadLeaseForm/HelpSection';
import { SubmitButton } from '@/components/buttons/submitButton';
import { uploadLeaseAsync } from '@/services/lease/asyncThunk';
import Toast from '@/components/Toast';

// Extend the form values locally to allow optional fields used by the API
type ExtendedLeaseFormValues = LeaseFormValues & {
  leaseId?: string;     // optional API field
  leaseTitle?: string;  // optional alias; will fallback to `title`
};

const toErrorMessage = (e: unknown): string => {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  try { return JSON.stringify(e); } catch { return 'Something went wrong'; }
};

const UploadLeaseForm: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<FileData | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Provide initial values for the required base fields.
  // Optional fields (`leaseId`, `leaseTitle`) can be omitted.
  const initialValues: ExtendedLeaseFormValues = {
    title: '',
    startDate: '',
    endDate: '',
    propertyAddress: '',
    notes: '',
    document: '', // keep if your form uses it; otherwise remove from your base type
    // leaseId: '',      // OPTIONAL: only include if you actually bind it in the UI
    // leaseTitle: '',   // OPTIONAL: only include if you actually bind it in the UI
  };

  const handleSubmit = async (
    values: ExtendedLeaseFormValues,
    { setSubmitting }: FormikHelpers<ExtendedLeaseFormValues>
  ): Promise<void> => {
    try {
      if (!uploadedFile) {
        alert('Please upload a document before submitting.');
        return;
      }

      const formData = new FormData();

      // Only append optional fields if they exist to satisfy FormData typing
      if (values.leaseId && values.leaseId.trim()) {
        formData.append('loi_id', values.leaseId);
      }

      // Use leaseTitle if provided; otherwise fall back to title
      const leaseTitle = values.leaseTitle?.trim() || values.title;
      formData.append('lease_title', leaseTitle);

      // These are required strings in your base type, so they’re safe to append
      formData.append('startDate', values.startDate);
      formData.append('endDate', values.endDate);
      formData.append('property_address', values.propertyAddress);
      formData.append('notes', values.notes);

      // File is required due to guard above
      formData.append('file', uploadedFile.file);

      // Dispatch upload
      const payload = await dispatch(uploadLeaseAsync(formData)).unwrap();

      // Extract IDs from API response (adjust if your payload shape differs)
      const leaseId = payload?.Lease?._id as string | undefined;
      const clauseDocId = payload?.Clauses?._id as string | undefined;

      router.push({
        pathname: '/dashboard/pages/lease/review/[leaseId]',
        query: { leaseId, clauseDocId },
      });
    } catch (err) {
      console.error('Upload error', err);
      Toast.fire({ icon: 'error', title: toErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader />

      <div className="w-full max-w-7xl xl:max-w-none mt-6 mx-auto px-4 sm:px-0">
        <Formik<ExtendedLeaseFormValues>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, errors, touched, isSubmitting }: FormikProps<ExtendedLeaseFormValues>) => (
            <Form>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column - Upload Section */}
                <div className="xl:col-span-2 space-y-6">
                  <FileUpload
                    uploadedFile={uploadedFile}
                    setUploadedFile={setUploadedFile}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />

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

              <SubmitButton isSubmitting={isSubmitting} />
            </Form>
          )}
        </Formik>
      </div>
    </DashboardLayout>
  );
};

export default UploadLeaseForm;
