// components/steps/ReviewSubmitStep.tsx
import React, { useRef, useState, useEffect } from "react";
import { CheckCircle2, Download as DownloadIcon, ChevronRight } from "lucide-react";
import ls from "localstorage-slim";
import { exportLoiToDocx } from "@/utils/exportDocx";
import { transformToApiPayload } from "@/utils/apiTransform";
import Config from "@/config/index";

// 🔁 removed thunk usage; import service + helpers instead
const getStatus = (err: unknown): number | undefined => {
  if (!isObject(err)) return undefined;

  const direct = err.status;
  if (typeof direct === "number") return direct;

  const response = isObject(err.response) ? (err.response as UnknownRecord) : undefined;
  const nested = response?.status;
  return typeof nested === "number" ? nested : undefined;
};
import Toast from "@/components/Toast";
import { LoadingOverlay } from "../loaders/overlayloader";
import { FormValues } from "@/constants/formData";
import type { LOIApiPayload } from "@/types/loi";
import { isObject, LoiServerData, UnknownRecord } from "@/services/dashboard/asyncThunk";
import axios from "axios";

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

// Accept {success?, status?, message?, data?} OR raw LOI object
function normalizeLoiResponse(response: unknown): LoiServerData {
  const resp = response as { success?: boolean; status?: number; message?: string; data?: LoiServerData } | undefined;
  const normalized = resp?.data ?? (response as LoiServerData);
  if (!normalized || typeof normalized !== "object") {
    throw new Error("Malformed LOI data from server");
  }
  return normalized;
}

export const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ values, mode }) => {
  console.log("mode", mode);

  // ✅ local state instead of Redux slice flags
  const [isDownloadingLoi, setIsDownloadingLoi] = useState(false);
  const downloadingRef = useRef(false);

  // avoid state updates after unmount
  const isMountedRef = useRef(true);
  useEffect(() => () => { isMountedRef.current = false; }, []);

  const handleDownload = async () => {
    if (downloadingRef.current) {
      console.log("[LOI] download already in progress – ignoring click");
      return;
    }
    downloadingRef.current = true;
    setIsDownloadingLoi(true);
    console.log("[LOI] start");



    try {
      const token = ls.get("access_token", { decrypt: true });
      if (!token) throw new Error("Authentication token not found");

      const clientPayload: LOIApiPayload = transformToApiPayload(values);
      console.log("[LOI] calling API…");

      const response = await axios.post(
        `${Config.API_ENDPOINT}/dashboard/download_tempalte_data`,
        clientPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const maybe = response as { success?: boolean; message?: string } | undefined;
      if (maybe?.success === false) throw new Error(maybe.message);
      if (maybe?.message) Toast.fire({ icon: "success", title: maybe.message });

      const realData: LoiServerData = normalizeLoiResponse(response);
      console.log("[LOI] API ok, exporting docx…", realData);

      await (exportLoiToDocx(realData));
      Toast.fire({ icon: "success", title: "LOI exported successfully" });
      console.log("[LOI] export done");
    } catch (err) {
      const status = getStatus(err);
      const msg =
        status === 401 ? "Session expired. Please log in again."
          : status === 403 ? "You don't have permission to perform this action."
            : status === 404 ? "LOI template endpoint not found."
              : typeof status === "number" && status >= 500 ? "Server error. Please try again later."
                : err instanceof Error ? err.message
                  : typeof err === "string" ? err
                    : "Failed to export LOI";
      console.error("[LOI] error:", err);
      Toast.fire({ icon: "error", title: msg });
    } finally {
      // clear flags in a safe order
      downloadingRef.current = false;
      setIsDownloadingLoi(false);
      console.log("[LOI] finally → requested loader off");
    }
  };

  return (
    <div className="relative">
      <div
      >

        <h3 className="text-lg font-semibold mb-1">Review & Submit</h3>
        <p className="text-sm text-gray-600">
          Review all the information below and submit your Letter of Intent.
        </p>
      {/* {isDownloadingLoi && <LoadingOverlay visible />} */}

        <LoadingOverlay
        visible={isDownloadingLoi}
        size="default"
        fullscreen={true}
      />

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
      </div>
    </div>
  );
};
