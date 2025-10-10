import React, { useState } from 'react';
import { ChevronLeft, MessageSquare, Search, Download, AlertCircle, CheckCircle2, Clock, XCircle, FileText, ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';

const SAMPLE_LOIS = [
  {
    id: '1',
    title: 'Downtown Office Space LOI',
    company: 'TechCorp Solutions',
    address: '123 Main St, Suite 400',
    rent: '$8,500/mo',
    date: '15/01/2024',
    status: 'In Review',
    tenantName: 'TechCorp Solutions',
    approved: 0,
    pending: 12
  },
  {
    id: '2',
    title: 'Retail Space Proposal',
    company: 'Urban Boutique LLC',
    address: '456 Commerce Ave',
    rent: '$4,200/mo',
    date: '12/01/2024',
    status: 'In Review',
    tenantName: 'Urban Boutique LLC',
    approved: 3,
    pending: 5
  },
  {
    id: '3',
    title: 'Warehouse Lease Intent',
    company: 'LogiFlow Industries',
    address: '789 Industrial Blvd',
    rent: '$12,000/mo',
    date: '10/01/2024',
    status: 'Finalized',
    tenantName: 'LogiFlow Industries',
    approved: 15,
    pending: 0
  },
  {
    id: '4',
    title: 'Medical Office LOI',
    company: 'MedCare Associates',
    address: '321 Health Plaza',
    rent: '$6,800/mo',
    date: '08/01/2024',
    status: 'Rejected',
    tenantName: 'MedCare Associates',
    approved: 2,
    pending: 0
  },
  {
    id: '5',
    title: 'Downtown Office Space LOI',
    company: 'TechCorp Solutions',
    address: '123 Main St, Suite 400',
    rent: '$8,500/mo',
    date: '15/01/2024',
    status: 'New',
    tenantName: 'TechCorp Solutions',
    approved: 0,
    pending: 12
  },
  {
    id: '6',
    title: 'Retail Space Proposal',
    company: 'Urban Boutique LLC',
    address: '456 Commerce Ave',
    rent: '$4,200/mo',
    date: '12/01/2024',
    status: 'In Review',
    tenantName: 'Urban Boutique LLC',
    approved: 3,
    pending: 5
  }
];

const SAMPLE_CLAUSES = [
  {
    id: '1',
    title: 'Base Rent',
    status: 'approved',
    risk: 'Low Risk',
    comments: 2,
    text: 'Tenant agrees to pay base rent of $8,500 per month, payable in advance on the first day of each month during the lease term.'
  },
  {
    id: '2',
    title: 'Security Deposit',
    status: 'pending',
    risk: 'Medium Risk',
    comments: 1,
    text: 'Tenant shall provide a security deposit equal to two months rent upon execution of the lease.'
  },
  {
    id: '3',
    title: 'Maintenance Responsibilities',
    status: 'need-review',
    risk: 'High Risk',
    comments: 1,
    warning: 'Jurisdiction Issue',
    text: 'Landlord shall be responsible for all structural repairs and maintenance of common areas.'
  },
  {
    id: '4',
    title: 'Assignment and Subletting',
    status: 'pending',
    risk: 'Low Risk',
    comments: 0,
    text: 'Tenant may not assign or sublet without prior written consent of Landlord.'
  }
];

export default function ModernLOIReview() {
  const [selectedLOI, setSelectedLOI] = useState(null);
  const [selectedClause, setSelectedClause] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [tenantFilter, setTenantFilter] = useState('All Tenants');

  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-50 text-blue-700',
      'In Review': 'bg-amber-50 text-amber-700',
      'Finalized': 'bg-emerald-50 text-emerald-700',
      'Rejected': 'bg-rose-50 text-rose-700'
    };
    return colors[status] || 'bg-gray-50 text-gray-700';
  };

  const getClauseStatusIcon = (status) => {
    if (status === 'approved') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (status === 'pending') return <Clock className="w-4 h-4 text-amber-500" />;
    if (status === 'need-review') return <XCircle className="w-4 h-4 text-rose-500" />;
    return null;
  };

  const getRiskBadge = (risk) => {
    const styles = {
      'Low Risk': 'bg-emerald-50 text-emerald-700',
      'Medium Risk': 'bg-amber-50 text-amber-700',
      'High Risk': 'bg-rose-50 text-rose-700'
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded font-medium ${styles[risk]}`}>
        {risk}
      </span>
    );
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50">
      {!selectedLOI ? (
        /* LOI List View - Full Width */
        <>
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="px-6 py-3.5">
              <div className="flex items-center gap-2 text-sm">
                <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </button>
                <span className="text-gray-300">|</span>
                <span className="font-semibold text-gray-800">Review LOIs</span>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h2 className="text-sm font-semibold text-gray-900">LOIs</h2>
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                      {SAMPLE_LOIS.length}
                    </span>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Upload LOI
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Search and Filters */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search LOIs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>All Status</option>
                    <option>New</option>
                    <option>In Review</option>
                    <option>Finalized</option>
                    <option>Rejected</option>
                  </select>
                  
                  <select 
                    value={tenantFilter}
                    onChange={(e) => setTenantFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>All Tenants</option>
                    <option>TechCorp Solutions</option>
                    <option>Urban Boutique LLC</option>
                    <option>LogiFlow Industries</option>
                  </select>
                </div>
              </div>

              {/* LOI Cards Grid - 2 Columns */}
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4">
                  {SAMPLE_LOIS.map((loi) => (
                    <button
                      key={loi.id}
                      onClick={() => {
                        setSelectedLOI(loi);
                        setSelectedClause(SAMPLE_CLAUSES[0]);
                      }}
                      className="text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-gray-900 mb-0.5">{loi.title}</h3>
                          <p className="text-xs text-gray-600">{loi.company}</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-md font-medium whitespace-nowrap ml-2 ${getStatusColor(loi.status)}`}>
                          {loi.status}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-2.5">{loi.address}</p>
                      
                      <div className="flex items-center justify-between text-xs mb-2.5">
                        <span className="font-semibold text-blue-600">{loi.rent}</span>
                        <span className="text-gray-500">{loi.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-blue-600"><span className="font-semibold">{loi.approved}</span> approved</span>
                        <span className="text-amber-600"><span className="font-semibold">{loi.pending}</span> pending</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Single LOI Detail View - Full Width */
        <>
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-base font-semibold text-gray-900 mb-1">Review LOIs</h1>
                  <p className="text-sm text-gray-600">Reviewing: {selectedLOI.title}</p>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Tenant:</span>
                    <span className="font-medium text-gray-900">{selectedLOI.company}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Property:</span>
                    <span className="font-medium text-gray-900">{selectedLOI.address}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Rent:</span>
                    <span className="font-medium text-gray-900">{selectedLOI.rent}</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${getStatusColor(selectedLOI.status)}`}>
                    {selectedLOI.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 pb-3 flex items-center gap-2">
              <button 
                onClick={() => setSelectedLOI(null)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Dashboard
              </button>

              <div className="flex-1"></div>

              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-rose-600 bg-white rounded-md border border-gray-300 hover:bg-rose-50">
                <XCircle className="w-4 h-4" />
                Send Back
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-white rounded-md border border-gray-300 hover:bg-blue-50">
                <CheckCircle2 className="w-4 h-4" />
                Approve All
              </button>
              <button className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                <FileText className="w-4 h-4" />
                Finalize LOI
              </button>
            </div>
          </div>

          {/* Clauses Section */}
          <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-900">Clauses</h2>
                  <div className="text-xs text-gray-600">
                    1 approved, 2 pending, 1 need review
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {SAMPLE_CLAUSES.map((clause) => (
                    <button
                      key={clause.id}
                      onClick={() => setSelectedClause(clause)}
                      className={`text-left p-4 rounded-lg transition-all ${
                        selectedClause?.id === clause.id
                          ? 'bg-blue-50 border-2 border-blue-400'
                          : 'bg-gray-50 border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-sm text-gray-900 flex-1 pr-2">{clause.title}</h3>
                        {getClauseStatusIcon(clause.status)}
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        {getRiskBadge(clause.risk)}
                        {clause.warning && (
                          <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-orange-50 text-orange-700 rounded font-medium">
                            <AlertCircle className="w-3 h-3" />
                            {clause.warning}
                          </span>
                        )}
                      </div>
                      
                      {clause.comments > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{clause.comments}</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clause Detail */}
              {selectedClause && (
                <div className="border-t border-gray-200 pt-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-gray-900">{selectedClause.title}</h3>
                      {getRiskBadge(selectedClause.risk)}
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1.5 text-sm px-3 py-1.5 text-blue-600 bg-white rounded border border-gray-300 hover:bg-blue-50 font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        Low Risk
                      </button>
                      <button className="flex items-center gap-1.5 text-sm px-3 py-1.5 text-blue-600 bg-white rounded border border-gray-300 hover:bg-blue-50 font-medium">
                        <ThumbsUp className="w-4 h-4" />
                        Compliant
                      </button>
                      <button className="flex items-center gap-1.5 text-sm px-3 py-1.5 text-rose-600 bg-white rounded border border-gray-300 hover:bg-rose-50 font-medium">
                        <ThumbsDown className="w-4 h-4" />
                        Reject
                      </button>
                      <button className="flex items-center gap-1.5 text-sm px-3 py-1.5 text-emerald-600 bg-white rounded border border-gray-300 hover:bg-emerald-50 font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </button>
                      <button className="flex items-center gap-1.5 text-sm px-3 py-1.5 text-gray-700 bg-white rounded border border-gray-300 hover:bg-gray-50 font-medium">
                        <MessageSquare className="w-4 h-4" />
                        Comment
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Clause Text</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedClause.text}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-semibold">AI</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-blue-900 mb-1">AI Analysis</h4>
                        <p className="text-sm text-blue-800 leading-relaxed">
                          Standard rent clause with acceptable terms.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
    </DashboardLayout>
  );
}