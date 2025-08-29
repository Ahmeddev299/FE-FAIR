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
  Bot,
  Menu,
  Edit3,
  Save,
  CheckCircle2,
  LucideIcon,
} from 'lucide-react';
import { getClauseDetailsAsync } from '@/services/lease/asyncThunk';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layouts';
import { LoadingOverlay } from '@/components/loaders/overlayloader';

// Define types for the lease data structure
interface ClauseData {
  risk: string;
  status: string;
  current_version: string;
  ai_suggested_clause_details: string;
  clause_details: string;
}

const LeaseClauseReview: React.FC = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false);
  const [selectedClause, setSelectedClause] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('All Risk Levels');
  const [editingClause, setEditingClause] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);

  const { currentLease, isLoading } = useAppSelector((state) => state.lease);
  const dispatch = useAppDispatch();
  const router = useRouter();
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
      if (firstClause) {
        setSelectedClause(firstClause);
      }
    }
  }, [currentLease, selectedClause]);

  // Helper functions
  const getRiskLevel = (risk: string): number => {
    const match = risk.match(/\((\d+)\/10\)/);
    return match ? parseInt(match[1]) : 0;
  };

  const getRiskColor = (risk: string): 'red' | 'yellow' | 'green' => {
    const level = getRiskLevel(risk);
    if (level >= 7) return 'red';
    if (level >= 4) return 'yellow';
    return 'green';
  };

  const getRiskIcon = (risk: string): LucideIcon => {
    const level = getRiskLevel(risk);
    if (level >= 7) return AlertCircle;
    if (level >= 4) return AlertTriangle;
    return CheckCircle;
  };

  const groupClausesByCategory = (): { [key: string]: string[] } => {
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

  const filterClauses = (clauses: string[]): string[] => {
    if (!currentLease?.data?.history) return [];

    return clauses.filter(clauseName => {
      const clause = currentLease.data.history[clauseName];
      if (!clause) return false;

      const matchesSearch = clauseName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'All Risk Levels' ||
        (riskFilter === 'Low Risk' && getRiskLevel(clause.risk) < 4) ||
        (riskFilter === 'Medium Risk' && getRiskLevel(clause.risk) >= 4 && getRiskLevel(clause.risk) < 7) ||
        (riskFilter === 'High Risk' && getRiskLevel(clause.risk) >= 7);

      return matchesSearch && matchesRisk;
    });
  };

  const selectedClauseData = selectedClause && currentLease?.data?.history ?
    currentLease.data.history[selectedClause] : null;

  // Toast functionality
  const showToastMessage = (message: string): void => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleAccept = (clauseName: string): void => {
    console.log('Accepting clause:', clauseName);

    // Update the current version with AI suggestion
    if (currentLease?.data?.history?.[clauseName]) {
      const updatedHistory = { ...currentLease.data.history };
      updatedHistory[clauseName] = {
        ...updatedHistory[clauseName],
        current_version: updatedHistory[clauseName].ai_suggested_clause_details,
        status: 'approved'
      };

      // Here you would dispatch an action to update the lease data
      // dispatch(updateLeaseClause({ leaseId, clauseDocId, clauseName, updatedClause: updatedHistory[clauseName] }));

      showToastMessage('AI suggestion accepted successfully!');

      // Redirect to clause management after a short delay
      setTimeout(() => {
        router.push('/dashboard/pages/clauseManagement');
      }, 1500);
    }
  };

  const handleReject = (clauseName: string): void => {
    console.log('Rejecting clause:', clauseName);

    // Update status to rejected
    if (currentLease?.data?.history?.[clauseName]) {
      const updatedHistory = { ...currentLease.data.history };
      updatedHistory[clauseName] = {
        ...updatedHistory[clauseName],
        status: 'rejected'
      };

      // Here you would dispatch an action to update the lease data
      // dispatch(updateLeaseClause({ leaseId, clauseDocId, clauseName, updatedClause: updatedHistory[clauseName] }));
    }

    // Redirect back to previous page
    router.back();
  };

  const handleEdit = (clauseName: string): void => {
    console.log('Editing clause:', clauseName);
    const clause = currentLease?.data?.history?.[clauseName];
    if (clause) {
      setEditingClause(clauseName);
      setEditedContent(clause.current_version);
    }
  };

  const handleSaveEdit = (clauseName: string): void => {
    console.log('Saving edited clause:', clauseName);

    if (currentLease?.data?.history?.[clauseName]) {
      const updatedHistory = { ...currentLease.data.history };
      updatedHistory[clauseName] = {
        ...updatedHistory[clauseName],
        current_version: editedContent,
        status: 'pending' // Reset status to pending after edit
      };

      // Here you would dispatch an action to update the lease data
      // dispatch(updateLeaseClause({ leaseId, clauseDocId, clauseName, updatedClause: updatedHistory[clauseName] }));

      setEditingClause(null);
      setEditedContent('');
      console.log('Clause edited and saved');
    }
  };

  const handleCancelEdit = (): void => {
    setEditingClause(null);
    setEditedContent('');
  };

  const history = (currentLease?.data?.history ?? {}) as Record<string, ClauseData>;
  const historyValues = Object.values(history) as ClauseData[];

  // Export and AI Assistant functions
  const handleExportSummary = (): void => {
    console.log('Exporting summary...');
    showToastMessage('Summary exported successfully!');

    if (!currentLease?.data?.history) return;

    // Generate summary data
    const summaryData = {
      leaseId,
      clauseDocId,
      leaseName: currentLease?.data?.clause_name || 'Lease Document',
      exportDate: new Date().toLocaleDateString(),
      totalClauses: Object.keys(history).length,
      highRiskClauses: historyValues.filter((clause) => getRiskLevel(clause.risk) >= 7).length,
      mediumRiskClauses: historyValues.filter((clause) => {
        const level = getRiskLevel(clause.risk);
        return level >= 4 && level < 7;
      }).length,
      lowRiskClauses: historyValues.filter((clause) => getRiskLevel(clause.risk) < 4).length,
      approvedClauses: historyValues.filter((clause) => clause.status === 'approved').length,
      pendingClauses: historyValues.filter((clause) => clause.status === 'pending').length,
      rejectedClauses: historyValues.filter((clause) => clause.status === 'rejected').length,
    };

    // Create CSV content
    const csvContent = [
      'Lease Clause Review Summary',
      `Export Date: ${summaryData.exportDate}`,
      `Lease Name: ${summaryData.leaseName}`,
      `Lease ID: ${summaryData.leaseId}`,
      `Document ID: ${summaryData.clauseDocId}`,
      '',
      'SUMMARY STATISTICS',
      `Total Clauses: ${summaryData.totalClauses}`,
      `High Risk Clauses: ${summaryData.highRiskClauses}`,
      `Medium Risk Clauses: ${summaryData.mediumRiskClauses}`,
      `Low Risk Clauses: ${summaryData.lowRiskClauses}`,
      `Approved Clauses: ${summaryData.approvedClauses}`,
      `Pending Clauses: ${summaryData.pendingClauses}`,
      `Rejected Clauses: ${summaryData.rejectedClauses}`,
      '',
      'DETAILED CLAUSE BREAKDOWN',
      'Clause Name,Risk Level,Status,Current Version,AI Suggestion',
    ];

    (Object.entries(history) as [string, ClauseData][]).forEach(([clauseName, clause]) => {
      csvContent.push(
        `"${clauseName}","${clause.risk}","${clause.status}","${clause.current_version.replace(/"/g, '""')}","${clause.ai_suggested_clause_details.replace(/"/g, '""')}"`
      );
    });
    // Create and download CSV file
    const csvString = csvContent.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `lease-summary-${summaryData.leaseId}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = (): void => {
    console.log('Downloading PDF...');
    showToastMessage('PDF downloaded successfully!');

    if (!currentLease?.data?.history) return;

    // Generate HTML content for PDF
    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Lease Clause Review - ${currentLease.data.clause_name || 'Document'}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .summary { background: #f5f5f5; padding: 20px; margin-bottom: 30px; border-radius: 8px; }
        .clause { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .clause-header { background: #e9ecef; padding: 10px; margin: -20px -20px 15px -20px; border-radius: 8px 8px 0 0; }
        .risk-high { border-left: 5px solid #dc3545; }
        .risk-medium { border-left: 5px solid #ffc107; }
        .risk-low { border-left: 5px solid #28a745; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .status-approved { background: #d4edda; color: #155724; }
        .status-pending { background: #d1ecf1; color: #0c5460; }
        .status-rejected { background: #f8d7da; color: #721c24; }
        .ai-suggestion { background: #e7f3ff; padding: 15px; border-radius: 6px; margin-top: 15px; }
        h1, h2, h3 { color: #2c3e50; }
        .export-date { color: #6c757d; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Lease Clause Review Report</h1>
        <h2>${currentLease.data.clause_name || 'Lease Document'}</h2>
        <p class="export-date">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p><strong>Lease ID:</strong> ${leaseId} | <strong>Document ID:</strong> ${clauseDocId}</p>
    </div>
    
    <div class="summary">
        <h3>Executive Summary</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
<div><strong>Total Clauses:</strong> ${Object.keys(history).length}</div>
<div><strong>High Risk:</strong> ${historyValues.filter(c => getRiskLevel(c.risk) >= 7).length}</div>
            <div><strong>Medium Risk:</strong> ${historyValues.filter(c => {
      const level = getRiskLevel(c.risk);
      return level >= 4 && level < 7;
    }).length}</div>
           <div><strong>Low Risk:</strong> ${historyValues.filter(c => getRiskLevel(c.risk) < 4).length}</div>
<div><strong>Approved:</strong> ${historyValues.filter(c => c.status === 'approved').length}</div>
<div><strong>Pending:</strong> ${historyValues.filter(c => c.status === 'pending').length}</div>
<div><strong>Rejected:</strong> ${historyValues.filter(c => c.status === 'rejected').length}</div>

        </div>
    </div>
    
    <h3>Detailed Clause Analysis</h3>
   ${(Object.entries(history) as [string, ClauseData][])
        .map(([clauseName, clause]) => {
          const riskColor = getRiskColor(clause.risk);
          const riskClass = riskColor === 'red' ? 'risk-high' : riskColor === 'yellow' ? 'risk-medium' : 'risk-low';
          const statusClass = `status-${clause.status}`;

          return `
      <div class="clause ${riskClass}">
          <div class="clause-header">
              <h4 style="margin: 0; display: flex; justify-content: space-between; align-items: center;">
                  ${clauseName}
                  <span class="status ${statusClass}">${String(clause.status).toUpperCase()}</span>
              </h4>
              <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Risk Level:</strong> ${clause.risk}</p>
          </div>

          <div>
              <h5>Current Version:</h5>
              <p>${clause.current_version}</p>

              <div class="ai-suggestion">
                  <h5>AI Analysis & Recommendation:</h5>
                  <p><strong>Details:</strong> ${clause.clause_details}</p>
                  <p><strong>Suggested Improvement:</strong> ${clause.ai_suggested_clause_details}</p>
              </div>
          </div>
      </div>
    `;
        })
        .join('')}
    
    <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #6c757d; font-size: 12px;">
        <p>This report was generated automatically by the AI Legal Assistant system.</p>
        <p>Report ID: ${leaseId}-${clauseDocId}-${Date.now()}</p>
    </div>
</body>
</html>`;

    // Create and download HTML file that can be printed to PDF
    const blob = new Blob([pdfContent], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `lease-report-${leaseId}-${new Date().toISOString().split('T')[0]}.html`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show additional instruction
    setTimeout(() => {
      showToastMessage('HTML report downloaded! Open it and use Ctrl+P to save as PDF.');
    }, 1000);
  };

  const handleAIAssistant = (): void => {
    console.log('Opening AI Assistant...');
    setShowAIAssistant(true);
  };

  const closeAIAssistant = (): void => {
    setShowAIAssistant(false);
  };

  return (
    <DashboardLayout>
      {isLoading ? (<LoadingOverlay isVisible />) : (
        <div className="min-h-screen bg-gray-50">
          {/* Custom CSS for animations */}

          {/* Toast Notification */}
          {showToast && (
            <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in-right">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </div>
          )}

          {/* AI Assistant Modal */}
          {showAIAssistant && (
            <div className="fixed inset-0 z-50 bg-white/20 backdrop-blur-sm  flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">AI Legal Assistant</h3>
                  </div>
                  <button
                    onClick={closeAIAssistant}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        Hello! I am your AI Legal Assistant. I can help you with:
                      </p>
                      <ul className="mt-2 text-sm text-blue-700 space-y-1">
                        <li>• Explaining complex lease terms</li>
                        <li>• Identifying potential risks</li>
                        <li>• Suggesting alternative language</li>
                        <li>• Comparing clauses to industry standards</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-900">Quick Questions:</h4>
                      <div className="space-y-2">
                        {/* <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors">
                          What are the main risks in this lease?
                        </button> */}
                        <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors">
                          How do these terms compare to market standards?
                        </button>
                        <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors">
                          What should I negotiate differently?
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask me anything about this lease..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                        Ask
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
                <button
                  onClick={() => router.back()}
                  className="hidden sm:flex items-center text-gray-600 hover:text-gray-800"
                >
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
                <button
                  onClick={handleExportSummary}
                  className="hidden md:flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" /> Export Summary
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="hidden sm:flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </button>
                <button
                  onClick={handleAIAssistant}
                  className="flex items-center px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
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
                          const clause = currentLease?.data?.history?.[clauseName];
                          if (!clause) return null;

                          const riskColor = getRiskColor(clause.risk);
                          const RiskIcon = getRiskIcon(clause.risk);
                          const isSelected = selectedClause === clauseName;

                          return (
                            <button
                              key={clauseName}
                              onClick={() => setSelectedClause(clauseName)}
                              className={`w-full text-left p-3 rounded-lg text-sm font-medium transition-all ${isSelected

                                ? "bg-blue-50 border border-blue-200 text-blue-700"
                                : "hover:bg-gray-50 border border-transparent text-gray-700"
                                }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <RiskIcon
                                    className={`w-4 h-4 ${riskColor === "red"
                                      ? "text-red-500"
                                      : riskColor === "yellow"
                                        ? "text-yellow-500"
                                        : "text-green-500"
                                      }`}
                                  />
                                  <span className="truncate">{clauseName}</span>
                                </div>
                                <span
                                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${clause.status === "approved"
                                    ? "bg-green-100 text-green-700"
                                    : clause.status === "rejected"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-blue-100 text-blue-700"
                                    }`}
                                >
                                  {clause.status}
                                </span>
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

            {/* Clause Detail Panel */}
            <main className="col-span-9">
              {selectedClauseData ? (
                <div className="bg-white rounded-lg shadow p-6 space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      {selectedClause}
                    </h2>
                    <div className="flex gap-2">
                      {editingClause === selectedClause ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(selectedClause!)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            <Save className="w-4 h-4" /> Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                          >
                            <X className="w-4 h-4" /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(selectedClause!)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                          >
                            <Edit3 className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleAccept(selectedClause!)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            <Check className="w-4 h-4" /> Accept AI
                          </button>
                          <button
                            onClick={() => handleReject(selectedClause!)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm border border-red-300 bg-red-50 text-red-700 rounded-md hover:bg-red-100"
                          >
                            <X className="w-4 h-4" /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Risk + Status */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const RiskIconLocal = getRiskIcon(selectedClauseData.risk);
                        const riskColorLocal = getRiskColor(selectedClauseData.risk);
                        return (
                          <RiskIconLocal
                            className={`w-5 h-5 ${riskColorLocal === "red"
                              ? "text-red-500"
                              : riskColorLocal === "yellow"
                                ? "text-yellow-500"
                                : "text-green-500"
                              }`}
                          />
                        );
                      })()}
                      <span className="text-sm text-gray-600">
                        {selectedClauseData.risk}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedClauseData.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : selectedClauseData.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {selectedClauseData.status?.toUpperCase?.() || ""}
                    </span>
                  </div>

                  {/* Clause Content */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Current Version
                    </h3>
                    {editingClause === selectedClause ? (
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={8}
                        className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-700 whitespace-pre-line">
                        {selectedClauseData.current_version}
                      </p>
                    )}
                  </div>

                  {/* AI Suggestion */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Bot className="w-4 h-4 text-blue-600" /> AI Suggestion
                    </h3>
                    <p className="text-sm text-gray-700">
                      {selectedClauseData.ai_suggested_clause_details}
                    </p>
                    {selectedClauseData.clause_details && (
                      <p className="text-xs text-gray-500 mt-2">
                        Notes: {selectedClauseData.clause_details}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm">
                  Select a clause from the left to view details.
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LeaseClauseReview;
