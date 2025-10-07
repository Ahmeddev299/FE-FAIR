import Image from "next/image";
import { DashboardLayout } from "@/components/layouts";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import { StartNewCard } from "@/components/startlOI/startNewCard";
import { UploadDropzone } from "@/components/startlOI/UploadDropzone";
import { SelectedFileCard } from "@/components/startlOI/selectedFileCard";
import { DraftList } from "@/components/startlOI/draftList";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useLoiDashboard } from "@/hooks/useStartLoI";
import { CustomField } from "@/components/startlOI/customFeilds";
import { useState } from "react";
import { WhyUseLoiSidebar } from "@/components/startlOI/FeatureCards";
import { ArrowRight, UploadCloud } from "lucide-react";

export default function LetterOfIntentDashboard() {
  const [leaseId, setLeaseId] = useState("");
  console.log("leaseId", leaseId)
  const { fileUpload, setUploadedFile, dragActive, uploading, setUploading, progress, setProgress, fileInputRef, pick, drag } = useFileUpload();
  const { loiList, isLoading, myLOIs, goCreate, openDetail, onSelectLoi, submitFile, router } = useLoiDashboard();

  const handleSubmitFile = async () => {
    if (!fileUpload || uploading) return;
    setUploading(true);
    try { await submitFile(fileUpload.file, leaseId, setProgress); setUploadedFile(null); }
    finally { setUploading(false); setProgress(0); }
  };

  return (
    <DashboardLayout>
      {isLoading ? <LoadingOverlay visible /> : (
        <div className="min-h-screen w-full mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Start a New Letter of Intent</h1>
            <p className="text-gray-600">Initiate the LOI process by completing the steps below or reviewing drafts.</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">

              <StartNewCard>
                <div className="mb-5">
                  <CustomField
                    name="leaseId"
                    label="Select LOI"
                    as="select"
                    required
                    value={leaseId}
                    onChange={(e) => {
                      const id = (e.target as HTMLSelectElement).value;
                      setLeaseId(id);
                      onSelectLoi(id);
                    }}
                  >
                    <option value="">-- Select a LOI --</option>
                    {myLOIs?.map(loi => (
                      <option key={loi.id} value={loi.id}>
                        {loi.title}{loi.propertyAddress ? ` — ${loi.propertyAddress}` : ""}
                      </option>
                    ))}
                  </CustomField>
                </div>


                <div className="flex items-center gap-2">
                  <button
                    onClick={goCreate}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-white hover:bg-blue-700"
                  >
                    <span className="text-sm font-medium">Start New LOI</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={handleSubmitFile}
                    disabled={!fileUpload || uploading}
                    className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3.5 py-2 text-blue-700 hover:bg-blue-50 disabled:opacity-60"
                  >
                    <UploadCloud className="h-4 w-4" />
                    <span className="text-sm font-medium">Upload LOI</span>
                  </button>
                </div>

                <div className="mt-6 bg-white rounded-lg p-6">
                  <h3 className="text-gray-900 font-medium text-lg mb-4 flex items-center gap-2">
                    <Image src="/loititle.png" width={24} height={24} alt="" /> LOI Document Upload
                  </h3>

                  <input ref={fileInputRef} type="file" accept=".pdf,.docx,.doc" onChange={e => pick(e.target.files?.[0] || undefined)} className="hidden" id="file-upload" />
                  <UploadDropzone dragActive={dragActive} onPick={() => fileInputRef.current?.click()} dragHandlers={{ onDragEnter: drag.onEnter, onDragOver: drag.onOver, onDragLeave: drag.onLeave, onDrop: drag.onDrop }} />
                  {fileUpload && (
                    <SelectedFileCard
                      file={fileUpload}
                      progress={progress}
                      uploading={uploading}
                      onRemove={() => setUploadedFile(null)}
                      onSubmit={handleSubmitFile}
                    />
                  )}
                </div>
              </StartNewCard>
            </div>

            <WhyUseLoiSidebar />

          </div>

          <div className="bg-white rounded-lg shadow-sm mt-8 overflow-hidden">
            <div className="border-b p-6"><h2 className="text-xl font-semibold text-gray-900">My Draft LOIs</h2></div>
            <div className="hidden md:block overflow-x-auto min-w-[880px]">
              <DraftList
                items={loiList?.my_loi ?? []}
                onView={(id) => openDetail(id)}
                onEdit={(id) => router.push(`/dashboard/pages/loi/edit/${id}`)}
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
