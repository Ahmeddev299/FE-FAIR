import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, MoreHorizontal, FileText, Eye, Download, Edit, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';

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
}

const DocumentStorage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('All Types');
  const [selectedDate, setSelectedDate] = useState<string>('All Dates');
  const [selectedTags, setSelectedTags] = useState<string>('All Tags');
  const [folders, setFolders] = useState<Folder[]>([
    { name: 'All Documents', count: 47, isExpanded: true },
    { name: 'LOIs', count: 12 },
    { name: 'Leases', count: 8 },
    { name: 'Terminations', count: 3 },
    { name: 'Notices', count: 24 }
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
    setFolders(prev => prev.map((folder, i) => 
      i === index ? { ...folder, isExpanded: !folder.isExpanded } : folder
    ));
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Storage</h1>
          <p className="text-gray-600">Centralized repository for all your legal documents</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Sidebar */}
          <div className="xl:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Folders</h2>
              </div>
              <div className="p-2">
                {folders.map((folder, index) => (
                  <div key={folder.name} className="mb-1">
                    <button
                      onClick={() => toggleFolder(index)}
                      className="w-full flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{folder.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {folder.count}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search documents by title, clause, or keyword..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    >
                      <option>All Dates</option>
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>This Year</option>
                    </select>

                    <select
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            {/* Documents Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Documents (5)</h2>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Uploaded
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tags
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{doc.type}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{doc.dateUploaded}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.map((tag, index) => (
                              <span key={index} className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTagColor(tag)}`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{doc.size}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800 p-1 rounded">
                              <Download className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800 p-1 rounded">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800 p-1 rounded">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{doc.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">{doc.type} • {doc.dateUploaded}</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                      <span className="text-xs text-gray-500">{doc.size}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {doc.tags.map((tag, index) => (
                        <span key={index} className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTagColor(tag)}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 p-1 rounded">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 p-1 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 p-1 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default DocumentStorage;