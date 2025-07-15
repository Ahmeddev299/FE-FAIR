import React, { useState } from 'react';
import { ArrowLeft, Edit, MessageSquare, Check, AlertTriangle, Clock, Eye, FileText, ChevronDown } from 'lucide-react';
import ClauseDetailsModel from '@/components/models/clauseDetailsModel';
import { DashboardLayout } from '@/components/layouts';
import { DocumentPreviewModal} from '@/components/models/documentPreviewModel'; // or correct path

// Type definitions
type ClauseStatus = 'Edited' | 'AI Suggested' | 'Approved' | 'Needs Review';
type RiskLevel = 'High' | 'Medium' | 'Low';
type Category = 'Financial' | 'Legal' | 'Operational';

interface Clause {
    id: number;
    name: string;
    description: string;
    status: ClauseStatus;
    risk: RiskLevel;
    lastEdited: string;
    editor: string;
    comments: number;
    unresolved: boolean;
}

// Filter types
type StatusFilter = 'All Status' | ClauseStatus;
type RiskFilter = 'All Risk Levels' | RiskLevel;
type CategoryFilter = 'Category' | Category;

const ClauseManagement: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('All Status');
    const [selectedRisk, setSelectedRisk] = useState<RiskFilter>('All Risk Levels');
    const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Category');
    const [showDocumentPreview, setShowDocumentPreview] = useState<boolean>(false);
    const [showClauseDetail, setShowClauseDetail] = useState<boolean>(false);
    const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
    const [newComment, setNewComment] = useState<string>('');

    const clauses: Clause[] = [
        {
            id: 1,
            name: 'Common Area Maintenance',
            description: 'CAM Charges',
            status: 'Edited',
            risk: 'High',
            lastEdited: '15/01/2024 21:45',
            editor: 'by Sara Wilson',
            comments: 1,
            unresolved: true
        },
        {
            id: 2,
            name: 'Tenant Indemnification',
            description: 'Indemnity',
            status: 'AI Suggested',
            risk: 'Medium',
            lastEdited: '15/01/2024 16:15',
            editor: 'by AI Assistant',
            comments: 0,
            unresolved: false
        },
        {
            id: 3,
            name: 'Base Rent Amount',
            description: 'Rent',
            status: 'Approved',
            risk: 'Low',
            lastEdited: '15/01/2024 19:30',
            editor: 'by John Doe',
            comments: 0,
            unresolved: false
        },
        {
            id: 4,
            name: 'Early Termination Rights',
            description: 'Termination',
            status: 'Needs Review',
            risk: 'High',
            lastEdited: '15/01/2024 18:20',
            editor: 'by AI Assistant',
            comments: 1,
            unresolved: true
        }
    ];

    const getStatusColor = (status: ClauseStatus): string => {
        switch (status) {
            case 'Edited': return 'bg-purple-100 text-purple-700';
            case 'AI Suggested': return 'bg-blue-100 text-blue-700';
            case 'Approved': return 'bg-green-100 text-green-700';
            case 'Needs Review': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getRiskColor = (risk: RiskLevel): string => {
        switch (risk) {
            case 'High': return 'text-red-600';
            case 'Medium': return 'text-yellow-600';
            case 'Low': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    const handleAddComment = (): void => {
        if (newComment.trim()) {
            // Add comment logic here
            setNewComment('');
        }
    };

   const getRiskIcon = (risk: RiskLevel): React.ReactElement | null => {
  switch (risk) {
    case 'High': return <AlertTriangle className="h-4 w-4" />;
    case 'Medium': return <Clock className="h-4 w-4" />;
    case 'Low': return <Check className="h-4 w-4" />;
    default: return null;
  }
};


    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelectedStatus(event.target.value as StatusFilter);
    };

    const handleRiskChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelectedRisk(event.target.value as RiskFilter);
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelectedCategory(event.target.value as CategoryFilter);
    };

    const handleEditClause = (clause: Clause): void => {
        setSelectedClause(clause);
        setShowClauseDetail(true);
    };

    const handleCloseClauseDetail = (): void => {
        setShowClauseDetail(false);
        setSelectedClause(null);
    };

    const handleCloseDocumentPreview = (): void => {
        setShowDocumentPreview(false);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <ArrowLeft className="h-5 w-5 text-gray-600 cursor-pointer" />
                            <span className="text-sm text-gray-600">Back to Review</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 text-white rounded-lg p-2">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Clause Management</h1>
                                <p className="text-sm text-gray-600">Edit, review, and approve lease clauses before proceeding to signature.</p>
                            </div>
                        </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex items-center gap-6 mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">AI analysis complete</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">AI suggestions available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Ready for editing & approval</span>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Filters */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-medium text-gray-900">Lease Clauses (4)</h2>
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <select
                                                    className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={selectedStatus}
                                                    onChange={handleStatusChange}
                                                >
                                                    <option value="All Status">All Status</option>
                                                    <option value="Edited">Edited</option>
                                                    <option value="AI Suggested">AI Suggested</option>
                                                    <option value="Approved">Approved</option>
                                                    <option value="Needs Review">Needs Review</option>
                                                </select>
                                                <ChevronDown className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            </div>
                                            <div className="relative">
                                                <select
                                                    className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={selectedRisk}
                                                    onChange={handleRiskChange}
                                                >
                                                    <option value="All Risk Levels">All Risk Levels</option>
                                                    <option value="High">High</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Low">Low</option>
                                                </select>
                                                <ChevronDown className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            </div>
                                            <div className="relative">
                                                <select
                                                    className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={selectedCategory}
                                                    onChange={handleCategoryChange}
                                                >
                                                    <option value="Category">Category</option>
                                                    <option value="Financial">Financial</option>
                                                    <option value="Legal">Legal</option>
                                                    <option value="Operational">Operational</option>
                                                </select>
                                                <ChevronDown className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Table Header */}
                                <div className="pl-10 pr-14 py-3 bg-gray-50 border-b border-gray-200">
                                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                                        <div className="col-span-3">Clause</div>
                                        <div className="col-span-2">Status</div>
                                        <div className="col-span-1">Risk</div>
                                        <div className="col-span-2">Last Edited</div>
                                        <div className="col-span-2">Comments</div>
                                        <div className="col-span-2">Actions</div>
                                    </div>
                                </div>

                                {/* Table Content */}
                                <div className="divide-y divide-gray-200">
                                    {clauses.map((clause) => (
                                        <div key={clause.id} className="pl-8 pr-18 py-4 hover:bg-gray-50">
                                            <div className="grid grid-cols-1 sm:grid-cols-12 sm:gap-4 gap-y-3 sm:items-center">

                                                {/* Clause Title + Description */}
                                                <div className="sm:col-span-3">
                                                    <div className="font-medium text-gray-900 truncate">{clause.name}</div>
                                                    <div className="text-sm text-gray-500">{clause.description}</div>
                                                </div>

                                                {/* Status */}
                                                <div className="sm:col-span-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(clause.status)}`}>
                                                        {clause.status}
                                                    </span>
                                                </div>

                                                {/* Risk */}
                                                <div className="sm:col-span-1">
                                                    <div className={`flex items-center gap-1 ${getRiskColor(clause.risk)}`}>
                                                        {getRiskIcon(clause.risk)}
                                                        <span className="text-sm font-medium">{clause.risk}</span>
                                                    </div>
                                                </div>

                                                {/* Last Edited */}
                                                <div className="sm:col-span-2">
                                                    <div className="text-sm text-gray-900">{clause.lastEdited}</div>
                                                    <div className="text-xs text-gray-500">{clause.editor}</div>
                                                </div>

                                                {/* Comments */}
                                                <div className="sm:col-span-2">
                                                    {clause.comments > 0 && (
                                                        <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                                                            {clause.comments} unresolved
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="sm:col-span-2">
                                                    <div className="flex flex-wrap sm:flex-nowrap gap-2">
                                                        {clause.status === 'AI Suggested' && (
                                                            <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 whitespace-nowrap">
                                                                Accept AI
                                                            </button>
                                                        )}
                                                        {(clause.status === 'Edited' || clause.status === 'Needs Review') && (
                                                            <button className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 whitespace-nowrap">
                                                                Approve
                                                            </button>
                                                        )}
                                                        <button
                                                            className="p-1 text-gray-400 hover:text-gray-600"
                                                            onClick={() => handleEditClause(clause)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>

                                                        <button className="p-1 text-gray-400 hover:text-gray-600">
                                                            <MessageSquare className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="w-80 space-y-6">
                            {/* Management Progress */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <h3 className="font-medium text-gray-900 mb-4">Management Progress</h3>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Clauses Approved</span>
                                    <span className="text-sm font-medium text-gray-900">1 of 4</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                    <div className="bg-blue-600 h-2 rounded-full w-1/4"></div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-center">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-1">
                                            <Check className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div className="text-xs text-gray-600">Approved</div>
                                        <div className="text-sm font-medium text-gray-900">1</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mb-1">
                                            <Clock className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <div className="text-xs text-gray-600">Pending</div>
                                        <div className="text-sm font-medium text-gray-900">3</div>
                                    </div>
                                </div>
                            </div>

                            {/* Unresolved Comments */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                    <h3 className="font-medium text-gray-900">Unresolved Comments</h3>
                                </div>
                                <p className="text-sm text-gray-600">2 clauses with open comments</p>
                            </div>

                            {/* Document Preview */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <h3 className="font-medium text-gray-900 mb-4">Document Preview</h3>
                                <button
                                    onClick={() => setShowDocumentPreview(true)}
                                    className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                >
                                    <Eye className="h-4 w-4 text-gray-600" />
                                    <span>Preview Updated Document</span>
                                </button>

                                <p className="text-xs text-gray-500 mt-2">See how your changes will look in the final lease document</p>
                            </div>

                            {/* Ready to Proceed */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                    <h3 className="font-medium text-yellow-800">Ready to Proceed?</h3>
                                </div>
                                <p className="text-sm text-yellow-700">Action Required</p>
                                <p className="text-xs text-yellow-600 mt-1">Please approve or reject all clauses before proceeding to signature.</p>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <h3 className="font-medium text-gray-900 mb-4">Quick Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Total Clauses:</span>
                                        <span className="text-sm font-medium text-gray-900">4</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Completion Rate:</span>
                                        <span className="text-sm font-medium text-gray-900">25%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Open Comments:</span>
                                        <span className="text-sm font-medium text-gray-900">2</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showDocumentPreview && (
                <DocumentPreviewModal onClose={handleCloseDocumentPreview} />
            )}

            {showClauseDetail && (
                <ClauseDetailsModel
                    handleAddComment={handleAddComment}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    onClose={handleCloseClauseDetail}
                    clause={selectedClause}
                />
            )}
        </DashboardLayout>
    );
};

export default ClauseManagement;