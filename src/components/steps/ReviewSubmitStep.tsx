// components/steps/ReviewSubmitStep.tsx
import React from 'react';
import {
  CheckCircle2,
  Download as DownloadIcon,
  FileCheck,
  ChevronRight,
} from 'lucide-react';
import { FormValues } from '../../types/loi';
import { exportLoiToDocx } from '@/utils/exportDocx';
import { transformToApiPayload } from '@/utils/apiTransform';

interface ReviewSubmitStepProps {
  values: FormValues;
  goToStep?: (step: number) => void;
  onDownload?: () => void;
  onEdit: (step: number) => void 
}

const Row = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="flex items-center justify-between py-1 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-900">
      {value ? value : 'Not Specified'}
    </span>
  </div>
);

export const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({
  values,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-1">Review & Submit</h3>
      <p className="text-sm text-gray-600">
        Review all the information below and submit your Letter of Intent.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
     
          <div className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h4 className="font-semibold">Basic Information</h4>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <Row label="LOI Title" value={values.title} />
              <Row label="Property Address" value={values.propertyAddress} />
              <Row label="Landlord" value={values.landlordName} />
              <Row label="Tenant" value={values.tenantName} />
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h4 className="font-semibold">Lease Terms</h4>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <Row
                label="Monthly Rent"
                value={values.rentAmount ? `$${values.rentAmount}` : undefined}
              />
              <Row
                label="Security Deposit"
                value={
                  values.securityDeposit ? `$${values.securityDeposit}` : undefined
                }
              />
              <Row label="Lease Duration" value={values.leaseDuration && `${values.leaseDuration} months`} />
              <Row label="Start Date" value={values.startDate} />
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h4 className="font-semibold">Property Details</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <Row
                label="Property Size"
                value={values.propertySize && `${values.propertySize} sq ft`}
              />
              <Row label="Property Type" value={values.propertyType} />
              <Row label="Intended Use" value={values.intendedUse} />
              <Row label="Parking Spaces" value={values.parkingSpaces} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-green-300 rounded-lg bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900">Ready to Submit</h4>
                <p className="text-sm text-green-800 mt-1">
                  Your LOI is complete and ready to be submitted. You can download a PDF copy or send it directly to the landlord.
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => exportLoiToDocx(transformToApiPayload(values ))}

                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-green-600 text-green-700 hover:bg-green-100 text-sm"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    Download
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm"
                  >
                    <FileCheck className="w-4 h-4" />
                    Submit LOI
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Next Steps</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-gray-400" />
                LOI will be sent to the landlord for review.
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-gray-400" />
                You’ll receive notifications about the status.
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-gray-400" />
                Negotiate terms and proceed to lease agreement.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* <div className="flex items-start gap-2">
        <Field
          name="terms"
          type="checkbox"
          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label className="text-sm">
          I agree to the terms and conditions and confirm that the information provided is accurate.
        </label>
      </div> */}
      {/* <ErrorMessage name="terms" component="div" className="text-red-500 text-sm" /> */}
    </div>
  );
};
