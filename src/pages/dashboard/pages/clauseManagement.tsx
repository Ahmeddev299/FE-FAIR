import React, { useState } from 'react';
import { ArrowLeft, Edit, MessageSquare, Check, AlertTriangle, Clock, Eye,  ChevronDown, Sparkles, AlertCircle } from 'lucide-react';
import ClauseDetailsModel from '@/components/models/clauseDetailsModel';
import { DashboardLayout } from '@/components/layouts';
import { DocumentPreviewModal } from '@/components/models/documentPreviewModel'; // or correct path
import Image from 'next/image';

// Type definitions
type ClauseStatus = 'Edited' | 'Suggested' | 'Approved' | 'Review';
type RiskLevel = 'High' | 'Medium' | 'Low';

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

const ClauseManagement: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('All Status');
    const [selectedRisk, setSelectedRisk] = useState<RiskFilter>('All Risk Levels');
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
            status: 'Suggested',
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
            status: 'Review',
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
            case 'Suggested': return 'bg-blue-100 text-blue-700';
            case 'Approved': return 'bg-green-100 text-green-700';
            case 'Review': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getRiskColor = (risk: RiskLevel): string => {
        switch (risk) {
            case 'High': return 'text-red-600';
            case 'Medium': return 'text-yellow-600';
            case 'Low': return 'text-green-600';
            default: return 'text-gray-400';
        }
    };


    const getStatusIcon = (status: ClauseStatus): React.ReactElement | null => {
        switch (status) {
            case 'Edited': return <Edit className="h-4 w-4 text-purple-500" />;
            case 'Suggested': return <Sparkles className="h-4 w-4 text-blue-500" />;
            case 'Approved': return <Check className="h-4 w-4 text-green-500" />;
            case 'Review': return <AlertCircle className="h-4 w-4 text-orange-500" />;
            default: return null;
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

    // Management Progress Component
    const ManagementProgress = () => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Management Progress</h3>

            {/* Progress Header */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Clauses Approved</span>
                <span className="text-sm font-semibold text-gray-900">1 of 4</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-5">
                <div className="bg-blue-600 h-2.5 rounded-full w-[25%] transition-all duration-300"></div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Approved */}
                <div className="bg-[#F0FDF4] rounded-lg p-3 flex flex-col items-center justify-center shadow-sm">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-1">
                        <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-sm font-semibold text-green-700">1</div>
                    <div className="text-xs text-green-700">Approved</div>
                </div>

                {/* Pending */}
                <div className="bg-orange-50 rounded-lg p-3 flex flex-col items-center justify-center shadow-sm">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mb-1">
                        <Clock className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="text-sm font-semibold text-orange-700">3</div>
                    <div className="text-xs text-orange-700">Pending</div>
                </div>
            </div>

            {/* Unresolved Comments */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-red-600 mt-1" />
                <div>
                    <div className="text-sm font-medium text-red-700">Unresolved Comments</div>
                    <div className="text-xs text-red-600">2 clauses with open comments</div>
                </div>
            </div>
        </div>
    );
    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <ArrowLeft className="h-5 w-5 text-gray-600 cursor-pointer" />
                <span className="text-sm text-gray-600">Back to Review</span>
            </div>

            <div className="p-4 bg-[white] shadow-sm border border-gray-200 rounded">
                <div className="flex items-center gap-3">
                    <div className="text-white rounded-lg p-2">
                        <Image alt='clause' src="/clause.png"  height={50} width={50} />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Clause Management</h1>
                        <p className="text-sm text-gray-600">Edit, review, and approve lease clauses before proceeding to signature.</p>
                    </div>
                </div>
                {/* Status Indicators */}
                <div className="flex bg-[#EFF6FF] p-4 rounded items-center gap-6 mt-6">
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
            </div>

            <div className="max-w-7xl mt-4 mx-auto">
                {/* Management Progress - Top Column on XL screens */}
                <div className="hidden xl:block mb-6">
                    <ManagementProgress />
                </div>

                <div className="flex flex-col xl:flex-row gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 max-w-screen-xl mx-auto">
                            {/* Filters */}
                            <div className="p-4 sm:p-6">
                                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                                    <h2 className="text-lg font-medium text-gray-900">Lease Clauses ({clauses.length})</h2>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        {/* Status Dropdown */}
                                        <div className="relative w-full sm:w-auto">
                                            <select
                                                className="appearance-none w-full bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={selectedStatus}
                                                onChange={handleStatusChange}
                                            >
                                                <option value="All Status">All Status</option>
                                                <option value="Edited">Edited</option>
                                                <option value="Suggested">AI Suggested</option>
                                                <option value="Approved">Approved</option>
                                                <option value="Review">Needs Review</option>
                                            </select>
                                            <ChevronDown className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>

                                        {/* Risk Dropdown */}
                                        <div className="relative w-full sm:w-auto">
                                            <select
                                                className="appearance-none w-full bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={selectedRisk}
                                                onChange={handleRiskChange}
                                            >
                                                <option value="All Risk Levels">All Risk Levels</option>
                                                <option value="High">High</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Low">Low</option>
                                            </select>
                                            <ChevronDown className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Header */}
                            <div className="hidden md:block px-4 xl:px-6 py-3 bg-white border-b border-gray-200">
                                <div className="grid grid-cols-12 gap-4 xl:gap-6 text-sm font-medium text-gray-700">
                                    <div className="col-span-3">Clause</div>
                                    <div className="col-span-2">Status</div>
                                    <div className="col-span-1">Risk</div>
                                    <div className="col-span-3">Comments</div>
                                    <div className="col-span-2">Actions</div>
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-gray-200">
                                {clauses.map((clause) => (
                                    <div key={clause.id} className="p-4 xl:pl-6  xl:py-5 hover:bg-gray-50 transition">
                                        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-4 xl:gap-6 gap-y-3 md:items-center">

                                            {/* Clause Name/Description */}
                                            <div className="md:col-span-3 truncate">
                                                <div className="font-medium text-gray-900 truncate">{clause.name}</div>
                                                <div className="text-sm text-gray-500 truncate">{clause.description}</div>
                                            </div>

                                            {/* Status */}
                                            <div className="md:col-span-2">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(clause.status)}`}>
                                                    {getStatusIcon(clause.status)}
                                                    {clause.status}
                                                </span>
                                            </div>

                                            {/* Risk */}
                                            <div className="md:col-span-1">
                                                <div className="flex items-center gap-1">
                                                    {getRiskIcon(clause.risk)}
                                                    <span className={`text-sm font-medium ${getRiskColor(clause.risk)}`}>
                                                        {clause.risk}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Comments */}
                                            <div className="md:col-span-3">
                                                {clause.comments > 0 ? (
                                                    <span className="inline-block bg-red-100 text-red-700 text-xs ml-4 px-2 py-1 rounded-full">
                                                        {clause.comments} unresolved
                                                    </span>
                                                ) : (
                                                    <span className="inline-block text-xs ml-4 px-2 py-1 rounded-full">No comments</span>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="md:col-span-3">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {clause.status === 'Suggested' && (
                                                        <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 flex items-center gap-1">
                                                            <Sparkles className="h-4 w-4" />
                                                            <span>Accept AI</span>
                                                        </button>
                                                    )}

                                                    {(clause.status === 'Edited' || clause.status === 'Review') && (
                                                        <button className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 flex items-center gap-1">
                                                            <Check className="h-4 w-4" />
                                                            <span>Approve</span>
                                                        </button>
                                                    )}

                                                    {/* Edit button */}
                                                    <button
                                                        className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-600 w-[50px] h-[30px] rounded-md flex items-center justify-center"
                                                        onClick={() => handleEditClause(clause)}
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>

                                                    {/* Comment button */}
                                                    <button
                                                        className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-600 w-[50px] h-[30px] rounded-md flex items-center justify-center"
                                                        title="Comment"
                                                    >
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
                    <div className="w-full xl:w-80 space-y-6">
                        {/* Management Progress - Show in sidebar on smaller screens */}
                        <div className="xl:hidden">
                            <ManagementProgress />
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