import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CheckCircle, Edit, Eye, FileDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { getDraftLOIsAsync } from '@/services/loi/asyncThunk';
import { DashboardLayout } from '@/components/layouts';
import { formatDate } from '@/utils/dateFormatter';
import { Letter, LOIStatus } from '@/types/loi';
import { LoadingOverlay } from '@/components/loaders/overlayloader';
import Toast from '@/components/Toast';
import { normalizeLoiResponse } from './loi/view/[id]';
import { exportLoiToDocx } from '@/utils/exportDocx';
import ls from "localstorage-slim";
import axios from 'axios';
import Config from "@/config/index";

export default function LetterOfIntentDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loiList, isLoading } = useAppSelector((state) => state.loi);

  // row-scoped download state/guards
  const [downloadingId, setDownloadingId] = useState<string | null | boolean> (false);
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
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Sent': return 'bg-blue-100 text-blue-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartNewLOI = () => {
    router.push('/dashboard/pages/createform');
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
    const rowId = (row?.id as string) || '';
    setDownloadingId(rowId);

    try {
      const token = ls.get('access_token', { decrypt: true });
      if (!token) throw new Error('Authentication token not found');

      const payload = { ...row }; // exact document, as requested

      console.log("payload", payload)
      // Ask server to build/normalize the LOI for export (your endpoint)
      const response = await axios.post(
        `${Config.API_ENDPOINT}/dashboard/download_tempalte_data`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );


      //     downloadloi = (data: any, option = {}): Promise<any> =>
      // this.post(this.prefix + `/download_tempalte_data`, data, option);

      const maybe = (response || {}) as { success?: boolean; message?: string } | undefined;
      if (maybe?.success === false) throw new Error(maybe.message || 'Failed to fetch LOI');
      if (maybe?.message) Toast.fire({ icon: 'success', title: maybe.message });

      // Normalize -> export to DOCX (existing pipeline)
      const data = normalizeLoiResponse(response);
      await exportLoiToDocx(data);

      if (isMountedRef.current) {
        Toast.fire({ icon: 'success', title: 'LOI exported successfully' });
      }
    } catch (err: unknown) {
      const msg =
        typeof err === "string"
          ? err
          : (err as { message?: string })?.message || "Could not reset password";


        Toast.fire({ icon: "warning", title: {msg} });
        router.push("/auth/verify-otp");
      
    } finally {
      downloadingRef.current = false;
      setDownloadingId(null);
    }
  };

  return (
    <DashboardLayout>
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <div className="min-h-screen">
          <div className="max-w-9xl mx-auto px-2 sm:px-6 lg:px-p0 py-8">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
              <h1 className="text-3xl lg:w-[1086px] font-bold text-[24px] text-gray-900 mb-2">
                Start a New Letter of Intent
              </h1>
              <p className="text-gray-600">
                Initiate the LOI process by completing the steps below or reviewing previously saved drafts.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6">
              <div className="xl:col-span-2 w-full">
                <div className="bg-[#EFF6FF] rounded-lg shadow-sm p-6 h-full">
                  <div className="flex items-center mb-6">
                    <Image src="/loititle.png" width={50} height={40} alt="" className="mr-5" />
                    <h2 className="text-xl font-semibold text-gray-900">Start New LOI</h2>
                  </div>

                  <p className="text-gray-600 pt-5 text-[18px] pb-8">
                    Create a new Letter of Intent using our step-by-step intake wizard. Our AI-powered platform will
                    guide you through each section to ensure your LOI is comprehensive and professional.
                  </p>

                  <div className="flex gap-4 mb-8 flex-wrap">
                    <button
                      className="bg-[#3B82F6] w-[187px] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                      onClick={handleStartNewLOI}
                    >
                      Start New LOI
                      <Image alt="arrow" src="/arrow.png" width={30} height={20} />
                    </button>
                  </div>

                  <div className=" h-[1.5px] bg-[#DBEAFE] w-full my-15" />
                  <div className="bg-[#EFF6FF] rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">What you will get:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Professional LOI template',
                        'AI-powered suggestions',
                        'Save and resume anytime',
                        'Export to PDF',
                      ].map((text, i) => (
                        <div className="flex items-center" key={i}>
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-700">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* <LoadingOverlay
                visible={downloadingId} 
                size="default"
                fullscreen={true}
              /> */}

              <div className="flex flex-col gap-4 w-full">
                {[
                  {
                    icon: '/ai-powered.png',
                    title: 'AI-Powered Assistance',
                    desc: 'Get intelligent suggestions and guidance throughout the process to ensure your LOI is comprehensive and professional.',
                  },
                  {
                    icon: '/loititle.png',
                    title: 'Step-by-Step Wizard',
                    desc: 'Complete your LOI with our intuitive guided workflow that walks you through each required section.',
                  },
                  {
                    icon: '/professional.png',
                    title: 'Professional Templates',
                    desc: 'Use industry-standard LOI templates tailored for commercial leases and real estate transactions.',
                  },
                  {
                    icon: '/step.png',
                    title: 'Need Help?',
                    desc: 'Our support team is here to assist you with any questions about the LOI process.',
                    support: true,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-xl shadow-sm px-4 py-5 ${item.support ? 'min-h-[150px]' : 'min-h-[130px]'}`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <Image src={item.icon} width={40} height={30} alt="" />
                      <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                    </div>
                    <p className="text-gray-700 text-sm mb-3 leading-snug">{item.desc}</p>
                    {item.support && (
                      <button className="bg-gray-50 font-semibold text-black h-9 w-full px-4 py-1 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                        Contact Support
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Draft LOIs */}
            <div className="bg-white rounded-lg shadow-sm mt-8">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">My Draft LOIs</h2>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header */}
                  <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-12 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <div className="col-span-3">LOI Title</div>
                      <div className="col-span-3">Property Address</div>
                      <div className="col-span-2">Last Edited</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Actions</div>
                    </div>
                  </div>

                  {/* Rows */}
                  <div className="divide-y divide-gray-200">
                    {loiList?.my_loi?.map((letter: Letter) => {
                      const isRowDownloading = downloadingId === letter?.id;
                      return (
                        <div key={letter?.id} className="px-6 py-4 hover:bg-gray-50">
                          <div className="grid grid-cols-12 items-center">
                            <div className="col-span-3">
                              <div className="flex items-center">
                                <Image src="/loititle.png" alt="Upload Document" width={40} height={40} className="mr-3" />
                                <div className="text-sm font-medium text-gray-900">{letter?.title}</div>
                              </div>
                            </div>

                            <div className="col-span-3">
                              <div className="text-sm text-gray-500">{letter?.propertyAddress}</div>
                            </div>

                            <div className="col-span-2">
                              <div className="text-sm text-gray-500">
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
                                <button
                                  className="p-1 hover:bg-gray-100 rounded"
                                  onClick={() => openDetail(letter.id)}
                                  title="View"
                                >
                                  <Eye className="w-4 h-4 text-gray-500" />
                                </button>

                                <button
                                  className="p-1 hover:bg-gray-100 rounded"
                                  onClick={() => router.push(`/dashboard/pages/loi/edit/${letter?.id}`)}
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4 text-gray-500" />
                                </button>

                                {/* NEW: Download button */}
                                <button
                                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-60"
                                  onClick={() => handleDownload(letter)}
                                  disabled={!letter?.id || isRowDownloading}
                                  title="Download DOCX"
                                >

                                  <span className="inline-flex items-center gap-1 text-gray-700">
                                    <FileDown className="w-4 h-4" />
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
