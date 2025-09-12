import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload, FileText, Loader2, Users, Building2 } from "lucide-react";
import { DashboardLayout } from "@/components/layouts";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getUserLeasesAsync, terminateLeaseAsync } from "@/services/lease/asyncThunk";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import Toast from "@/components/Toast";
import { useRouter } from "next/router";

type LeaseItem = {
    lease_id: string;
    lease_title: string;
    property_addess?: string;   // <-- from your API payload
    facility_name?: string;
    facility_code?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    zip?: string;
    status?: "Active" | "Pending" | "Expired";
    term_start?: string;
    term_end?: string;
    region_badge?: string;
};


const REASON_OPTIONS: Array<{ value: string; label: string }> = [
    { value: "default", label: "Default" },
    { value: "early_exit", label: "Early Exit (Voluntary)" },
    { value: "breach", label: "Breach by Landlord" },
    { value: "end_of_term", label: "End of Term" },
    { value: "business_closure", label: "Business Closure" },
    { value: "business_relocation", label: "Business Relocation" },
    { value: "financial_hardship", label: "Financial Hardship" },
    { value: "other", label: "Other (Specify in Notes)" },
];

const TerminateLease: React.FC = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { leaseList: leases, isLoading } = useAppSelector((s) => s.lease);

    // ---- helpers (put above the component or in a utils file) ----
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

/** Safely extract LeaseItem[] from: [], {data: []}, or {data: {data: []}} */
const extractLeaseArray = (input: unknown): LeaseItem[] => {
  if (Array.isArray(input)) return input as LeaseItem[];

  if (isObject(input) && "data" in input) {
    const d = (input as { data?: unknown }).data;
    if (Array.isArray(d)) return d as LeaseItem[];
    if (isObject(d) && "data" in d) {
      const dd = (d as { data?: unknown }).data;
      if (Array.isArray(dd)) return dd as LeaseItem[];
    }
  }

  return [];
};


    // Robustly pull array regardless of whether it's data or data.data
