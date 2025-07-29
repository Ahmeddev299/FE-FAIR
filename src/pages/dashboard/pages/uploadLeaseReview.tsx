'use client';

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

const LeaseClauseReview: React.FC = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  return (
    <DashboardLayout>
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
                <span>Downtown Office Lease Agreement.pdf</span>
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
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2 flex-1">
            <select className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>All Risk Levels</option>
              <option>Low Risk</option>
              <option>Medium Risk</option>
              <option>High Risk</option>
            </select>
            <select className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>All Categories</option>
              <option>Rent</option>
              <option>Termination</option>
              <option>Indemnity</option>
              <option>CAM</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="hidden lg:grid grid-cols-12 gap-6 max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {/* Clause List */}
        <aside className="col-span-3 border-r pr-4 space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Rent</h3>
              <div className="space-y-2">
                <button className="w-full text-left bg-blue-50 border border-blue-500 p-3 rounded-lg text-sm font-medium">
                  <div className="flex items-center gap-2 text-gray-800">
                    <CheckCircle className="w-4 h-4 text-green-500" /> Base Rent Amount
                  </div>
                  <div className="mt-1 text-xs text-green-700">Terms Compliant</div>
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Common Area Maintenance</h3>
              <div className="space-y-2">
                <button className="w-full text-left bg-yellow-50 border border-yellow-300 p-3 rounded-lg text-sm font-medium">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="w-4 h-4" /> CAM Charges
                  </div>
                  <div className="mt-1 text-xs text-yellow-800">Needs Review</div>
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Termination</h3>
              <div className="space-y-2">
                <button className="w-full text-left bg-red-50 border border-red-300 p-3 rounded-lg text-sm font-medium">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-4 h-4" /> Early Termination Rights
                  </div>
                  <div className="mt-1 text-xs text-red-800">High Risk</div>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Clause Detail */}
        <main className="col-span-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" /> Base Rent Amount
            </h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-200">Risk Score: 2/10</span>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Terms Compliant</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center mb-2">
                <AlertCircle className="w-4 h-4 mr-2" /> Original Clause
              </h4>
              <p className="text-sm text-gray-800">Tenant shall pay to Landlord as base rent the sum of $25,000/month in advance each month.</p>
            </div>
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="text-sm font-semibold text-blue-800 flex items-center mb-2">
                <Bot className="w-4 h-4 mr-2" /> AI Suggested Clause
              </h4>
              <p className="text-sm text-gray-800">Tenant shall pay the same in advance on or before the 1st of each month. Late payments have a 5-day grace period before penalties.</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg space-y-2">
            <h4 className="text-sm font-semibold text-yellow-800 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" /> AI Analysis & Recommendations
            </h4>
            <p className="text-sm text-yellow-800"><strong>Low Risk:</strong> The clause appears reasonable and balanced for both parties.</p>
            <p className="text-sm text-yellow-800"><strong>Key Changes:</strong> Added timing detail and a 5-day grace window for late payments.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex items-center px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 text-sm">
              <X className="w-4 h-4 mr-2" /> Reject
            </button>
            <button className="flex items-center px-4 py-2 border border-yellow-500 text-yellow-700 bg-yellow-50 rounded-md hover:bg-yellow-100 text-sm">
              <AlertTriangle className="w-4 h-4 mr-2" /> Edit
            </button>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
              <Check className="w-4 h-4 mr-2" /> Accept Suggestion
            </button>
          </div>
        </main>

        {/* Assistant Sidebar */}
        <aside className="col-span-3 border-l pl-4 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <Bot className="w-4 h-4 mr-2 text-blue-600" /> AI Legal Assistant
            </h3>
            <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs p-3 rounded-lg mt-2">
              I’m analyzing your lease clauses and providing personalized recommendations based on commercial lease best practices.
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-xs">
              <AlertTriangle className="w-4 h-4 text-red-500 mr-2 inline-block" />
              <span className="font-medium text-red-800">Review All High-Risk Clauses</span>
              <p className="text-red-600 mt-1">These require immediate attention.</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-xs">
              <Scale className="w-4 h-4 text-yellow-500 mr-2 inline-block" />
              <span className="font-medium text-yellow-800">Check Jurisdiction Compliance</span>
              <p className="text-yellow-600 mt-1">Ensure local compliance.</p>
            </div>
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-xs">
              <FileCheck className="w-4 h-4 text-green-500 mr-2 inline-block" />
              <span className="font-medium text-green-800">Document Your Changes</span>
              <p className="text-green-600 mt-1">Track updates for negotiation.</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full flex items-center p-2 text-left text-sm hover:bg-gray-50 rounded-lg">
                <MessageSquare className="w-4 h-4 mr-2 text-gray-500" /> Ask AI a Question
              </button>
              <button className="w-full flex items-center p-2 text-left text-sm hover:bg-gray-50 rounded-lg">
                <FileText className="w-4 h-4 mr-2 text-gray-500" /> Generate Summary
              </button>
              <button className="w-full flex items-center p-2 text-left text-sm hover:bg-gray-50 rounded-lg">
                <ExternalLink className="w-4 h-4 mr-2 text-gray-500" /> Legal Resources
              </button>
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
};

export default LeaseClauseReview;
