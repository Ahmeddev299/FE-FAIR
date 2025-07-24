import React, { useEffect } from 'react';
import { X, History, Check, MessageSquare, AlertTriangle } from 'lucide-react';

interface Clause {
    id: number;
    name: string;
    description: string;
    status: string;
    risk: string;
    lastEdited: string;
    editor: string;
    comments: number;
    unresolved: boolean;
    // Optional additional fields:
    originalText?: string;
    aiSuggestion?: string;
    currentVersion?: string;
}

interface ClauseDetailModalProps {
    onClose: () => void;
    clause: Clause | null;
    newComment: string;
    setNewComment: (value: string) => void;
    handleAddComment: () => void;
}

export default function ClauseDetailModal({ onClose, newComment,
    setNewComment, handleAddComment }: ClauseDetailModalProps) {
    // Lock scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 bg-white/20 backdrop-blur-sm "
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4">
                <div
                    className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()} // prevent modal click from closing
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div>
                            <h2 className="text-lg font-semibold">{'Base Rent Amount'}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-600">{'Rent'}</span>
                                <span className="text-sm text-gray-400">•</span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Approved</span>
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Low Risk</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                                <History className="h-4 w-4" />
                                History (2)
                            </button>
                            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Original */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                    <h3 className="font-medium text-gray-900">Original Clause</h3>
                                </div>
                                <p className="text-sm text-gray-700">
                                    Tenant shall pay to Landlord as base rent for the Premises the sum of Twenty-Five Thousand Dollars ($25,000) per month, payable in advance on or before the first day of each calendar month during the Term.
                                </p>
                            </div>

                            {/* AI Suggested */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <h3 className="font-medium text-gray-900">AI Suggested</h3>
                                </div>
                                <p className="text-sm text-gray-700">
                                    Tenant shall pay to Landlord as base rent for the Premises the sum of Twenty-Five Thousand Dollars ($25,000) per month, payable in advance on or before the first day of each calendar month during the Term.
                                </p>
                            </div>

                            {/* Current */}
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <h3 className="font-medium text-gray-900">Current Version</h3>
                                </div>
                                <p className="text-sm text-gray-700">
                                    Tenant shall pay to Landlord as base rent for the Premises the sum of Twenty-Five Thousand Dollars ($25,000) per month, payable in advance on or before the first day of each calendar month during the Term.
                                </p>
                                <div className="flex items-center gap-2 mt-3">
                                    <Check className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-green-700">Edit Text</span>
                                </div>
                            </div>
                        </div>

                        {/* Comments */}
                        <div className="mt-6">
                            <div className="flex items-center gap-2 mb-4">
                                <MessageSquare className="h-4 w-4 text-gray-600" />
                                <h3 className="font-medium text-gray-900">Comments (0)</h3>
                            </div>

                            <div className="flex gap-3">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-600">U</span>
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button
                                            onClick={handleAddComment}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                        >
                                            Add Comment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-between' >
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500">Last edited 15/01/2024 19:30 by John Doe</p>
                            </div>
                            <div className="flex flex-col mt-6 sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                                <button
                                    className="flex items-center justify-center px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 text-sm font-medium"
                                    type="button"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Reject
                                </button>

                                <button
                                    className="flex items-center justify-center px-4 py-2 border border-yellow-500 text-yellow-700 bg-yellow-50 rounded-md hover:bg-yellow-100 text-sm font-medium"
                                    type="button"
                                >
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Request Review
                                </button>

                                <button
                                    className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                                    type="button"
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Approve
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
