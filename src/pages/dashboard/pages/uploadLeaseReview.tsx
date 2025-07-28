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
  Check,
  MessageSquare,
  FileCheck,
  Scale,
  Bot,
  ExternalLink,
  Menu,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';


// Type definitions
interface Clause {
  id: string;
  name: string;
  status: 'compliant' | 'needs-review' | 'high-risk';
  risk: 'low' | 'medium' | 'high';
  category: string;
  hasChanges: boolean;
}

interface ClauseAnalysis {
  type: string;
  message: string;
  keyChanges: string;
}

interface ClauseDetail {
  original: string;
  suggested: string;
  risk: 'low' | 'medium' | 'high';
  riskScore: string;
  status: 'compliant' | 'needs-review' | 'high-risk';
  analysis: ClauseAnalysis;
}

type ClauseDetailsMap = {
  [key: string]: ClauseDetail;
};

type RiskLevel = 'low' | 'medium' | 'high';
type Status = 'compliant' | 'needs-review' | 'high-risk';

const LeaseClauseReview: React.FC = () => {
  const [selectedClause, setSelectedClause] = useState<string>('Base Rent Amount');
  const [riskLevel, setRiskLevel] = useState<string>('All Risk Levels');
  const [category, setCategory] = useState<string>('All Categories');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(false);

  const clauses: Clause[] = [
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

  const clauseDetails: ClauseDetailsMap = {
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
    },
    'CAM Charges': {
      original: "Tenant agrees to pay their proportionate share of Common Area Maintenance charges as determined by Landlord.",
      suggested: "Tenant agrees to pay their proportionate share of Common Area Maintenance charges, not to exceed 15% annual increase, with detailed itemized statements provided quarterly and audit rights reserved.",
      risk: 'medium',
      riskScore: '5/10',
      status: 'needs-review',
      analysis: {
        type: 'Medium Risk',
        message: 'CAM charges lack proper caps and transparency requirements.',
        keyChanges: 'Added percentage caps, audit rights, and reporting requirements for better cost control.'
      }
    },
    'Early Termination Rights': {
      original: "Landlord may terminate this lease at any time with 30 days written notice for any reason.",
      suggested: "Either party may terminate this lease with 90 days written notice, subject to specific conditions and proper cause requirements as defined in Section 12.",
      risk: 'high',
      riskScore: '8/10',
      status: 'high-risk',
      analysis: {
        type: 'High Risk',
        message: 'Current termination clause heavily favors landlord with broad termination rights.',
        keyChanges: 'Balanced termination rights, extended notice period, and added cause requirements for protection.'
      }
    },
    'Tenant Indemnification': {
      original: "Tenant shall indemnify and hold harmless Landlord from all claims, damages, and expenses arising from Tenant's use of the premises.",
      suggested: "Tenant shall indemnify and hold harmless Landlord from claims, damages, and expenses arising from Tenant's negligent acts or willful misconduct, excluding Landlord's own negligence or violations.",
      risk: 'medium',
      riskScore: '5/10',
      status: 'compliant',
      analysis: {
        type: 'Medium Risk',
        message: 'Indemnification clause is overly broad and one-sided.',
        keyChanges: 'Limited indemnification to negligent acts and excluded landlord negligence for balanced protection.'
      }
    }
  };

  const currentClause: ClauseDetail = clauseDetails[selectedClause] || clauseDetails['Base Rent Amount'];

  const getRiskColor = (risk: RiskLevel): string => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />;
      case 'needs-review': return <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
      case 'high-risk': return <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-500 flex-shrink-0" />;
    }
  };

  const handleClauseSelect = (clauseName: string): void => {
    setSelectedClause(clauseName);
    setLeftSidebarOpen(false);
  };

  const getRiskDisplayText = (risk: RiskLevel): string => {
    switch (risk) {
      case 'low': return 'LOW (2/10)';
      case 'medium': return 'MEDIUM (5/10)';
      case 'high': return 'HIGH (8/10)';
      default: return 'UNKNOWN';
    }
  };

  const getStatusDisplayText = (status: Status): string => {
    switch (status) {
      case 'compliant': return 'Terms Compliant';
      case 'needs-review': return 'Needs Review';
      case 'high-risk': return 'High Risk';
      default: return 'Unknown Status';
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-shrink-0 bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="w-full bg-white border-b border-gray-200">
              <div className="px-4 py-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {/* Hamburger Menu Button - Only on mobile */}
                  <button
                    className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setLeftSidebarOpen(true)}
                    type="button"
                    aria-label="Toggle clause list"
                  >
                    <Menu className="w-5 h-5 text-gray-600" />
                  </button>

                  {/* Back Button - Hidden on mobile, visible on tablet+ */}
                  <button className="hidden sm:flex items-center text-gray-600 hover:text-gray-800 transition-colors group">
                    <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2 group-hover:translate-x-[-2px] transition-transform" />
                    <span className="text-sm lg:text-base font-medium">Back</span>
                  </button>

                  {/* Title and Subtitle Container */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate leading-tight">
                      Lease Clause Review
                    </h1>
                    <div className="hidden sm:flex items-center text-xs lg:text-sm text-gray-500 mt-0.5">
                      <FileText className="w-3 h-3 lg:w-4 lg:h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">Downtown Office Lease Agreement.pdf</span>
                    </div>
                  </div>
                </div>

                {/* Mobile subtitle - shown only on small screens */}
                <div className="sm:hidden mt-2 flex items-center text-xs text-gray-500">
                  <FileText className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">Downtown Office Lease Agreement.pdf</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <button className="hidden md:flex items-center px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FileText className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="hidden sm:flex items-center px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Download</span>
              </button>
              <button className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Bot className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">AI</span>
              </button>
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setRightSidebarOpen(true)}
                type="button"
                aria-label="Toggle AI assistant"
              >
                <Bot className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-4 lg:px-6 py-3 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clauses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All Risk Levels">All Risk Levels</option>
                <option value="Low Risk">Low Risk</option>
                <option value="Medium Risk">Medium Risk</option>
                <option value="High Risk">High Risk</option>
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All Categories">All Categories</option>
                <option value="Rent">Rent</option>
                <option value="Termination">Termination</option>
                <option value="Indemnity">Indemnity</option>
                <option value="Common Area Maintenance">CAM</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Clause List */}
        <div
          className={`${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:static inset-y-0 left-0 z-30 w-60 bg-white border-r border-gray-200 flex-shrink-0`}
        >
          <div className="h-full overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Lease Clauses</h2>
                <button
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setLeftSidebarOpen(false)}
                  type="button"
                  aria-label="Close clause list"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Group by Category */}
              {['Rent', 'Common Area Maintenance', 'Termination', 'Indemnity'].map((category) => {
                const categoryClauses = clauses.filter((c) => c.category === category);
                if (categoryClauses.length === 0) return null;

                return (
                  <div key={category} className="mb-5">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
                      {category}
                    </h3>

                    <div className="space-y-3">
                      {categoryClauses.map((clause) => (
                        <div
                          key={clause.id}
                          onClick={() => handleClauseSelect(clause.name)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedClause === clause.name
                            ? 'bg-blue-50 border-blue-500 shadow-sm'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                          tabIndex={0}
                          role="button"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') handleClauseSelect(clause.name);
                          }}
                        >
                          {/* Title and Icon */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(clause.status)}
                              <p className="font-medium text-sm text-gray-900 truncate max-w-[120px]">
                                {clause.name}
                              </p>
                            </div>
                          </div>

                          {/* Risk Score */}
                          <div className="mt-2">
                            <span
                              className={`inline-block px-2 py-1 text-[10px] font-medium rounded-full border ${getRiskColor(
                                clause.risk as RiskLevel
                              )}`}
                            >
                              {getRiskDisplayText(clause.risk)}
                            </span>
                          </div>

                          {/* Status badge */}
                          <div className="mt-2">
                            <span
                              className={`inline-block px-2 py-1 text-[10px] font-medium rounded-full ${clause.status === 'compliant'
                                ? 'bg-green-100 text-green-700'
                                : clause.status === 'needs-review'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                                }`}
                            >
                              {getStatusDisplayText(clause.status)}
                            </span>
                          </div>

                          {/* Optional: Comment count */}
                          {clause.hasChanges && (
                            <div className="mt-1 text-[10px] text-gray-500">1 comment</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile overlay for left sidebar */}
        {leftSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 backdrop-blur-sm bg-opacity-50 z-20"
            onClick={() => setLeftSidebarOpen(false)}
          />
        )}
              

        {/* Main Content */}
        <div className="flex-1 flex min-w-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="max-w-none space-y-8">

                {/* Clause Header */}
                <div className="space-y-2">
                  <h3 className="flex items-center text-xl sm:text-2xl font-semibold text-gray-900">
                    {getStatusIcon(currentClause.status)}
                    <span className="ml-2 truncate">{selectedClause}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRiskColor(currentClause.risk)}`}>
                      Risk Score: {currentClause.riskScore}
                    </span>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      {getStatusDisplayText(currentClause.status)}
                    </span>
                  </div>
                </div>

                {/* Clause Comparison Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Original Clause */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                      <AlertCircle className="w-4 h-4 mr-2 text-gray-500" />
                      Original Clause
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {currentClause.original}
                    </p>
                  </div>

                  {/* Suggested Clause */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="flex items-center text-sm font-semibold text-blue-800 mb-2">
                      <Bot className="w-4 h-4 mr-2 text-blue-600" />
                      AI Suggested Clause
                    </h4>
                    <p className="text-sm text-gray-800 whitespace-pre-line">
                      {currentClause.suggested}
                    </p>
                  </div>
                </div>

                {/* AI Analysis Section */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-4">
                  <h4 className="flex items-center text-sm font-semibold text-yellow-800">
                    <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                    AI Analysis & Recommendations
                  </h4>

                  <div className="flex items-start gap-2 text-sm">
                    <span className="w-2 h-2 mt-1 rounded-full bg-yellow-400 flex-shrink-0" />
                    <p className="text-yellow-800">
                      <strong>{currentClause.analysis.type}:</strong> {currentClause.analysis.message}
                    </p>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <span className="w-2 h-2 mt-1 rounded-full bg-yellow-400 flex-shrink-0" />
                    <p className="text-yellow-800">
                      <strong>Key Changes:</strong> {currentClause.analysis.keyChanges}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button className="flex items-center justify-center px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 text-sm font-medium transition">
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 border border-yellow-500 text-yellow-700 bg-yellow-50 rounded-md hover:bg-yellow-100 text-sm font-medium transition">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition">
                    <Check className="w-4 h-4 mr-2" />
                    Accept Suggestion
                  </button>
                </div>
              </div>
            </div>
          </div>


          <div
            className={`${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full'
              } lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:static inset-y-0 right-0 z-30 w-60 bg-white border-l border-gray-200 flex-shrink-0`}
          >
            <div className="h-full overflow-y-auto">
              <div className="p-4 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center text-sm font-semibold text-gray-900">
                    <Bot className="w-4 h-4 mr-2 text-blue-600" />
                    AI Legal Assistant
                  </h3>
                  <button
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setRightSidebarOpen(false)}
                    type="button"
                    aria-label="Close AI assistant"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Description Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                  I’m analyzing your lease clauses and providing personalized recommendations based on commercial lease best practices.
                </div>

                {/* General Recommendations */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">General Recommendations</h4>
                  <div className="space-y-3">
                    {/* HIGH */}
                    <div className="flex items-start p-3 bg-red-50 rounded-lg border border-red-200 text-xs">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-red-800">Review All High-Risk Clauses</p>
                        <p className="text-red-600 mt-1">Focus on clauses marked as high-risk first, as these require immediate attention.</p>
                      </div>
                      <span className="bg-red-200 text-red-800 px-2 py-0.5 rounded text-[10px] font-semibold ml-2">
                        high
                      </span>
                    </div>

                    {/* MEDIUM */}
                    <div className="flex items-start p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-xs">
                      <Scale className="w-4 h-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-yellow-800">Check Jurisdiction Compliance</p>
                        <p className="text-yellow-600 mt-1">Ensure all clauses comply with local and state regulations.</p>
                      </div>
                      <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-[10px] font-semibold ml-2">
                        medium
                      </span>
                    </div>

                    {/* LOW */}
                    <div className="flex items-start p-3 bg-green-50 rounded-lg border border-green-200 text-xs">
                      <FileCheck className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-green-800">Document Your Changes</p>
                        <p className="text-green-600 mt-1">Keep track of all modifications for future reference and negotiations.</p>
                      </div>
                      <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded text-[10px] font-semibold ml-2">
                        low
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full flex items-center p-2 text-left text-sm hover:bg-gray-50 rounded-lg">
                      <MessageSquare className="w-4 h-4 mr-2 text-gray-500" />
                      Ask AI a Question
                    </button>
                    <button className="w-full flex items-center p-2 text-left text-sm hover:bg-gray-50 rounded-lg">
                      <FileText className="w-4 h-4 mr-2 text-gray-500" />
                      Generate Summary
                    </button>
                    <button className="w-full flex items-center p-2 text-left text-sm hover:bg-gray-50 rounded-lg">
                      <ExternalLink className="w-4 h-4 mr-2 text-gray-500" />
                      Legal Resources
                    </button>
                  </div>
                </div>

                {/* Footer */}
                {/* <div className="pt-4 text-[10px] text-gray-400">
                  Powered by LegalAI · v1.0
                </div> */}
              </div>
            </div>
          </div>


          {/* Mobile overlay for right sidebar */}
          {rightSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
              onClick={() => setRightSidebarOpen(false)}
            />
          )}
        </div>
      </div>

    </DashboardLayout>
  );
};

export default LeaseClauseReview;
