import React, { useEffect, useState } from 'react';
import { ArrowLeft, Upload, FileText, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from "@/hooks/hooks"
import { getUserLeasesAsync, terminateLeaseAsync } from "@/services/lease/asyncThunk";
import { LoadingOverlay } from '@/components/loaders/overlayloader';
import Toast from '@/components/Toast';
import { useRouter } from 'next/router';

const TerminateLease: React.FC = () => {
    const [terminationReason, setTerminationReason] = useState<string>('');
    const [terminationDate, setTerminationDate] = useState<string>('');
    const [supportingNotes, setSupportingNotes] = useState<string>('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
      const router = useRouter(); // For Next.js

    const dispatch = useAppDispatch();
    const { leaseList: leases, isLoading } = useAppSelector((state) => state.lease);

    const [selectedLeaseId, setSelectedLeaseId] = useState("");

    useEffect(() => {
        dispatch(getUserLeasesAsync());
    }, [dispatch]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const handleSubmit = async () => {
        if (!selectedLeaseId || !terminationReason || !terminationDate) {
            alert("Please fill in all required fields");
            return;
        }
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("lease_doc_id", selectedLeaseId);
            formData.append("Doc_title", terminationReason);
            formData.append("termination_date", terminationDate);
            formData.append("reason", supportingNotes);
            if (uploadedFile) {
                formData.append("document", uploadedFile);
            }
            
            await dispatch(terminateLeaseAsync(formData)).unwrap();
            
            // Reset form on success
            setSelectedLeaseId("");
            setTerminationReason("");
            setTerminationDate("");
            setSupportingNotes("");
            setUploadedFile(null);
            
            // You might want to show a success message or redirect here
        Toast.fire({ icon: "success", title: "Lease Terminate Sucessfull" });
            
         router.push({
        pathname: '/dashboard/pages/tenantStorage',
        query: {
          success: 'loi_submitted',
        }
      });
        } catch (error) {
            console.error("Error terminating lease:", error);
        Toast.fire({ icon: "error", title: error });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        console.log('Cancelled');
        // Reset form
        setSelectedLeaseId("");
        setTerminationReason("");
        setTerminationDate("");
        setSupportingNotes("");
        setUploadedFile(null);
    };

    // Check if form is disabled (either loading leases or submitting)
    const isFormDisabled = isLoading || isSubmitting;

    return (
        <DashboardLayout>
            {isLoading ? (<LoadingOverlay isVisible />)  :( <div className="min-h-screen bg-white">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-4 py-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center space-x-6">
                            <button 
                                className="flex items-center text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                <ArrowLeft className="h-5 w-5 mr-1" />
                                Back
                            </button>
                            <div className="flex items-center space-x-2">
                                <Image src='/term.png' alt='teminat' width={35} height={40} />
                                <div>
                                    <h1 className="font-semibold text-gray-900">Terminate Lease</h1>
                                    <p className="text-xs text-gray-500">Internal lease lease termination process</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-2xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Lease Selection */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Lease to Terminate</h2>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Choose Lease</label>
                                        {isLoading ? (
                                            <div className="flex items-center justify-center p-4 border border-gray-300 rounded-md">
                                                <Loader2 className="h-5 w-5 animate-spin text-gray-500 mr-2" />
                                                <span className="text-gray-500">Loading leases...</span>
                                            </div>
                                        ) : (
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                value={selectedLeaseId}
                                                onChange={(e) => setSelectedLeaseId(e.target.value)}
                                                disabled={isFormDisabled}
                                            >
                                                <option value="" disabled>Select a lease</option>
                                                {leases?.data?.map((lease) => (
                                                    <option key={lease?.lease_id} value={lease?.lease_id}>
                                                        {lease?.lease_title}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Termination Details */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Termination Details</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Reason for Termination <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                value={terminationReason}
                                                onChange={(e) => setTerminationReason(e.target.value)}
                                                disabled={isFormDisabled}
                                            >
                                                <option value="">Select reason...</option>
                                                <option value="breach">Breach by Landlord</option>
                                                <option value="expiration">Natural Expiration</option>
                                                <option value="mutual">Mutual Agreement</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Termination Date <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                    value={terminationDate}
                                                    onChange={(e) => setTerminationDate(e.target.value)}
                                                    disabled={isFormDisabled}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Supporting Notes (Optional)
                                            </label>
                                            <textarea
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                rows={3}
                                                placeholder="Provide any additional details or context for the termination..."
                                                value={supportingNotes}
                                                onChange={(e) => setSupportingNotes(e.target.value)}
                                                disabled={isFormDisabled}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">These notes will be included in the termination notice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Supporting Documents */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Supporting Documents (Optional)</h2>

                                    <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
                                        isFormDisabled 
                                            ? 'border-gray-200 bg-gray-50' 
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}>
                                        <Upload className={`h-12 w-12 mx-auto mb-4 ${
                                            isFormDisabled ? 'text-gray-300' : 'text-gray-400'
                                        }`} />
                                        <h3 className={`text-lg font-medium mb-2 ${
                                            isFormDisabled ? 'text-gray-400' : 'text-gray-900'
                                        }`}>Upload Supporting Documents</h3>
                                        <p className={`text-sm mb-4 ${
                                            isFormDisabled ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            Attach any supporting notice or termination letter (PDF/DOC)
                                        </p>
                                        <label className={`cursor-pointer ${isFormDisabled ? 'cursor-not-allowed' : ''}`}>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleFileUpload}
                                                disabled={isFormDisabled}
                                            />
                                            <span className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
                                                isFormDisabled 
                                                    ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                                                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                            }`}>
                                                Choose File
                                            </span>
                                        </label>
                                        <p className={`text-xs mt-2 ${
                                            isFormDisabled ? 'text-gray-400' : 'text-gray-500'
                                        }`}>Or drag and drop files here</p>
                                    </div>

                                    {uploadedFile && (
                                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                                                    <span className="text-sm text-blue-900">{uploadedFile.name}</span>
                                                </div>
                                                {!isFormDisabled && (
                                                    <button
                                                        onClick={() => setUploadedFile(null)}
                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isFormDisabled || !selectedLeaseId || !terminationReason || !terminationDate}
                                    className="px-6 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="h-4 w-4" />
                                            <span>Generate Legal Notice</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Loading Overlay for entire form */}
                            {isSubmitting && (
                                    <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                                    </div>
                               
                            )}
                        </div>
                    </div>
                </div>
            </div>)}
           
        </DashboardLayout>
    );
};

export default TerminateLease;