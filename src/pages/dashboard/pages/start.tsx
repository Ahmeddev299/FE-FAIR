import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { UploadCloud, FileText, CheckCircle2, Trash2, ArrowRight, Eye, Edit } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { DashboardLayout } from "@/components/layouts";
import { LoadingOverlay } from "@/components/loaders/overlayloader";

import { getDraftLOIsAsync, submitLOIByFileAsync } from "@/services/loi/asyncThunk";
import { formatDate } from "@/utils/dateFormatter";
import { FileData, Letter, LOIStatus } from "@/types/loi";
// If you still want to keep your external file card, you can keep this:
// import { UploadedFiles } from '@/components/uploadLeaseForm/UploadedFile';

export default function LetterOfIntentDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { loiList, isLoading } = useAppSelector((state) => state.loi);

  // UI state
  const [showUpload, setShowUpload] = useState<boolean>(false);
  console.log(showUpload)
  const [fileUpload, setUploadedFile] = useState<FileData | null>(null);

  // Drag & drop + progress UI
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  console.log((progress))
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch drafts
  useEffect(() => {
    dispatch(getDraftLOIsAsync());
  }, [dispatch]);

  // Helpers for status pill
  const getStatusColor = (status?: LOIStatus | string) => {
    const s = (status || "").toString().toLowerCase();
    if (s === "draft") return "bg-gray-100 text-gray-800";
    if (s === "sent" || s === "submitted") return "bg-blue-100 text-blue-800";
    if (s === "approved") return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  // Navigation
  const handleStartNewLOI = () => {
    router.push("/dashboard/pages/createform");
  };

  const openDetail = (id?: string) => {
    if (!id) return;
    router.push(`/dashboard/pages/loi/view/${id}`);
  };

  // shared helper
function isObjectRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
  // Type guards for thunk result
  function hasDocId(v: unknown): v is { doc_id: string } {
  if (!isObjectRecord(v)) return false;
  const value = v["doc_id"]; // value: unknown
  return typeof value === "string";
}

  function hasData<T = unknown>(v: unknown): v is { data: T } {
  if (!isObjectRecord(v)) return false;
  // Either existence check...
  if (!("data" in v)) return false;
  // ...or, if you need stricter typing, narrow further:
  // const data = v["data"] as unknown as T;
  return true;
}

  // Upload handlers
  const handleFileUpload = (file: File): void => {
    const sizeKB = file.size / 1024;
    const sizeLabel = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(2)} MB` : `${sizeKB.toFixed(2)} KB`;

    const fileData: FileData = {
      name: file.name,
      size: sizeLabel,
      type: file.type,
      file,
    };
    setUploadedFile(fileData);
  };

  const handleSubmitFile = async (): Promise<void> => {
    if (!fileUpload || uploading) return;

    setUploading(true);
    setProgress(10);
    // Smooth progress while waiting
    const tick = setInterval(() => setProgress((p) => Math.min(p + 5, 90)), 180);

    try {
      const result = await dispatch(submitLOIByFileAsync(fileUpload.file)).unwrap();
      setProgress(100);
      clearInterval(tick);

      let id: string | undefined;

      if (typeof result === "string") {
        id = result;
      } else if (hasDocId(result)) {
        id = result.doc_id;
      } else if (hasData(result)) {
        const d = (result).data;
        if (typeof d === "string") id = d;
        else if (hasDocId(d)) id = d.doc_id;
      }

      if (id) {
        router.push(`/dashboard/pages/loi/view/${id}`);
        setUploadedFile(null);
        setShowUpload(false);
      } else {
        console.error("Could not determine LOI id from submitLOIByFileAsync result:", result);
      }
    } catch (e) {
      console.error("submitLOIByFileAsync failed", e);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  // Drag-and-drop listeners
  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <DashboardLayout>
      {isLoading ? (
        <LoadingOverlay visible />
      ) : (
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8">
            {/* Intro */}
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-sm mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Start a New Letter of Intent</h1>
              <p className="text-gray-600">
                Initiate the LOI process by completing the steps below or reviewing previously saved drafts.
              </p>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 xl:gap-6">
              {/* Left: Start + Upload */}
              <div className="xl:col-span-2 w-full">
                <div className="bg-[#EFF6FF] rounded-lg shadow-sm p-5 sm:p-6 h-full">
                  {/* Section title */}
                  <div className="flex items-center mb-4 sm:mb-6">
                    <Image src="/loititle.png" width={40} height={32} alt="" className="mr-3 sm:mr-4" />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Start New LOI</h2>
                  </div>

                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed pb-6">
                    Create a new Letter of Intent using our step-by-step intake wizard. Our AI-powered platform will
                    guide you through each section to ensure your LOI is comprehensive and professional.
                  </p>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                    <button
                      onClick={handleStartNewLOI}
                      className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Start New LOI
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleSubmitFile}
                      disabled={!fileUpload || uploading}
                      className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 w-full sm:w-auto
                                 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition
                                 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <UploadCloud className="w-4 h-4" />
                      Upload LOI
                    </button>
                  </div>

                  {/* Upload card */}
                  <div className="bg-white rounded-lg  p-5 sm:p-6">
                    <h3 className="text-gray-900 font-medium text-lg mb-4 flex items-center justify-center gap-2">
                      <FileText className="w-6 h-6 text-blue-600" />
                      LOI Document Upload
                    </h3>

                    <div
                      onDragEnter={onDragEnter}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      className={`rounded-lg p-6 sm:p-8 text-center transition-all border-2 border-dashed
                         ${dragActive ? "border-blue-400 bg-blue-50/60" : "border-gray-300"}`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx,.doc"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        className="hidden"
                        id="file-upload"
                      />

                      <label htmlFor="file-upload" className="cursor-pointer block">
                        <div className="rounded-full p-4 mx-auto mb-3 flex items-center justify-center bg-blue-50">
                          <UploadCloud className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
                        </div>

                        <p className="text-base sm:text-lg font-medium text-gray-900 mb-1">
                          Drag and drop your loi documents
                        </p>
                        <p className="text-gray-500 mb-4 text-sm sm:text-base">or click to browse and select files</p>

                        <div className="flex items-center justify-center">
                          <span
                            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Choose Files
                          </span>
                        </div>

                        <div className="mt-4 text-sm sm:text-base font-semibold text-gray-500 space-y-1">
                          <p>Supported formats: PDF, DOCX</p>
                          <p>Maximum file size: 10MB</p>
                        </div>
                      </label>

                      {/* Selected file card */}
                      {fileUpload && (
                        <div className="mt-6 mx-auto max-w-2xl text-left">
                          <div className="rounded-lg border bg-white p-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                <FileText className="w-8 h-8 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="truncate font-medium text-gray-900">{fileUpload.name}</div>
                                  <button
                                    type="button"
                                    className="p-2 rounded hover:bg-gray-100"
                                    onClick={() => setUploadedFile(null)}
                                    aria-label="Remove file"
                                  >
                                    <Trash2 className="w-4 h-4 text-gray-500" />
                                  </button>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {fileUpload.type || "—"} • {fileUpload.size}
                                </div>

                                {/* Progress bar */}
                                {(uploading) && (
                                  <div className="mt-3">

                                    <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">

                                      <>
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        Uploaded
                                      </>

                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                         
                            {/* Submit button (secondary inside card) */}
                            <div className="mt-4 flex items-center justify-end">
                              <button
                                onClick={handleSubmitFile}
                                disabled={!fileUpload || uploading}
                                className="inline-flex items-center gap-2 rounded-md px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
                              >
                                <UploadCloud className="w-4 h-4" />
                                Submit & Process
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* If you prefer your existing UploadedFiles component, keep this block */}
                  {/* <div className="mt-8">
                    {fileUpload && (
                      <UploadedFiles
                        uploadedFile={fileUpload}
                        setUploadedFile={setUploadedFile}
                        check={true}
                      />
                    )}
                  </div> */}
                </div>
              </div>

              {/* Right: Feature cards */}
              <div className="flex flex-col gap-4 w-full">
                {[
                  {
                    icon: "/ai-powered.png",
                    title: "AI-Powered Assistance",
                    desc:
                      "Get intelligent suggestions and guidance throughout the process to ensure your LOI is comprehensive and professional.",
                  },
                  {
                    icon: "/loititle.png",
                    title: "Step-by-Step Wizard",
                    desc:
                      "Complete your LOI with our intuitive guided workflow that walks you through each required section.",
                  },
                  {
                    icon: "/professional.png",
                    title: "Professional Templates",
                    desc: "Use industry-standard LOI templates tailored for commercial leases and real estate transactions.",
                  },
                  {
                    icon: "/step.png",
                    title: "Need Help?",
                    desc: "Our support team is here to assist you with any questions about the LOI process.",
                    support: true,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-xl shadow-sm px-4 py-5 ${item.support ? "min-h-[140px]" : "min-h-[220px]"
                      }`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <Image src={item.icon} width={40} height={30} alt="" />
                      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">{item.title}</h3>
                    </div>
                    <p className="px-1 text-gray-700 text-base sm:text-lg leading-snug">{item.desc}</p>
                    {item.support && (
                      <button className="mt-4 bg-gray-50 font-semibold text-black h-10 w-full px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition">
                        Contact Support
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Draft LOIs */}
            <div className="bg-white rounded-lg shadow-sm mt-8 overflow-hidden">
              <div className="border-b border-gray-200 p-5 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">My Draft LOIs</h2>
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-12 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <div className="col-span-3">LOI Title</div>
                      <div className="col-span-3">Property Address</div>
                      <div className="col-span-2">Last Edited</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Actions</div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {loiList?.my_loi?.map((letter: Letter) => (
                      <div key={letter?.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="grid grid-cols-12 items-center">
                          <div className="col-span-3">
                            <div className="flex items-center">
                              <Image
                                src="/loititle.png"
                                alt="LOI"
                                width={36}
                                height={36}
                                className="mr-3"
                              />
                              <div className="text-sm font-medium text-gray-900 truncate">{letter?.title}</div>
                            </div>
                          </div>

                          <div className="col-span-3">
                            <div className="text-sm text-gray-600 truncate">{letter?.propertyAddress}</div>
                          </div>

                          <div className="col-span-2">
                            <div className="text-sm text-gray-600">
                              {letter?.updated_at && formatDate(letter.updated_at)}
                            </div>
                          </div>

                          <div className="col-span-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(letter?.submit_status)}`}>
                              {letter?.submit_status}
                            </span>
                          </div>

                          <div className="col-span-2">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 hover:bg-gray-100 rounded" onClick={() => openDetail(letter.id)}>
                                <Eye className="w-4 h-4 text-gray-500" />
                              </button>
                              <button
                                className="p-1 hover:bg-gray-100 rounded"
                                onClick={() => router.push(`/dashboard/pages/loi/edit/${letter?.id}`)}
                              >
                                <Edit className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {(!loiList?.my_loi || loiList.my_loi.length === 0) && (
                      <div className="px-6 py-8 text-center text-sm text-gray-500">No draft LOIs yet.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden p-4 space-y-3">
                {loiList?.my_loi?.length ? (
                  loiList.my_loi.map((letter: Letter) => (
                    <div key={letter.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Image src="/loititle.png" alt="LOI" width={32} height={32} />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{letter.title}</div>
                          <div className="text-sm text-gray-600">{letter.propertyAddress}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Last edited: {letter?.updated_at ? formatDate(letter.updated_at) : "—"}
                          </div>
                          <div className="mt-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(letter?.submit_status)}`}>
                              {letter?.submit_status}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <button className="px-3 py-1.5 rounded border text-sm hover:bg-gray-50" onClick={() => openDetail(letter.id)}>
                              <span className="inline-flex items-center gap-1">
                                <Eye className="w-4 h-4" /> View
                              </span>
                            </button>
                            <button
                              className="px-3 py-1.5 rounded border text-sm hover:bg-gray-50"
                              onClick={() => router.push(`/dashboard/pages/loi/edit/${letter?.id}`)}
                            >
                              <span className="inline-flex items-center gap-1">
                                <Edit className="w-4 h-4" /> Edit
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-500 py-6">No draft LOIs yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
