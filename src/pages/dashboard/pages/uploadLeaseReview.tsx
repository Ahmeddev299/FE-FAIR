import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Search, 
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  X,
  Edit,
  Check,
  MessageSquare,
  FileCheck,
  Scale,
  Bot,
  ExternalLink,
  Menu,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';

function LeaseClauseReview() {
  const [selectedClause, setSelectedClause] = useState('Base Rent Amount');
  const [riskLevel, setRiskLevel] = useState('All Risk Levels');
  const [category, setCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const clauses = [
    {
      id: 'base-rent',
      name: 'Base Rent Amount',
      status: 'compliant',
      risk: 'low',
      category: 'Rent',
      hasChanges: false
    },
    {
      id: 'cam-charges',
      name: 'CAM Charges',
      status: 'needs-review',
      risk: 'medium',
      category: 'Common Area Maintenance',
      hasChanges: false
    },
    {
      id: 'termination',
      name: 'Early Termination Rights',
      status: 'high-risk',
      risk: 'high',
      category: 'Termination',
      hasChanges: false
    },
    {
      id: 'indemnity',
      name: 'Tenant Indemnification',
      status: 'compliant',
      risk: 'medium',
      category: 'Indemnity',
      hasChanges: false
    }
  ];

  const clauseDetails = {
    'Base Rent Amount': {
      original: "Tenant shall pay to Landlord as base rent for the Premises the sum of Twenty-Five Thousand Dollars ($25,000) per month, payable in advance on the first day of each calendar month during the Term.",
      suggested: "Tenant shall pay to Landlord as base rent for the Premises the sum of Twenty-Five Thousand Dollars ($25,000) per month, payable in advance on or before the first day of each calendar month during the Term. Late payments shall incur a grace period of five (5) business days before penalties apply.",
      risk: 'low',
      riskScore: '2/10',
      status: 'compliant',
      analysis: {
        type: 'Low Risk',
        message: 'This clause appears reasonable and balanced for both parties.',
        keyChanges: 'The suggested revision adds important protections and clarifications to limit your exposure while maintaining fairness.'
      }
    }
  };

  const currentClause = clauseDetails[selectedClause] || clauseDetails['Base Rent Amount'];

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'compliant': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'needs-review': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'high-risk': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <button className="md:hidden mr-3 p-2 rounded-lg hover:bg-gray-100" onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}>
              <Menu className="w-5 h-5" />
            </button>
            <button className="hidden sm:flex items-center text-gray-600 hover:text-gray-800 mr-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Back to Upload</span>
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Lease Clause Review</h1>
              <div className="hidden sm:flex items-center text-sm text-gray-500 mt-1">
                <FileText className="w-4 h-4 mr-1" />
                <span className="truncate">Downtown Office Lease Agreement.pdf</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button className="hidden sm:flex items-center px-3 sm:px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Export Summary</span>
            </button>
            <button className="hidden sm:flex items-center px-3 sm:px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Download PDF</span>
            </button>
            <button className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              <Bot className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">AI Assistant</span>
            </button>
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setRightSidebarOpen(!rightSidebarOpen)}>
              <Bot className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 overflow-x-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search clauses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2 flex-wrap sm:flex-nowrap">
            <select 
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option>All Risk Levels</option>
              <option>Low Risk</option>
              <option>Medium Risk</option>
              <option>High Risk</option>
            </select>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option>All Categories</option>
              <option>Rent</option>
              <option>Termination</option>
              <option>Indemnity</option>
              <option>Common Area Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex h-full relative overflow-hidden">
        {/* Left Sidebar - Clause List */}
        <div className={`${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:static inset-y-0 left-0 z-30 w-72 sm:w-80 bg-white border-r border-gray-200 overflow-y-auto`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4 md:block">
              <h2 className="text-lg font-semibold text-gray-900">Lease Clauses</h2>
              <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setLeftSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {clauses.map((clause) => (
                <div
                  key={clause.id}
                  onClick={() => {
                    setSelectedClause(clause.name);
                    setLeftSidebarOpen(false);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedClause === clause.name 
                      ? 'bg-blue-50 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getStatusIcon(clause.status)}
                      <span className="ml-2 font-medium text-gray-900 text-sm">{clause.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(clause.risk)}`}>
                      {clause.risk === 'low' && 'LOW (2/10)'}
                      {clause.risk === 'medium' && 'MEDIUM (5/10)'}
                      {clause.risk === 'high' && 'HIGH (8/10)'}
                    </span>
                    <span className="text-gray-500 text-xs">{clause.category}</span>
                  </div>
                  <div className="mt-2 text-xs text-green-600">
                    {clause.status === 'compliant' && 'Terms Compliant'}
                    {clause.status === 'needs-review' && 'Needs Review'}
                    {clause.status === 'high-risk' && 'High Risk'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile overlay */}
        {leftSidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setLeftSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <div className="flex-1 flex min-w-0 overflow-hidden">
          {/* Center - Clause Details */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto min-w-0">
            <div className="max-w-none lg:max-w-4xl mx-auto">
              {/* Clause Header */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-3" />
                    <span className="min-w-0 truncate">{selectedClause}</span>
                  </h3>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs sm:text-sm font-medium rounded-full">
                      Risk Score: {currentClause.riskScore}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium rounded-full">
                      Terms Compliant
                    </span>
                  </div>
                </div>
              </div>

              {/* Original and Suggested Clauses */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div>
                  <h4 className="flex items-center text-base sm:text-lg font-semibold text-gray-900 mb-3">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500" />
                    Original Clause
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{currentClause.original}</p>
                  </div>
                </div>
                <div>
                  <h4 className="flex items-center text-base sm:text-lg font-semibold text-gray-900 mb-3">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                    AI Suggested Clause
                  </h4>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{currentClause.suggested}</p>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h4 className="flex items-center text-base sm:text-lg font-semibold text-gray-900 mb-3">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-600" />
                  AI Analysis & Recommendations
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <span className="font-medium text-yellow-800 text-sm sm:text-base">{currentClause.analysis.type}:</span>
                      <span className="text-yellow-700 ml-2 text-sm sm:text-base">{currentClause.analysis.message}</span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <span className="font-medium text-yellow-800 text-sm sm:text-base">Key Changes:</span>
                      <span className="text-yellow-700 ml-2 text-sm sm:text-base">{currentClause.analysis.keyChanges}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base">
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </button>
                <button className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base">
                  <Check className="w-4 h-4 mr-2" />
                  Accept Suggestion
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - AI Assistant */}
          <div className={`${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:static inset-y-0 right-0 z-30 w-72 sm:w-80 bg-white border-l border-gray-200 overflow-y-auto`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4 md:block">
                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                  <Bot className="w-5 h-5 mr-2 text-blue-600" />
                  AI Legal Assistant
                </h3>
                <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setRightSidebarOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-blue-800">
                  I am analyzing your lease clauses and providing personalized recommendations based on commercial lease best practices.
                </p>
              </div>

              {/* General Recommendations */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">General Recommendations</h4>
                <div className="space-y-3">
                  <div className="flex items-start p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-red-800">Review All High-Risk Clauses</p>
                      <p className="text-xs text-red-600 mt-1">
                        Several clauses have a high risk flag, as these require immediate attention.
                      </p>
                    </div>
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded ml-2 flex-shrink-0">HIGH</span>
                  </div>
                  
                  <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
                    <Scale className="w-4 h-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-yellow-800">Check Jurisdiction Compliance</p>
                      <p className="text-xs text-yellow-600 mt-1">
                        Ensure all clauses comply with local and state regulations.
                      </p>
                    </div>
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded ml-2 flex-shrink-0">MEDIUM</span>
                  </div>
                  
                  <div className="flex items-start p-3 bg-green-50 rounded-lg">
                    <FileCheck className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-green-800">Document Your Changes</p>
                      <p className="text-xs text-green-600 mt-1">
                        Keep track of all modifications for future reference and negotiations.
                      </p>
                    </div>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded ml-2 flex-shrink-0">LOW</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg">
                    <MessageSquare className="w-4 h-4 mr-3 text-gray-500" />
                    <span className="text-sm text-gray-700">Ask AI a Question</span>
                  </button>
                  <button className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg">
                    <FileText className="w-4 h-4 mr-3 text-gray-500" />
                    <span className="text-sm text-gray-700">Generate Summary</span>
                  </button>
                  <button className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg">
                    <ExternalLink className="w-4 h-4 mr-3 text-gray-500" />
                    <span className="text-sm text-gray-700">Legal Resources</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile overlay for right sidebar */}
        {rightSidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setRightSidebarOpen(false)} />
        )}
      </div>
    </div>
    </DashboardLayout>
  );
}

export default LeaseClauseReview;