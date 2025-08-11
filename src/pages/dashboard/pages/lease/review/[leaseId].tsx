import React, { useEffect, useState } from 'react';
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
import { getClauseDetailsAsync } from '@/services/lease/asyncThunk';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { useParams, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layouts';


const LeaseClauseReview: React.FC = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [selectedClause, setSelectedClause] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All Risk Levels');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  
  const { currentLease, leaseError, isLoading } = useAppSelector((state) => state.lease);
  const dispatch = useAppDispatch();
  const params = useParams();
  const searchParams = useSearchParams();
  const leaseId = params?.leaseId as string;
  const clauseDocId = searchParams?.get('clauseDocId');

  useEffect(() => {
    if (leaseId && clauseDocId) {
      dispatch(getClauseDetailsAsync({ leaseId, clauseDocId }));
    }
  }, [dispatch, leaseId, clauseDocId]);

  useEffect(() => {
    if (currentLease?.data?.history && !selectedClause) {
      const firstClause = Object.keys(currentLease.data.history)[0];
      setSelectedClause(firstClause);
    }
  }, [currentLease, selectedClause]);

  // Helper functions
  const getRiskLevel = (risk: string) => {
    const match = risk.match(/\((\d+)\/10\)/);
    return match ? parseInt(match[1]) : 0;
  };

  const getRiskColor = (risk: string) => {
    const level = getRiskLevel(risk);
    if (level >= 7) return 'red';
    if (level >= 4) return 'yellow';
    return 'green';
  };

  const getRiskIcon = (risk: string) => {
    const level = getRiskLevel(risk);
    if (level >= 7) return AlertCircle;
    if (level >= 4) return AlertTriangle;
    return CheckCircle;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'blue';
    }
  };

  const groupClausesByCategory = () => {
    if (!currentLease?.data?.history) return {};
    
    const categories: { [key: string]: string[] } = {
      'Basic Information': [],
      'Financial Terms': [],
      'Legal & Compliance': [],
      'Property Details': [],
      'Terms & Conditions': []
    };

    Object.keys(currentLease.data.history).forEach(clauseName => {
      if (clauseName.toLowerCase().includes('rent') || clauseName.toLowerCase().includes('deposit')) {
        categories['Financial Terms'].push(clauseName);
      } else if (clauseName.toLowerCase().includes('legal') || clauseName.toLowerCase().includes('compliance')) {
        categories['Legal & Compliance'].push(clauseName);
      } else if (clauseName.toLowerCase().includes('address') || clauseName.toLowerCase().includes('property')) {
        categories['Property Details'].push(clauseName);
      } else if (clauseName.toLowerCase().includes('duration') || clauseName.toLowerCase().includes('start') || clauseName.toLowerCase().includes('end') || clauseName.toLowerCase().includes('type')) {
        categories['Basic Information'].push(clauseName);
      } else {
        categories['Terms & Conditions'].push(clauseName);
      }
    });

    return categories;
  };

  const filterClauses = (clauses: string[]) => {
    return clauses.filter(clauseName => {
      const clause = currentLease.data.history[clauseName];
      const matchesSearch = clauseName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'All Risk Levels' || 
        (riskFilter === 'Low Risk' && getRiskLevel(clause.risk) < 4) ||
        (riskFilter === 'Medium Risk' && getRiskLevel(clause.risk) >= 4 && getRiskLevel(clause.risk) < 7) ||
        (riskFilter === 'High Risk' && getRiskLevel(clause.risk) >= 7);
      
      return matchesSearch && matchesRisk;
    });
  };

  const selectedClauseData = selectedClause ? currentLease?.data?.history[selectedClause] : null;

  const handleAccept = (clauseName: string) => {
    console.log('Accepting clause:', clauseName);
    // Implement accept logic
  };

  const handleReject = (clauseName: string) => {
    console.log('Rejecting clause:', clauseName);
    // Implement reject logic
  };

  const handleEdit = (clauseName: string) => {
    console.log('Editing clause:', clauseName);
    // Implement edit logic
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading clause details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {leftSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setLeftSidebarOpen(false)} />
          <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
            <div className="flex items-center">
              <button onClick={() => setLeftSidebarOpen(false)} className="p-2 rounded-md hover:bg-gray-200">
                <X className="w-6 h-6" />
              </button>
            </div>
            {/* Mobile clause list would go here */}
          </nav>
        </div>
      )}

      {/* Topbar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setLeftSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <button className="hidden sm:flex items-center text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Back to Upload</span>
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Lease Clause Review</h1>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <FileText className="w-3 h-3" />
                <span>{currentLease?.data?.clause_name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden md:flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
              <FileText className="w-4 h-4 mr-2" /> Export Summary
            </button>
            <button className="hidden sm:flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </button>
            <button className="flex items-center px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md">
              <Bot className="w-4 h-4 mr-2" /> <span className="hidden sm:inline">AI Assistant</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="pb-4 flex flex-col sm:flex-row gap-3 max-w-7xl mx-auto">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              placeholder="Search clauses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2 flex-1">
            <select 
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>All Risk Levels</option>
              <option>Low Risk</option>
              <option>Medium Risk</option>
              <option>High Risk</option>
            </select>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>All Categories</option>
              <option>Basic Information</option>
              <option>Financial Terms</option>
              <option>Legal & Compliance</option>
              <option>Property Details</option>
              <option>Terms & Conditions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="hidden lg:grid grid-cols-12 gap-6 max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {/* Clause List */}
        <aside className="col-span-3 border-r pr-4 space-y-6">
          <div className="space-y-4">
            {Object.entries(groupClausesByCategory()).map(([category, clauses]) => {
              const filteredClauses = filterClauses(clauses);
              if (filteredClauses.length === 0) return null;
              
              return (
                <div key={category}>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">{category}</h3>
                  <div className="space-y-2">
                    {filteredClauses.map((clauseName) => {
                      const clause = currentLease.data.history[clauseName];
                      const riskColor = getRiskColor(clause.risk);
                      const RiskIcon = getRiskIcon(clause.risk);
                      const isSelected = selectedClause === clauseName;
                      
                      return (
                        <button
                          key={clauseName}
                          onClick={() => setSelectedClause(clauseName)}
                          className={`w-full text-left p-3 rounded-lg text-sm font-medium transition-all ${
                            isSelected
                              ? `bg-${riskColor}-50 border border-${riskColor}-500`
                              : `bg-white border border-gray-200 hover:bg-gray-50`
                          }`}
                        >
                          <div className={`flex items-center gap-2 ${
                            riskColor === 'red' ? 'text-red-800' :
                            riskColor === 'yellow' ? 'text-yellow-800' :
                            'text-green-800'
                          }`}>
                            <RiskIcon className={`w-4 h-4 ${
                              riskColor === 'red' ? 'text-red-500' :
                              riskColor === 'yellow' ? 'text-yellow-500' :
                              'text-green-500'
                            }`} />
                            <span className="truncate">{clauseName}</span>
                          </div>
                          <div className={`mt-1 text-xs ${
                            riskColor === 'red' ? 'text-red-700' :
                            riskColor === 'yellow' ? 'text-yellow-700' :
                            'text-green-700'
                          }`}>
                            {clause.risk} - {clause.status}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Clause Detail */}
        <main className="col-span-6 space-y-6">
          {selectedClauseData && (
            <>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  {React.createElement(getRiskIcon(selectedClauseData.risk), {
                    className: `w-5 h-5 ${
                      getRiskColor(selectedClauseData.risk) === 'red' ? 'text-red-500' :
                      getRiskColor(selectedClauseData.risk) === 'yellow' ? 'text-yellow-500' :
                      'text-green-500'
                    }`
                  })}
                  {selectedClause}
                </h2>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                    getRiskColor(selectedClauseData.risk) === 'red' 
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : getRiskColor(selectedClauseData.risk) === 'yellow'
                      ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      : 'bg-green-50 text-green-700 border-green-200'
                  }`}>
                    Risk Score: {selectedClauseData.risk}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    getStatusColor(selectedClauseData.status) === 'green' ? 'bg-green-100 text-green-800' :
                    getStatusColor(selectedClauseData.status) === 'red' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedClauseData.status.charAt(0).toUpperCase() + selectedClauseData.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                    <FileText className="w-4 h-4 mr-2" /> Current Version
                  </h4>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {selectedClauseData.current_version}
                  </p>
                </div>
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h4 className="text-sm font-semibold text-blue-800 flex items-center mb-3">
                    <Bot className="w-4 h-4 mr-2" /> AI Suggestion
                  </h4>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {selectedClauseData.ai_suggested_clause_details}
                  </p>
                </div>
              </div>

              <div className={`border rounded-lg p-4 space-y-3 ${
                getRiskColor(selectedClauseData.risk) === 'red' 
                  ? 'bg-red-50 border-red-200'
                  : getRiskColor(selectedClauseData.risk) === 'yellow'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-green-50 border-green-200'
              }`}>
                <h4 className={`text-sm font-semibold flex items-center ${
                  getRiskColor(selectedClauseData.risk) === 'red' ? 'text-red-800' :
                  getRiskColor(selectedClauseData.risk) === 'yellow' ? 'text-yellow-800' :
                  'text-green-800'
                }`}>
                  <AlertTriangle className="w-4 h-4 mr-2" /> AI Analysis & Recommendations
                </h4>
                <p className={`text-sm leading-relaxed ${
                  getRiskColor(selectedClauseData.risk) === 'red' ? 'text-red-800' :
                  getRiskColor(selectedClauseData.risk) === 'yellow' ? 'text-yellow-800' :
                  'text-green-800'
                }`}>
                  <strong>Risk Level:</strong> {selectedClauseData.risk} - {selectedClauseData.clause_details}
                </p>
                <p className={`text-sm leading-relaxed ${
                  getRiskColor(selectedClauseData.risk) === 'red' ? 'text-red-800' :
                  getRiskColor(selectedClauseData.risk) === 'yellow' ? 'text-yellow-800' :
                  'text-green-800'
                }`}>
                  <strong>Recommendation:</strong> {selectedClauseData.ai_suggested_clause_details}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => handleReject(selectedClause)}
                  className="flex items-center px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 text-sm transition-colors"
                >
                  <X className="w-4 h-4 mr-2" /> Reject
                </button>
                <button 
                  onClick={() => handleEdit(selectedClause)}
                  className="flex items-center px-4 py-2 border border-yellow-500 text-yellow-700 bg-yellow-50 rounded-md hover:bg-yellow-100 text-sm transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" /> Edit
                </button>
                <button 
                  onClick={() => handleAccept(selectedClause)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm transition-colors"
                >
                  <Check className="w-4 h-4 mr-2" /> Accept Suggestion
                </button>
              </div>
            </>
          )}
        </main>

        {/* Assistant Sidebar */}
        <aside className="col-span-3 border-l pl-4 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 flex items-center mb-3">
              <Bot className="w-4 h-4 mr-2 text-blue-600" /> AI Legal Assistant
            </h3>
            <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs p-3 rounded-lg">
              I'm analyzing your lease clauses and providing personalized recommendations based on commercial lease best practices.
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-xs">
              <AlertTriangle className="w-4 h-4 text-red-500 mr-2 inline-block" />
              <span className="font-medium text-red-800">
                {Object.values(currentLease?.data?.history || {}).filter(clause => getRiskLevel(clause.risk) >= 7).length} High-Risk Clauses
              </span>
              <p className="text-red-600 mt-1">These require immediate attention.</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-xs">
              <Scale className="w-4 h-4 text-yellow-500 mr-2 inline-block" />
              <span className="font-medium text-yellow-800">Check Jurisdiction Compliance</span>
              <p className="text-yellow-600 mt-1">Ensure local compliance requirements are met.</p>
            </div>
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-xs">
              <FileCheck className="w-4 h-4 text-green-500 mr-2 inline-block" />
              <span className="font-medium text-green-800">
                {Object.values(currentLease?.data?.history || {}).filter(clause => getRiskLevel(clause.risk) < 4).length} Low-Risk Clauses
              </span>
              <p className="text-green-600 mt-1">These appear to be in good order.</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full flex items-center p-2 text-left text-sm hover:bg-gray-50 rounded-lg transition-colors">
                <MessageSquare className="w-4 h-4 mr-2 text-gray-500" /> Ask AI a Question
              </button>
              <button className="w-full flex items-center p-2 text-left text-sm hover:bg-gray-50 rounded-lg transition-colors">
                <FileText className="w-4 h-4 mr-2 text-gray-500" /> Generate Summary
              </button>
              <button className="w-full flex items-center p-2 text-left text-sm hover:bg-gray-50 rounded-lg transition-colors">
                <ExternalLink className="w-4 h-4 mr-2 text-gray-500" /> Legal Resources
              </button>
            </div>
          </div>

          {/* Clause Statistics */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Review Progress</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Total Clauses:</span>
                <span className="font-medium">{Object.keys(currentLease?.data?.history || {}).length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Pending Review:</span>
                <span className="font-medium text-orange-600">
                  {Object.values(currentLease?.data?.history || {}).filter(clause => clause.status === 'pending').length}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">High Risk:</span>
                <span className="font-medium text-red-600">
                  {Object.values(currentLease?.data?.history || {}).filter(clause => getRiskLevel(clause.risk) >= 7).length}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default LeaseClauseReview;