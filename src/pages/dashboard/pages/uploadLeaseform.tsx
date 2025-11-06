
'use client';

import React, { useState } from 'react';
import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/layouts';
import Config from "@/config/index";
import ls from "localstorage-slim";

import { LeaseFormValues, FileData } from '@/types/loi';

import { PageHeader } from '@/components/uploadLeaseForm/PageHeader';
import { FileUpload } from '@/components/uploadLeaseForm/FileUpload';
import { UploadedFiles } from '@/components/uploadLeaseForm/UploadedFile';
import { ContextForm } from '@/components/uploadLeaseForm/ContextForm';
import { AIBenefits } from '@/components/uploadLeaseForm/AIBenefits';
import { HelpSection } from '@/components/uploadLeaseForm/HelpSection';
import { SubmitButton } from '@/components/buttons/submitButton';
import Toast from '@/components/Toast';
import axios from 'axios';
import { Plus } from 'lucide-react';

type ExtendedLeaseFormValues = LeaseFormValues & {
  leaseId?: string;
  leaseTitle?: string;
};

const UploadLeaseForm: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<FileData | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const router = useRouter();

  const goCreate = () => router.push("/dashboard/pages/createLeaseform");

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

  const MAX_MB = 10;
  const ALLOWED = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']; // PDF, DOCX

  function validateLeaseFile(file: File): string | null {
    if (!ALLOWED.includes(file.type)) return 'Only PDF or DOCX files are allowed.';
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_MB) return `File too large: ${sizeMb.toFixed(1)} MB (max ${MAX_MB} MB).`;
    return null;
  }

  const handleSubmit = async (
    values: ExtendedLeaseFormValues,
    { setSubmitting }: FormikHelpers<ExtendedLeaseFormValues>
  ) => {
    try {
      if (uploadedFile) {
        const sizeErr = validateLeaseFile(uploadedFile.file);
        if (sizeErr) {
          Toast.fire({ icon: "error", title: sizeErr });
          return;
        }
      }
      console.log("112", values.leaseId)

      const token = ls.get("access_token", { decrypt: true });
      if (!token) throw new Error("Authentication token not found");
      console.log("token", token)

      const response = await axios.post(
        `${Config.API_ENDPOINT}/leases/submit_by_loi/${values.leaseId}`,
        {}, // or the actual body if the endpoint expects one
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const payload = response.data;
      console.log("payload", payload);

      router.push(`/dashboard/pages/lease/edit/${response.data.data.lease_id}`);
    } catch (err) {
      console.error("Upload error", err);
      Toast.fire({ icon: "error", title: "Upload failed. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <button
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        onClick={goCreate}
      >
        <Plus className="w-4 h-4" />
        Add Lease
      </button>
      <div className="flex items-center justify-between mt-6">
        <PageHeader />
      </div>

      <div className="w-full max-w-7xl xl:max-w-none mt-6 mx-auto px-4 sm:px-0">
        <Formik<ExtendedLeaseFormValues>
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, errors, touched, isSubmitting }: FormikProps<ExtendedLeaseFormValues>) => (
            <Form>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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
                      check={false}
                    />

                  )}
                </div>

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

      {openCreate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-lg font-semibold">Create Lease</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setOpenCreate(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UploadLeaseForm;
