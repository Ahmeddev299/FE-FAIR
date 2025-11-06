/* eslint-disable @typescript-eslint/no-explicit-any */

// components/steps/ReviewSubmitStep.tsx
import React, { useRef, useState, useEffect } from "react";
import { CheckCircle2, Download as DownloadIcon, ChevronRight } from "lucide-react";
import ls from "localstorage-slim";
import axios from "axios";

import Config from "@/config/index";
import Toast from "@/components/Toast";
import { LoadingOverlay } from "../../../loaders/overlayloader";

import type { FormValues } from "@/types/loi";
import { getLoiIdFromSession, setLoiIdInSession } from "@/utils/loisesion";

interface ReviewSubmitStepProps {
  values: FormValues;
  goToStep?: (step: number) => void;
  onDownload?: () => void;
  onEdit: (step: number) => void;
  mode?: string;
}

const Row = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="flex items-center justify-between py-1 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-900">{value ? value : "Not Specified"}</span>
  </div>
);

export const LeaseReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ values }) => {
  // flags
  const [isDownloadingLoi, setIsDownloadingLoi] = useState(false);
  const downloadingRef = useRef(false);

  // 🆔 Persisted LOI id (download-only flow)
  const [savedLoiId, setSavedLoiId] = useState<string | null>(null);

  // Avoid state updates after unmount
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // hydrate saved id on mount (SSR-safe)
  useEffect(() => {
    const existing = getLoiIdFromSession();
    if (existing) {
      setSavedLoiId(existing);
      console.log("[LOI] restored loi_id from sessionStorage:", existing);
    }
  }, []);

  const handleDownload = async () => {
    if (downloadingRef.current) return;
    downloadingRef.current = true;
    setIsDownloadingLoi(true);

    try {
      const token = ls.get("access_token", { decrypt: true });
      if (!token) throw new Error("Authentication token not found");

      // Use the saved LOI ID or get from session
      const docId = savedLoiId || getLoiIdFromSession();
      
      if (!docId) {
        throw new Error("LOI ID not found. Please save the LOI first.");
      }

      const response = await axios.post(
        `${Config.API_ENDPOINT}/lois/download`,
        { doc_id: docId },
        { 
          headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}` 
          } 
        }
      );

      const maybe = response as {
        data?: {
          success?: boolean;
          message?: string;
          data?: {
            link?: {
              pdf_url?: string
            }
          }
        }
      };

      if (maybe?.data?.success === false) {
        throw new Error(maybe.data.message || "Failed to download LOI");
      }

      const pdfUrl = maybe?.data?.data?.link?.pdf_url;

      if (!pdfUrl) {
        throw new Error("PDF URL not found in response");
      }

      // Auto-download the PDF
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.target = '_blank';
      link.download = `LOI_${docId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const msg = maybe?.data?.message || "LOI downloaded successfully";
      if (isMountedRef.current) {
        Toast.fire({ icon: "success", title: msg });
      }

      // If we got a new ID from the response, save it
      const responseId = (maybe?.data?.data as any)?.id;
      if (responseId && responseId !== savedLoiId) {
        setLoiIdInSession(responseId);
        setSavedLoiId(responseId);
        console.log("[LOI] saved loi_id to sessionStorage:", responseId);
      }

    } catch (err: unknown) {
      console.error("Download LOI error:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to download LOI";
      if (isMountedRef.current) {
        Toast.fire({ icon: "error", title: errorMsg });
      }
    } finally {
      downloadingRef.current = false;
      if (isMountedRef.current) {
        setIsDownloadingLoi(false);
      }
    }
  };

  return (
    <div className="relative">
      <h3 className="text-lg font-semibold mb-1">Review & Submit</h3>
      <p className="text-sm text-gray-600">
        Review all the information below and submit your Letter of Intent.
      </p>

      <LoadingOverlay visible={isDownloadingLoi} size="default" fullscreen />

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
              <Row label="Monthly Rent" value={values.rentAmount ? `$${values.rentAmount}` : undefined} />
              <Row label="Security Deposit" value={values.securityDeposit ? `$${values.securityDeposit}` : undefined} />
              <Row label="Lease Duration" value={values.leaseDuration && `${values.leaseDuration} months`} />
              <Row label="Start Date" value={values.startDate} />
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h4 className="font-semibold">Property Details</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <Row label="Property Size" value={values.propertySize && `${values.propertySize} sq ft`} />
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
                  Your LOI is complete and ready to be submitted. You can
                  download a PDF copy or send it directly to the landlord.
                </p>

                <div className="w-full mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloadingLoi || downloadingRef.current}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-green-600 text-green-700 hover:bg-green-100 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    {isDownloadingLoi ? "Downloading…" : "Download"}
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
                You'll receive notifications about the status.
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-gray-400" />
                Negotiate terms and proceed to lease agreement.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};