import { useState } from 'react';
import { Plus, FileText, Clock, Users, HelpCircle, Zap, CheckCircle, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';
import { useRouter } from 'next/router'; // or 'next/navigation' if using app directory

export default function LetterOfIntentDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const router = useRouter();

  const sampleLetters = [
    {
      id: 1,
      title: 'Downtown Office Space LOI',
      propertyAddress: '123 Main St, Downtown District',
      lastEdited: '4 days ago',
      status: 'Draft',
      assignee: 'JD'
    },
    {
      id: 2,
      title: 'Retail Space - Shopping Center',
      propertyAddress: '456 Commerce Blvd, Westfield Mall',
      lastEdited: '1 day ago',
      status: 'Sent',
      assignee: 'MS'
    },
    {
      id: 3,
      title: 'Warehouse Facility LOI',
      propertyAddress: '789 Industrial Way, Eastside',
      lastEdited: '1 day ago',
      status: 'Draft',
      assignee: 'AB'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Sent': return 'bg-blue-100 text-blue-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  const handleStartNewLOI = () => {
  router.push('/dashboard/pages/createform');
};

  return (
    <DashboardLayout>
    <div className="min-h-screen">
      <div className="max-w-9xl mx-auto px-2 sm:px-6 lg:px-0 py-8">
        {/* Header */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Start a New Letter of Intent</h1>
          <p className="text-gray-600">Create the LOI process by completing the steps below or reviewing previously saved drafts.</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Start New LOI Module */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <div className="bg-blue-500 rounded-lg p-2 mr-3">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Start New LOI</h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                Create a new Letter of Intent using our step-by-step intake wizard. Our AI-powered platform will guide you through each section to ensure your LOI is comprehensive and professional.
              </p>

              <div className="flex gap-4 mb-6 ">
                <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center" onClick={handleStartNewLOI} >
                  Start New LOsI
                  <Plus className="w-4 h-4 ml-2" />
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                  View Sample LOI
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 h-52">
                <h3 className="font-medium text-gray-900 mb-3">What you'll get:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">Professional LOI template</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">AI-powered suggestions</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">Save and resume anytime</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">Export to PDF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - 4 Equal Width Sections */}
          <div className="lg:col-span-1 space-y-2">
            {/* Section 1 - AI-Powered Assistance */}
            <div className="bg-white rounded-lg shadow-sm p-3 h-28">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 rounded-lg p-2 mr-3">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">AI-Powered Assistance</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Get intelligent suggestions and guidance throughout the process to ensure your LOI is comprehensive and professional.
              </p>
            </div>

            {/* Section 2 - Step-by-Step Wizard */}
            <div className="bg-white rounded-lg shadow-sm p-3 h-28">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 rounded-lg p-2 mr-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Step-by-Step Wizard</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Complete your LOI with our intuitive guided workflow that walks you through each required section.
              </p>
            </div>

            {/* Section 3 - Professional Templates */}
            <div className="bg-white rounded-lg shadow-sm p-3 h-28">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-lg p-2 mr-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Professional Templates</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Use industry-standard LOI templates tailored for commercial leases and real estate transactions.
              </p>
            </div>

            {/* Section 4 - Need Help */}
            <div className="rounded-lg shadow-sm p-3 h-32">
              <div className="flex items-center mb-3">
                <div className="bg-orange-100 rounded-lg p-1 mr-3">
                  <HelpCircle className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Our support team is here to assist you with any questions about the LOI process.
              </p>
              <button className="bg-[#FAFAFA] items-center text-black h-[36px] w-[328px] px-4 py-1 rounded-lg text-lg"   
>
                Contact Support
              </button>
            </div>
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
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-6">
              {['All', 'Draft', 'Sent', 'Approved'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`pb-2 border-b-2 font-medium text-sm ${activeTab === tab.toLowerCase()
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Table Header */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <div className="col-span-3">LOI Title</div>
              <div className="col-span-3">Property Address</div>
              <div className="col-span-2">Last Edited</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Assignee</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200">
            {sampleLetters.map((letter) => (
              <div key={letter.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">{letter.title}</div>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="text-sm text-gray-500">{letter.propertyAddress}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm text-gray-500">{letter.lastEdited}</div>
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(letter.status)}`}>
                      {letter.status}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {letter.assignee}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="flex items-center space-x-1">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
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
    </DashboardLayout>
  );
}