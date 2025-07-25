import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, MoreHorizontal, FileText, Eye, Download, Edit, Trash2, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';
import Image from 'next/image';

interface Document {
  id: string;
  name: string;
  type: string;
  dateUploaded: string;
  status: 'Signed' | 'Draft' | 'Received' | 'Expiring';
  tags: string[];
  size: string;
}

interface Folder {
  name: string;
  count: number;
  isExpanded?: boolean;
  icon: string
}

const DocumentStorage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('All Types');
  const [selectedDate, setSelectedDate] = useState<string>('All Dates');
  const [selectedTags, setSelectedTags] = useState<string>('All Tags');
  const [selectedIndex, setSelectedIndex] = useState(0); // default to 'All Documents'
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [folders, setFolders] = useState<Folder[]>([
    { name: 'All Documents', count: 47, isExpanded: true, icon: '/folder.png' },
    { name: 'LOIs', count: 12, icon: '/document.png' },
    { name: 'Leases', count: 8, icon: '/lease.png' },
    { name: 'Terminations', count: 3, icon: '/cross.png' },
    { name: 'Notices', count: 24, icon: '/notice.png' }
  ]);

  const documents: Document[] = [
    {
      id: '1',
      name: 'Downtown Office Lease Agreement',
      type: 'Lease',
      dateUploaded: '2024-01-15',
      status: 'Signed',
      tags: ['Termination Clause', 'Indemnity'],
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'LOI - Retail Space Main St',
      type: 'LOI',
      dateUploaded: '2024-01-10',
      status: 'Draft',
      tags: ['High Risk', 'Renewal Option'],
      size: '1.2 MB'
    },
    {
      id: '3',
      name: 'Eviction Notice - Unit 4B',
      type: 'Notice',
      dateUploaded: '2024-01-08',
      status: 'Received',
      tags: ['Urgent', 'Legal Action'],
      size: '856 KB'
    },
    {
      id: '4',
      name: 'Lease Termination Agreement',
      type: 'Termination',
      dateUploaded: '2024-01-05',
      status: 'Expiring',
      tags: ['30-Day Notice', 'Security Deposit'],
      size: '1.8 MB'
    },
    {
      id: '5',
      name: 'Warehouse LOI Response',
      type: 'LOI',
      dateUploaded: '2024-01-03',
      status: 'Signed',
      tags: ['Accepted', 'Move-In Ready'],
      size: '3.1 MB'
    }
  ];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Signed': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Received': return 'bg-blue-100 text-blue-800';
      case 'Expiring': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTagColor = (tag: string): string => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800'
    ];
    return colors[tag.length % colors.length];
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  const toggleFolder = (index: number) => {
    setSelectedIndex(index);
    setFolders(prev => prev.map((folder, i) =>
      i === index ? { ...folder, isExpanded: !folder.isExpanded } : folder
    ));
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen  overflow-x-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="w-full max-w-none">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Document Storage</h1>
            <p className="text-sm sm:text-base text-gray-600">Centralized repository for all your legal documents</p>
          </div>
        </div>

        <div className="w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full max-w-none">
            {/* Sidebar - Hidden on small screens by default, collapsible on medium */}
            <div className="lg:w-64 lg:flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-3 sm:p-4 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Folders</h2>
                </div>
                <div className="p-2">
                  {folders.map((folder, index) => {
                    const isSelected = selectedIndex === index;
                    // Adjust this logic as needed

                    return (
                      <div key={folder.name} className="mb-1">
                        <button
                          onClick={() => toggleFolder(index)}
                          className={`w-full flex items-center justify-between px-2 sm:px-3 py-2 text-left rounded-md transition-colors ${isSelected ? 'bg-[#EFF6FF]' : 'hover:bg-gray-50'
                            }`}
                        >
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <Image
                              src={folder.icon}
                              alt={`${folder.name} icon`}
                              width={30}
                              height={30}
                              className="h-4 w-4 flex-shrink-0"
                            />
                            <span className={`text-xs sm:text-sm font-medium truncate ${isSelected ? 'text-[#2563EB]' : 'text-gray-900'
                              }`}>
                              {folder.name}
                            </span>

                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2
    ${isSelected ? 'text-blue-600 bg-[#DBEAFE]' : 'text-gray-500 bg-gray-100'}
  `}
                          >
                            {folder.count}
                          </span>

                        </button>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Search and Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
                <div className="p-2 sm:p-4">
                  <div className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search documents..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* Filters - Mobile Toggle */}
                    <div className="sm:hidden">
                      <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100"
                      >
                        <span>Filters</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Filters */}
                    <div className={`space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:gap-3 ${showMobileFilters ? 'block' : 'hidden sm:flex'}`}>
                      <select
                        className="w-full sm:w-auto px-1 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                      >
                        <option>All Types</option>
                        <option>Lease</option>
                        <option>LOI</option>
                        <option>Notice</option>
                        <option>Termination</option>
                      </select>

                      <select
                        className="w-full sm:w-auto px-1 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      >
                        <option>All Dates</option>
                        <option>This Week</option>
                        <option>This Month</option>
                        <option>This Year</option>
                      </select>

                      <select
                        className="w-full sm:w-auto px-1 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedTags}
                        onChange={(e) => setSelectedTags(e.target.value)}
                      >
                        <option>All Tags</option>
                        <option>Urgent</option>
                        <option>High Risk</option>
                        <option>Legal Action</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-3 sm:px-7 py-3 sm:py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Documents ({filteredDocuments.length})</h2>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {filteredDocuments.length} of {documents.length} shown
                    </div>
                  </div>
                </div>

                {/* Desktop Table - Hidden on mobile and tablet */}
                <div className="hidden xl:block w-full">
                  <div className="overflow-x-auto -mx-1">
                    <div className="inline-block min-w-full align-middle px-1">
                      <table className="min-w-full w-full">
                        <thead className="bg-white border-b border-gray-200">
                          <tr>
                            <th className="px-7 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                              <div className="truncate">Document Name</div>
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                              Type
                            </th>

                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                              Status
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                              Tags
                            </th>

                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredDocuments.map((doc) => (
                            <tr key={doc.id} className="hover:bg-gray-50">
                              <td className="px-7 py-4 min-w-0">
                                <div className="flex items-center min-w-0">
                                  <span className="text-sm font-medium text-gray-900 truncate whitespace-nowrap overflow-hidden max-w-[150px]">
                                    {doc.name}
                                  </span>
                                </div>
                              </td>

                              <td className="px-7 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-900">{doc.type}</span>
                              </td>

                              <td className="px-7 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                                  {doc.status}
                                </span>
                              </td>
                              <td className="px-3 py-4">
                                <div className="flex flex-wrap gap-1">
                                  {doc.tags.slice(0, 2).map((tag, index) => (
                                    <span key={index} className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTagColor(tag)} whitespace-nowrap`}>
                                      {tag}
                                    </span>
                                  ))}
                                  {doc.tags.length > 2 && (
                                    <span className="text-xs text-gray-500 whitespace-nowrap">+{doc.tags.length - 2}</span>
                                  )}
                                </div>
                              </td>

                              <td className="px-5 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-1">
                                  <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50">
                                    <Eye className="h-4 w-4" />
                                  </button>

                                  <button className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-50">
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Tablet View - Simplified table for medium screens */}
                <div className="hidden md:block xl:hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Document
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status & Tags
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Details
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDocuments.map((doc) => (
                          <tr key={doc.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium text-gray-900 truncate">{doc.name}</div>
                                  <div className="text-xs text-gray-500">{doc.type}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="space-y-2">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                                  {doc.status}
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {doc.tags.slice(0, 2).map((tag, index) => (
                                    <span key={index} className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTagColor(tag)}`}>
                                      {tag}
                                    </span>
                                  ))}
                                  {doc.tags.length > 2 && (
                                    <span className="text-xs text-gray-500">+{doc.tags.length - 2} more</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-xs text-gray-900">
                                <div>{doc.dateUploaded}</div>
                                <div className="text-gray-500">{doc.size}</div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-1">
                                <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-50">
                                  <Download className="h-4 w-4" />
                                </button>
                                <button className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-50">
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="p-3 sm:p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start min-w-0 flex-1">
                          <FileText className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-medium text-gray-900 break-words">{doc.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">{doc.type} • {doc.dateUploaded} • {doc.size}</p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mb-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {doc.tags.map((tag, index) => (
                          <span key={index} className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTagColor(tag)}`}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-3">
                          <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-xs font-medium">
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 text-xs font-medium">
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-50">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {filteredDocuments.length === 0 && (
                  <div className="p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-sm font-medium text-gray-900 mb-2">No documents found</h3>
                    <p className="text-sm text-gray-500">Try adjusting your search or filters to find what you are looking for.</p>
                  </div>
                )}
              </div>

              {/* Pagination/Slider - Enhanced Design */}
              {filteredDocuments.length > 0 && (
                <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        Showing <span className="font-medium">1-{filteredDocuments.length}</span> of <span className="font-medium">{documents.length}</span> documents
                      </span>
                    </div>

                    {/* Modern Slider */}
                    <div className="flex items-center space-x-4">
                      <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronRight className="h-4 w-4 rotate-180" />
                      </button>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 font-medium">4/5</span>
                      </div>

                      <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DocumentStorage;