const leaseArray: LeaseItem[] = useMemo(() => extractLeaseArray(leases), [leases]);

    const [selectedLeaseId, setSelectedLeaseId] = useState<string>("");
    // IMPORTANT: keep this as the code value so Doc_title stays a code like "breach"
    const [terminationReason, setTerminationReason] = useState<string>("");
    const [terminationDate, setTerminationDate] = useState<string>("");
    const [supportingNotes, setSupportingNotes] = useState<string>("");
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [aiTemplate, setAiTemplate] = useState<string>("standard");
    const [showPreview, setShowPreview] = useState<boolean>(false);

    const isFormDisabled = isLoading || isSubmitting;

    useEffect(() => {
        dispatch(getUserLeasesAsync());
    }, [dispatch]);

    const selectedLease: LeaseItem | undefined = useMemo(
        () => leaseArray.find((l) => String(l.lease_id) === String(selectedLeaseId)),
        [leaseArray, selectedLeaseId]
    );

    const toErrorMessage = (e: unknown): string => {
        if (e instanceof Error) return e.message;
        if (typeof e === "string") return e;
        try {
            return JSON.stringify(e);
        } catch {
            return "Something went wrong";
        }
    };

    const handleBack = () => {
        if (!isSubmitting) router.back();
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) setUploadedFile(file);
    };

    const handleDrop: React.DragEventHandler<HTMLLabelElement> = (e) => {
        e.preventDefault();
        if (isFormDisabled) return;
        const file = e.dataTransfer.files?.[0];
        if (file) setUploadedFile(file);
    };

    const handleDragOver: React.DragEventHandler<HTMLLabelElement> = (e) => {
        e.preventDefault();
    };

    const handleSubmit = async () => {
        if (!selectedLeaseId || !terminationReason || !terminationDate) {
            Toast.fire({ icon: "warning", title: "Please complete all required fields." });
            return;
        }
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            // Payload EXACTLY as requested
            formData.append("lease_doc_id", selectedLeaseId);
            formData.append("Doc_title", terminationReason); // send the code like "breach"
            formData.append("termination_date", terminationDate);
            formData.append("reason", supportingNotes);
            // formData.append("ai_template", aiTemplate);
            if (uploadedFile) formData.append("file", uploadedFile);

            await dispatch(terminateLeaseAsync(formData)).unwrap();

            // reset
            setSelectedLeaseId("");
            setTerminationReason("");
            setTerminationDate("");
            setSupportingNotes("");
            setUploadedFile(null);
            setAiTemplate("standard");
            setShowPreview(false);

            Toast.fire({ icon: "success", title: "Lease Terminate Successful" });

            router.push({
                pathname: "/dashboard/pages/tenantStorage",
                query: { success: "loi_submitted" },
            });
        } catch (error) {
            Toast.fire({ icon: "error", title: toErrorMessage(error) });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (isSubmitting) return;
        setSelectedLeaseId("");
        setTerminationReason("");
        setTerminationDate("");
        setSupportingNotes("");
        setUploadedFile(null);
        setAiTemplate("standard");
        setShowPreview(false);
    };

    const todayIso = new Date().toISOString().slice(0, 10);

    return (
        <DashboardLayout>
            {isLoading ? (
                <LoadingOverlay isVisible />
            ) : (
                <div className="min-h-screen bg-white">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 px-4 py-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={handleBack}
                                    disabled={isSubmitting}
                                    className="flex items-center text-gray-600 hover:text-gray-900 disabled:opacity-50"
                                >
                                    <ArrowLeft className="h-5 w-5 mr-1" />
                                    Back
                                </button>

                                <div className="flex items-center gap-3">
                                    <Image src="/term.png" alt="Terminate" width={35} height={40} />
                                    <div>
                                        <h1 className="font-semibold text-gray-900 leading-tight">Terminate Lease</h1>
                                        <p className="text-xs text-gray-500">Internal lease lease termination process</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main */}
                    <div className="max-w-4xl mx-auto px-4 py-8">
                        <div className="grid grid-cols-1 gap-8">
                            {/* Select Lease */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Select Lease to Terminate</h2>

                                    <div className="space-y-6">
                                        {/* Choose Lease */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Choose Lease</label>
                                            {isLoading ? (
                                                <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg">
                                                    <Loader2 className="h-5 w-5 animate-spin text-gray-500 mr-2" />
                                                    <span className="text-gray-500">Loading leases...</span>
                                                </div>
                                            ) : (
                                                <select
                                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                                    value={selectedLeaseId}
                                                    onChange={(e) => setSelectedLeaseId(e.target.value)}
                                                    disabled={isFormDisabled}
                                                >
                                                    <option value="">Select a lease</option>
                                                    {leaseArray.map((lease) => (
                                                        <option key={lease.lease_id} value={lease.lease_id}>
                                                            {lease.lease_title}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>

                                        {/* Lease Summary */}
                                        {selectedLease && (
                                            <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
                                                <p className="text-sm font-semibold text-gray-900 mb-4">Lease Summary</p>

                                                <div className="grid md:grid-cols-2 gap-6">
                                                    {/* Left column */}
                                                    <div className="space-y-5">
                                                        {/* Facility */}
                                                        <div className="flex items-start gap-3">
                                                            <div className="mt-0.5">
                                                                <Building2 className="h-4 w-4 text-gray-500" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-medium text-gray-500 mb-0.5">Warehouse Facility</p>
                                                                <p className="text-sm text-gray-900">{selectedLease.lease_title}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {selectedLease.property_addess ||
                                                                        [selectedLease.address_line1, selectedLease.city, selectedLease.state, selectedLease.zip]
                                                                            .filter(Boolean)
                                                                            .join(", ") ||
                                                                        "—"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Parties */}
                                                        <div className="flex items-start gap-3">
                                                            <div className="mt-0.5">
                                                                <Users className="h-4 w-4 text-gray-500" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-xs font-medium text-gray-500 mb-2">Parties</p>
                                                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                                                    {/* Use real parties when you have them; placeholder lines match screenshot hierarchy */}
                                                                    <span className="text-gray-600">Landlord: <span className="text-gray-800">Industrial Holdings Inc</span></span>
                                                                    <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-2 py-0.5">
                                                                        Active
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-gray-600 mt-1">
                                                                    Tenant: <span className="text-gray-800">Your Business Name</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right column */}
                                                    <div>
                                                        {/* <div className="flex items-start gap-3">
                                                            <div className="mt-0.5">
                                                                <CalendarDays className="h-4 w-4 text-gray-500" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-medium text-gray-500 mb-0.5">Lease Term</p>
                                                                <p className="text-sm text-gray-900">
                                                                    {selectedLease.term_start ?? "—"}{" "}
                                                                    <span className="mx-1 text-gray-400">–</span>
                                                                    {selectedLease.term_end ?? "—"}
                                                                </p>
                                                            </div>
                                                        </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {/* /Lease Summary */}
                                    </div>
                                </div>
                            </div>


                            {/* Termination Details */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Termination Details</h2>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Reason for Termination <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                                value={terminationReason}
                                                onChange={(e) => setTerminationReason(e.target.value)}
                                                disabled={isFormDisabled}
                                                aria-label="Reason for Termination"
                                            >
                                                <option value="">Select reason...</option>
                                                {REASON_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Choose “Other (Specify in Notes)” if your reason isn’t listed.
                                            </p>
                                        </div>

                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Termination Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                min={todayIso}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                                value={terminationDate}
                                                onChange={(e) => setTerminationDate(e.target.value)}
                                                disabled={isFormDisabled}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Supporting Notes (Optional)
                                            </label>
                                            <textarea
                                                rows={3}
                                                placeholder="Provide any additional details or context for the termination..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                                value={supportingNotes}
                                                onChange={(e) => setSupportingNotes(e.target.value)}
                                                disabled={isFormDisabled}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                These notes will be included in the termination notice.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Supporting Documents */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Supporting Documents (Optional)</h2>

                                    <label
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        className={`block border-2 border-dashed rounded-lg p-8 text-center transition ${isFormDisabled
                                                ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                                                : "border-gray-300 hover:border-gray-400"
                                            }`}
                                    >
                                        <Upload className={`h-12 w-12 mx-auto mb-4 ${isFormDisabled ? "text-gray-300" : "text-gray-400"}`} />
                                        <h3 className={`text-lg font-medium mb-2 ${isFormDisabled ? "text-gray-400" : "text-gray-900"}`}>
                                            Upload Supporting Documents
                                        </h3>
                                        <p className={`${isFormDisabled ? "text-gray-400" : "text-gray-600"} text-sm mb-4`}>
                                            Attach any supporting notice or termination letter (PDF/DOC)
                                        </p>

                                        <input
                                            type="file"
                                            id="supporting-doc"
                                            className="hidden"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileUpload}
                                            disabled={isFormDisabled}
                                        />
                                        <span
                                            className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${isFormDisabled
                                                    ? "border-gray-200 text-gray-400 bg-gray-50"
                                                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                                                }`}
                                            onClick={(e) => {
                                                if (!isFormDisabled) document.getElementById("supporting-doc")?.click();
                                                e.preventDefault();
                                            }}
                                        >
                                            Choose File
                                        </span>
                                        <p className={`text-xs mt-2 ${isFormDisabled ? "text-gray-400" : "text-gray-500"}`}>
                                            Or drag and drop files here
                                        </p>
                                    </label>

                                    {uploadedFile && (
                                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                                                    <span className="text-sm text-blue-900">{uploadedFile.name}</span>
                                                </div>
                                                {!isFormDisabled && (
                                                    <button onClick={() => setUploadedFile(null)} className="text-red-600 hover:text-red-800 text-sm">
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* AI-Generated Legal Notice */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">AI-Generated Legal Notice</h2>
                                            <p className="text-xs text-gray-500">AI Assistant</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <select
                                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                                value={aiTemplate}
                                                onChange={(e) => setAiTemplate(e.target.value)}
                                                disabled={isFormDisabled}
                                                aria-label="AI Template"
                                            >
                                                <option value="standard">Standard Termination</option>
                                                <option value="breach_strong">Breach — Strong</option>
                                                <option value="mutual_soft">Mutual — Soft</option>
                                            </select>

                                            <button
                                                type="button"
                                                onClick={() => setShowPreview((s) => !s)}
                                                disabled={!selectedLeaseId || !terminationReason || !terminationDate || isFormDisabled}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                                title="Show a quick preview before generating"
                                            >
                                                {showPreview ? "Hide Preview" : "Show Preview"}
                                            </button>
                                        </div>
                                    </div>

                                    {showPreview && (
                                        <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                                            <p className="font-medium mb-2">Preview (read-only)</p>
                                            <p>
                                                Preview using <span className="italic">{aiTemplate}</span> template for{" "}
                                                <span className="font-medium">{selectedLease?.lease_title || "selected lease"}</span> effective{" "}
                                                <span className="font-medium">{terminationDate || "—"}</span> due to{" "}
                                                <span className="font-medium">
                                                    {REASON_OPTIONS.find((r) => r.value === terminationReason)?.label ?? "—"}
                                                </span>
                                                . Notes: {supportingNotes || "—"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <button
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                    className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isFormDisabled || !selectedLeaseId || !terminationReason || !terminationDate}
                                    className="px-6 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 flex items-center gap-2 disabled:opacity-50 disabled:hover:bg-red-600"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="h-4 w-4" />
                                            <span>Generate Legal Notice</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default TerminateLease;
