import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { CheckCircle, Edit, Eye, FileDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getDraftLOIsAsync } from "@/services/loi/asyncThunk";
import { DashboardLayout } from "@/components/layouts";
import { formatDate } from "@/utils/dateFormatter";
import { Letter, LOIStatus } from "@/types/loi";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import Toast from "@/components/Toast";
import { normalizeLoiResponse } from "./loi/view/[id]";
import { exportLoiToDocx } from "@/utils/exportDocx";
import ls from "localstorage-slim";
import axios from "axios";
import Config from "@/config/index";

export default function LetterOfIntentDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loiList, isLoading } = useAppSelector((state) => state.loi);

  // row-scoped download state/guards
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const downloadingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      downloadingRef.current = false;
    };
  }, []);

  const getStatusColor = (status: LOIStatus) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Sent":
        return "bg-blue-100 text-blue-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStartNewLOI = () => {
    router.push("/dashboard/pages/createform");
  };

  useEffect(() => {
    dispatch(getDraftLOIsAsync());
  }, [dispatch]);

  const openDetail = (id?: string) => {
    if (!id) return;
    router.push(`/dashboard/pages/loi/view/${id}`);
  };

  const handleDownload = async (row: Letter) => {
    if (downloadingRef.current) return; // double-click/HMR guard
    downloadingRef.current = true;
    const rowId = (row?.id as string) || "";
    setDownloadingId(rowId);

    try {
      const token = ls.get("access_token", { decrypt: true });
      if (!token) throw new Error("Authentication token not found");

      const payload = { ...row }; // exact document, as requested
      const response = await axios.post(
        `${Config.API_ENDPOINT}/dashboard/download_template_data`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const maybe = (response || {}) as { success?: boolean; message?: string } | undefined;
      if (maybe?.success === false) throw new Error(maybe.message || "Failed to fetch LOI");
      if (maybe?.message) Toast.fire({ icon: "success", title: maybe.message });

      const data = normalizeLoiResponse(response); 
      await exportLoiToDocx(data);

      if (isMountedRef.current) {
        Toast.fire({ icon: "success", title: "LOI exported successfully" });
      }
    } catch (err: unknown) {
      const msg =
        typeof err === "string"
          ? err
          : (err as { message?: string })?.message || "Could not export LOI";
      Toast.fire({ icon: "warning", title: msg });
    } finally {
      downloadingRef.current = false;
      setDownloadingId(null);
    }
  };

  const drafts = loiList?.my_loi ?? [];

  return (
    <DashboardLayout>
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <div className="min-h-screen">
          {/* page container */}
          <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {/* header card */}
            <div className="mb-6 rounded-lg bg-white p-4 shadow-sm sm:p-6">
              <h1 className="mb-1 text-xl font-bold text-gray-900 sm:text-2xl">
                Start a New Letter of Intent
              </h1>
              <p className="text-sm text-gray-600 sm:text-base">
                Initiate the LOI process by completing the steps below or reviewing previously saved drafts.
              </p>
            </div>

            {/* top grid */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-6">
              {/* left: hero */}
              <div className="xl:col-span-2">
                <div className="flex h-full flex-col rounded-lg bg-[#EFF6FF] p-5 shadow-sm sm:p-6">
                  <div className="mb-4 flex items-center">
                    <Image src="/loititle.png" width={44} height={36} alt="Start LOI" className="mr-3" />
                    <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Start New LOI</h2>
                  </div>

                  <p className="mb-6 text-sm text-gray-700 sm:text-base">
                    Create a new Letter of Intent using our step-by-step intake wizard. Our AI-powered
                    platform will guide you through each section to ensure your LOI is comprehensive and professional.
                  </p>

                  <div className="mb-6 flex flex-wrap gap-3">
                    <button
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 py-3 text-white transition-colors hover:bg-blue-600 sm:w-auto"
                      onClick={handleStartNewLOI}
                    >
                      Start New LOI
                      <Image alt="arrow" src="/arrow.png" width={22} height={16} />
                    </button>
                  </div>

                  <div className="my-4 h-px w-full bg-[#DBEAFE]" />

                  <div className="rounded-lg bg-[#EFF6FF] p-4">
                    <h3 className="mb-3 font-medium text-gray-900">What you will get:</h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {[
                        "Professional LOI template",
                        "AI-powered suggestions",
                        "Save and resume anytime",
                        "Export to PDF",
                      ].map((text, i) => (
                        <div className="flex items-center" key={i}>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* right: info cards */}
              <div className="flex w-full flex-col gap-4">
                {[
                  {
                    icon: "/ai-powered.png",
                    title: "AI-Powered Assistance",
                    desc: "Get intelligent suggestions and guidance throughout the process to ensure your LOI is comprehensive and professional.",
                  },
                  {
                    icon: "/loititle.png",
                    title: "Step-by-Step Wizard",
                    desc: "Complete your LOI with our intuitive guided workflow that walks you through each required section.",
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
                    className="rounded-xl bg-white px-4 py-5 shadow-sm"
                  >
                    <div className="mb-2 flex items-start gap-3">
                      <Image src={item.icon} width={36} height={28} alt="" />
                      <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                    </div>
                    <p className="mb-3 text-sm leading-snug text-gray-700">{item.desc}</p>
                    {item.support && (
                      <button className="h-9 w-full rounded-lg bg-gray-50 px-4 py-1 text-sm font-semibold text-black transition-colors hover:bg-gray-100">
                        Contact Support
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Draft LOIs */}
            <div className="mt-8 rounded-lg bg-white shadow-sm">
              <div className="border-b border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">My Draft LOIs</h2>
              </div>

              {/* Mobile: card list */}
              <div className="block md:hidden">
                <div className="divide-y divide-gray-200">
                  {drafts.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">No drafts yet.</div>
                  ) : (
                    drafts.map((letter: Letter) => {
                      const isRowDownloading = downloadingId === letter?.id;
                      return (
                        <div key={letter?.id} className="p-4">
                          <div className="mb-2 flex items-center">
                            <Image
                              src="/loititle.png"
                              alt="LOI"
                              width={36}
                              height={36}
                              className="mr-3"
                            />
                            <div className="text-sm font-medium text-gray-900">{letter?.title}</div>
                          </div>

                          <div className="space-y-1 text-sm text-gray-600">
                            <div><span className="font-medium text-gray-800">Property:</span> {letter?.propertyAddress || "-"}</div>
                            <div>
                              <span className="font-medium text-gray-800">Last Edited:</span>{" "}
                              {letter?.updated_at ? formatDate(letter.updated_at) : "-"}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800">Status:</span>
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(
                                  letter?.submit_status
                                )}`}
                              >
                                {letter?.submit_status}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              className="rounded bg-gray-100 p-2 hover:bg-gray-200"
                              onClick={() => openDetail(letter.id)}
                              title="View"
                            >
                              <Eye className="h-4 w-4 text-gray-600" />
                            </button>
                            <button
                              className="rounded bg-gray-100 p-2 hover:bg-gray-200"
                              onClick={() => router.push(`/dashboard/pages/loi/edit/${letter?.id}`)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4 text-gray-600" />
                            </button>
                            <button
                              className="rounded bg-gray-100 p-2 hover:bg-gray-200 disabled:opacity-60"
                              onClick={() => handleDownload(letter)}
                              disabled={!letter?.id || isRowDownloading}
                              title="Download DOCX"
                            >
                              <FileDown className="h-4 w-4 text-gray-700" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Desktop: table */}
              <div className="hidden md:block">
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    {/* Header */}
                    <div className="bg-gray-50 px-6 py-3">
                      <div className="grid grid-cols-12 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        <div className="col-span-4 lg:col-span-3">LOI Title</div>
                        <div className="col-span-4 lg:col-span-3">Property Address</div>
                        <div className="col-span-2">Last Edited</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-12 mt-2 text-left sm:col-span-2 sm:mt-0">Actions</div>
                      </div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-gray-200">
                      {drafts.length === 0 ? (
                        <div className="px-6 py-4 text-sm text-gray-500">No drafts yet.</div>
                      ) : (
                        drafts.map((letter: Letter) => {
                          const isRowDownloading = downloadingId === letter?.id;
                          return (
                            <div key={letter?.id} className="px-6 py-4 hover:bg-gray-50">
                              <div className="grid grid-cols-12 items-center gap-y-2">
                                <div className="col-span-4 lg:col-span-3">
                                  <div className="flex items-center">
                                    <Image
                                      src="/loititle.png"
                                      alt="Upload Document"
                                      width={36}
                                      height={36}
                                      className="mr-3"
                                    />
                                    <div className="text-sm font-medium text-gray-900">
                                      {letter?.title}
                                    </div>
                                  </div>
                                </div>

                                <div className="col-span-4 lg:col-span-3">
                                  <div className="truncate text-sm text-gray-600">
                                    {letter?.propertyAddress || "-"}
                                  </div>
                                </div>

                                <div className="col-span-2">
                                  <div className="text-sm text-gray-600">
                                    {letter?.updated_at && formatDate(letter.updated_at)}
                                  </div>
                                </div>

                                <div className="col-span-2">
                                  <span
                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                                      letter?.submit_status
                                    )}`}
                                  >
                                    {letter?.submit_status}
                                  </span>
                                </div>

                                <div className="col-span-12 sm:col-span-2">
                                  <div className="flex items-center space-x-2">
                                    <button
                                      className="rounded p-1 hover:bg-gray-100"
                                      onClick={() => openDetail(letter.id)}
                                      title="View"
                                    >
                                      <Eye className="h-4 w-4 text-gray-600" />
                                    </button>
                                    <button
                                      className="rounded p-1 hover:bg-gray-100"
                                      onClick={() =>
                                        router.push(`/dashboard/pages/loi/edit/${letter?.id}`)
                                      }
                                      title="Edit"
                                    >
                                      <Edit className="h-4 w-4 text-gray-600" />
                                    </button>
                                    <button
                                      className="rounded p-1 hover:bg-gray-100 disabled:opacity-60"
                                      onClick={() => handleDownload(letter)}
                                      disabled={!letter?.id || isRowDownloading}
                                      title="Download DOCX"
                                    >
                                      <FileDown className="h-4 w-4 text-gray-700" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end Draft LOIs */}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
