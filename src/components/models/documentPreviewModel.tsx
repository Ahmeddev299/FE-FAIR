
import { FileText, Download, X } from 'lucide-react';


interface DocumentPreviewModalProps {
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ onClose }) => (
<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 backdrop-blur-sm bg-black/40">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white rounded-lg p-2">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Document Preview</h2>
                        <p className="text-sm text-gray-600">Preview your updated lease document</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        <Download className="h-4 w-4" />
                        Download PDF
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Approved</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Pending</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Rejected</span>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">COMMERCIAL LEASE AGREEMENT</h1>
                        <p className="text-sm text-gray-600">Downtown Office Complex - 123 Main St, Suite 1A, 30309</p>
                        <p className="text-xs text-gray-500 mt-1">This document shows the updated lease with your approved changes</p>
                    </div>

                    <div className="space-y-6">
                        <div className="border-l-4 border-green-500 pl-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-900">1. Base Rent Amount</h3>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Approved</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                                Tenant shall pay to Landlord as base rent for the Premises the sum of Twenty-Five Thousand Dollars
                                ($25,000) per month, payable in advance on or before the first day of each calendar month during the Term.
                                Such rent shall be paid to Landlord at the address set forth below.
                            </p>
                            <p className="text-xs text-gray-500 italic">Modified</p>
                        </div>

                        <div className="border-l-4 border-orange-500 pl-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-900">2. Common Area Maintenance</h3>
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Pending</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                                Tenant shall pay common area maintenance charges based on Tenant is proportionate share of actual,
                                reasonable, and necessary expenses incurred by Landlord. Landlord shall provide annual accounting with
                                receipts and supporting documentation within ninety (90) days of fiscal year end.
                            </p>
                            <p className="text-xs text-orange-600 italic">Requires approval before final clause</p>
                        </div>

                        <div className="border-l-4 border-orange-500 pl-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-900">3. Early Termination Rights</h3>
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Pending</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                                This lease may be terminated by either party with ninety (90) days written notice for material breach that
                                remains uncured after thirty (30) days written notice to cure.
                            </p>
                            <p className="text-xs text-orange-600 italic">Requires approval before final clause</p>
                        </div>

                        <div className="border-l-4 border-orange-500 pl-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-900">4. Tenant Indemnification</h3>
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Pending</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                                Tenant shall defend and hold harmless Landlord from claims, damages, or expenses arising from
                                Tenant&apos;s or Landlord&apos;s negligence...
                                acts or willful misconduct in the use of the Premises, excluding claims arising from
                                Landlord is negligence or willful misconduct.
                            </p>
                            <p className="text-xs text-orange-600 italic">Requires approval before final clause</p>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">Document generated on 03/07/2025</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50">
                <button
                    onClick={onClose}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Close Preview
                </button>
            </div>
        </div>
    </div>
);