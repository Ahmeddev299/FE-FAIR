import { useEffect, useState } from 'react';
import { CheckCircle, Search, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'; // adjust based on your setup
import { getDraftLOIsAsync } from '@/services/loi/asyncThunk'; // adjust path to where your thunk is located
import { DashboardLayout } from '@/components/layouts';
import { useRouter } from 'next/router'; // or 'next/navigation' if using app directory
import Image from 'next/image';
import { formatDate } from '@/utils/dateFormatter';
import { Letter, LOIStatus } from '@/types/loi';
import { LoadingOverlay } from '@/components/loaders/overlayloader';

export default function LetterOfIntentDashboard() {
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  return (
    <DashboardLayout>
      {isLoading ? (<LoadingOverlay isVisible />) : (
        <div className="min-h-screen">
          <div className="max-w-9xl mx-auto px-2 sm:px-6 lg:px-p0 py-8">
            {/* Header */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
              <h1 className="text-3xl lg:w-[1086px] font-bold text-[24px] text-gray-900 mb-2">Start a New Letter of Intent</h1>
              <p className="text-gray-600">Initiate the LOI process by completing the steps below or reviewing previously saved drafts.</p>
            </div>
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6">
              {/* Left Side */}
              <div className="xl:col-span-2 w-full">
                <div className="bg-[#EFF6FF] rounded-lg shadow-sm p-6 h-full">
                  <div className="flex items-center mb-6">
                    <Image src='/loititle.png' width={50} height={40} alt="" className='mr-5' />

                    <h2 className="text-xl font-semibold text-gray-900">Start New LOI</h2>
                  </div>

                  <p className="text-gray-600 pt-5 text-[18px] pb-8">
                    Create a new Letter of Intent using our step-by-step intake wizard. Our AI-powered platform will guide you through each section to ensure your LOI is comprehensive and professional.
                  </p>

                  <div className="flex gap-4 mb-8 flex-wrap">
                    <button
                      className="bg-[#3B82F6] w-[187px] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                      onClick={handleStartNewLOI}
                    >
                      Start New LOI
                      <Image alt='arrow' src='/arrow.png' width={30} height={20} />
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

              {/* Right Side - Four Feature Cards */}
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
                    className={`bg-white rounded-xl shadow-sm px-4 py-5 ${item.support ? 'min-h-[150px]' : 'min-h-[130px]'
                      }`}
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

            {/* My Draft LOIs Section */}
            <div className="bg-white rounded-lg shadow-sm mt-8">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">My Draft LOIs</h2>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search drafts..."
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Table Scroll Wrapper */}
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Table Header */}
                  <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-0 text-xs font-semibold text-black-500 uppercase tracking-wide">
                      <div className="col-span-3">LOI Title</div>
                      <div className="col-span-3">Property Address</div>
                      <div className="col-span-2">Last Edited</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-1">Actions</div>
                    </div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-gray-200">
                    {loiList?.my_loi?.map((letter: Letter) => (
                      <div key={letter?.id} className="px-4 sm:px-6 md:px-8 lg:px-12 py-4 hover:bg-gray-50">
                        <div className="grid grid-cols-12 gap-1 items-center">
                          <div className="col-span-3">
                            <div className="flex items-center">
                              <Image
                                src="/loititle.png"
                                alt="Upload Document"
                                width={24}
                                height={24}
                                className="w-10 h-10 mr-3" // ← Added margin-right
                              />
                              <div className="text-sm font-medium text-gray-900">
                                {letter?.title}
                              </div>
                            </div>
                          </div>

                          <div className="col-span-3">
                            <div className="text-sm text-gray-500">{letter?.propertyAddress}</div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-sm text-gray-500">
                              {letter?.updated_at && formatDate(letter.updated_at)}
                            </div>                        </div>
                          <div className="col-span-2">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                letter?.submit_status
                              )}`}
                            >
                              {letter?.submit_status}
                            </span>
                          </div>

                          <div className="col-span-1">
                            <div className="flex items-center space-x-1">
                              <button
                                className="p-1 hover:bg-gray-100 rounded"
                                onClick={() => {
                                  setSelectedLetter(letter);
                                  setIsModalOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4 text-gray-500"
                                  onClick={() => openDetail(letter.id)}
                                />
                              </button>

                              <button className="p-1 hover:bg-gray-100 rounded"
                                onClick={() => router.push(`/dashboard/pages/loi/edit/${letter?.id}`)}
                              >
                                <Edit className="w-4 h-4 text-gray-500" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Trash2 className="w-4 h-4 text-gray-500" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <MoreHorizontal className="w-4 h-4 text-gray-500" />
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