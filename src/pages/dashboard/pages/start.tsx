import { useEffect, useState } from 'react';
import { Edit, Eye } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { getDraftLOIsAsync, submitLOIByFileAsync } from '@/services/loi/asyncThunk';
import { DashboardLayout } from '@/components/layouts';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { formatDate } from '@/utils/dateFormatter';
import { FileData, Letter, LOIStatus } from '@/types/loi';
import { LoadingOverlay } from '@/components/loaders/overlayloader';
import { UploadedFiles } from '@/components/uploadLeaseForm/UploadedFile';

export default function LetterOfIntentDashboard() {
  const [showUpload, setShowUpload] = useState<boolean>(false);
  console.log("showupload", showUpload)
  const [fileUpload, setUploadedFile] = useState<FileData | null>(null);
  console.log("fileUpload", fileUpload)
  const router = useRouter();
  const dispatch = useAppDispatch()
  const { loiList, isLoading } = useAppSelector((state) => state.loi);

  const getStatusColor = (status: LOIStatus) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Sent': return 'bg-blue-100 text-blue-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  const handleStartNewLOI = () => {
    console.log("running")
    router.push('/dashboard/pages/createform');
  };

  useEffect(() => {
    dispatch(getDraftLOIsAsync());
  }, [dispatch]);

  const openDetail = (id?: string) => {
    if (!id) return;
    router.push(`/dashboard/pages/loi/view/${id}`);
  };

  function hasDocId(v: unknown): v is { doc_id: string } {
    return typeof v === "object" && v !== null && "doc_id" in v &&
      typeof (v as { doc_id: unknown }).doc_id === "string";
  }

  function hasData(v: unknown): v is { data: unknown } {
    return typeof v === "object" && v !== null && "data" in v;
  }

  const handleSubmitFile = async (): Promise<void> => {
    if (!fileUpload) return;

    try {
      const result = await dispatch(submitLOIByFileAsync(fileUpload.file)).unwrap();

      let id: string | undefined;

      if (typeof result === "string") {
        id = result;
      } else if (hasDocId(result)) {
        id = result.doc_id;
      } else if (hasData(result)) {
        const d = result.data;
        if (typeof d === "string") {
          id = d;
        } else if (hasDocId(d)) {
          id = d.doc_id;
        }
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
    }
  };

  const handleFileUpload = (file: File): void => {
    const fileData: FileData = {
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type,
      file
    };
    setUploadedFile(fileData);
  };
  return (
    <DashboardLayout>
      {isLoading ? (<LoadingOverlay visible />) : (
        <div className="min-h-screen">
          <div className="max-w-9xl mx-auto px-2 sm:px-6 lg:px-p0 py-8">

            <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
              <h1 className="text-3xl lg:w-[1086px] font-bold text-[24px] text-gray-900 mb-2">Start a New Letter of Intent</h1>
              <p className="text-gray-600">Initiate the LOI process by completing the steps below or reviewing previously saved drafts.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6">
              <div className="xl:col-span-2 w-full">
                <div className="bg-[#EFF6FF] rounded-lg shadow-sm p-6 h-full">
                  <div className="flex items-center mb-6">
                    <Image src="/loititle.png" width={50} height={40} alt="" className="mr-5" />
                    <h2 className="text-xl font-semibold text-gray-900">Start New LOI</h2>
                  </div>

                  <p className="text-gray-600 pt-5 text-[18px] pb-8">
                    Create a new Letter of Intent using our step-by-step intake wizard. Our AI-powered platform
                    will guide you through each section to ensure your LOI is comprehensive and professional.
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-4 mb-8 flex-wrap">
                    {/* Start LOI */}
                    <button
                      className="bg-[#3B82F6] w-[187px] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                      onClick={handleStartNewLOI}
                    >
                      Start New LOI
                      <Image alt="arrow" src="/arrow.png" width={30} height={20} />
                    </button>

                    <button
                      className="bg-[#3B82F6] w-[187px] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                      onClick={handleSubmitFile}
                    >
                      Upload LOI
                      <Image alt="arrow" src="/upload.png" width={30} height={30} />
                    </button>

                  </div>
                  <div className="bg-white rounded-lg border border-dashed border-gray-300 p-6 text-center">
                    <h3 className="text-gray-900 font-medium text-lg mb-4 flex items-center justify-center gap-2">
                      <Image src="/file.png" alt="upload" width={40} height={40} />
                      LOI Document Upload
                    </h3>

                    <div
                      className="border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors "
                    >
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file);
                          }
                        }}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="rounded-full p-4 mx-auto mb-4 flex items-center justify-center">
                          <Image alt="upload" src="/file.png" height={60} width={60} />
                        </div>
                        <p className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                          Drag and drop your lease documents
                        </p>
                        <p className="text-gray-500 mb-4 text-sm sm:text-base">
                          or click to browse and select files
                        </p>
                        <div>
                          <span className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block">
                            Choose Files
                          </span>
                          <div className="mt-4 text-sm sm:text-base font-semibold text-gray-500 space-y-1">
                            <p>Supported formats: PDF, DOCX</p>
                            <p>Maximum file size: 10MB</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className='mt-8'>
                    {fileUpload && (
                      <UploadedFiles
                        uploadedFile={fileUpload}
                        setUploadedFile={setUploadedFile}
                        check={true}
                      />
                    )}
                  </div>
                </div>
              </div>


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
                    className={`bg-white rounded-xl shadow-sm px-4 py-5 ${item.support ? 'min-h-[150px]' : 'min-h-[250px]'
                      }`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <Image src={item.icon} width={40} height={30} alt="" />
                      <h3 className="text-[24px] font-semibold text-gray-900">{item.title}</h3>
                    </div>
                    <p className=" p-7 text-gray-700 text-[22px] mb-3 leading-snug">{item.desc}</p>
                    {item.support && (
                      <button className="bg-gray-50 font-semibold text-black h-9 w-full px-4 py-1 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                        Contact Support
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm mt-8">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">My Draft LOIs</h2>

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Table Header */}
                  <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-12 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <div className="col-span-3">LOI Title</div>
                      <div className="col-span-3">Property Address</div>
                      <div className="col-span-2">Last Edited</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Actions</div>
                    </div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-gray-200">
                    {loiList?.my_loi?.map((letter: Letter) => (
                      <div
                        key={letter?.id}
                        className="px-6 py-4 hover:bg-gray-50"
                      >
                        <div className="grid grid-cols-12 items-center">
                          <div className="col-span-3">
                            <div className="flex items-center">
                              <Image
                                src="/loititle.png"
                                alt="Upload Document"
                                width={40}
                                height={40}
                                className="mr-3"
                              />
                              <div className="text-sm font-medium text-gray-900">
                                {letter?.title}
                              </div>
                            </div>
                          </div>

                          <div className="col-span-3">
                            <div className="text-sm text-gray-500">
                              {letter?.propertyAddress}
                            </div>
                          </div>

                          <div className="col-span-2">
                            <div className="text-sm text-gray-500">
                              {letter?.updated_at && formatDate(letter.updated_at)}
                            </div>
                          </div>

                          <div className="col-span-2">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                letter?.submit_status
                              )}`}
                            >
                              {letter?.submit_status}
                            </span>
                          </div>

                          <div className="col-span-2">
                            <div className="flex items-center space-x-2">
                              <button
                                className="p-1 hover:bg-gray-100 rounded"
                                onClick={() => openDetail(letter.id)}
                              >
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
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      )}

    </DashboardLayout >
  );
}