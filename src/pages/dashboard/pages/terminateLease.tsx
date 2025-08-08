import React, { useEffect, useState } from 'react';
import { ArrowLeft, Upload, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from "@/hooks/hooks"
import { getUserLeasesAsync, terminateLeaseAsync } from "@/services/lease/asyncThunk";

// interface Lease {
//     id: string;
//     title: string;
//     address: string;
//     district: string;
//     leaseTerm: string;
//     parties: string;
//     tenantName: string;
//     status: string;
// }

const TerminateLease: React.FC = () => {
    const [terminationReason, setTerminationReason] = useState<string>('');
    const [terminationDate, setTerminationDate] = useState<string>('');
    const [supportingNotes, setSupportingNotes] = useState<string>('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const dispatch = useAppDispatch();
    const { leaseList: leases } = useAppSelector((state) => state.lease);

    const [selectedLeaseId, setSelectedLeaseId] = useState("");

    useEffect(() => {
        dispatch(getUserLeasesAsync());
    }, [dispatch]);

    // const leases: Lease[] = [
    //     {
    //         id: '1',
    //         title: 'Warehouse Facility',
    //         address: '345 Industrial Ave, Warehouse Quarter',
    //         district: 'Warehouse District',
    //         leaseTerm: '04/08/2024 - 11/08/2026',
    //         parties: 'Landmark Industrial Holdings Inc.',
    //         tenantName: 'Tenant: Your Business Name',
    //         status: 'Active'
    //     },
    //     {
    //         id: '2',
    //         title: 'Parking',
    //         address: 'Outdoor Designated Parking for Vehicle Year-Round lease',
    //         district: 'Commercial District',
    //         leaseTerm: '12 months - 01/01/2024',
    //         parties: 'Downtown Parking Authority',
    //         tenantName: 'Tenant: Vehicle Services LLC',
    //         status: 'Active'
    //     }
    // ];

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const handleSubmit = () => {
        if (!selectedLeaseId || !terminationReason || !terminationDate) {
            alert("Please fill in all required fields");
            return;
        }

        const formData = new FormData();
        formData.append("leaseId", selectedLeaseId);
        formData.append("terminationReason", terminationReason);
        formData.append("terminationDate", terminationDate);
        formData.append("supportingNotes", supportingNotes);
        if (uploadedFile) {
            formData.append("document", uploadedFile);
        }
        dispatch(terminateLeaseAsync(formData)); // You need to create this thunk
    };


    const handleCancel = () => {
        console.log('Cancelled');
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-4 py-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center space-x-6">
                            <button className="flex items-center text-gray-600 hover:text-gray-800">
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
                        {/* Left Section - Form */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Lease to Terminate</h2>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Choose Lease</label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option>Warehouse Facility</option>
                                            <option>Parking</option>
                                        </select>
                                    </div>

                                  
                                    <div className="bg-[#F9FAFB] rounded-lg p-4">
                                        <h3 className="font-medium text-gray-900 mb-3">Lease Summary</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <div className="flex items-start space-x-3">
                                                    <div className="w-8 h-8  rounded-full flex items-center justify-center">
                                                        <Image src='/ware.png' alt='warehouse' height={20} width={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Warehouse Facility</p>
                                                        <p className="text-sm text-gray-600">345 Industrial Ave, Warehouse Quarter</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-900">Lease Term</p>
                                                    <p className="text-sm text-gray-600">04/08/2024 - 11/08/2026</p>
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 mt-1">
                                                        Active
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                                                    <Image src='/party.png' alt='party' height={20} width={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Parties</p>
                                                    <p className="text-sm text-gray-600">Landmark Industrial Holdings Inc.</p>
                                                    <p className="text-sm text-gray-600">Tenant: Your Business Name</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Lease to Terminate</h2>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Choose Lease</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={selectedLeaseId}
                                            onChange={(e) => setSelectedLeaseId(e.target.value)}
                                        >
                                            <option value="" disabled>Select a lease</option>
                                            {leases?.data?.map((lease) => (
                                                <option key={lease?.lease_id} value={lease?.lease_id}>
                                                    {lease?.lease_title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Termination Details</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Reason for Termination <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={terminationReason}
                                                onChange={(e) => setTerminationReason(e.target.value)}
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
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={terminationDate}
                                                    onChange={(e) => setTerminationDate(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Supporting Notes (Optional)
                                            </label>
                                            <textarea
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                rows={3}
                                                placeholder="Provide any additional details or context for the termination..."
                                                value={supportingNotes}
                                                onChange={(e) => setSupportingNotes(e.target.value)}
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

                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Supporting Documents</h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Attach any supporting notice or termination letter (PDF/DOC)
                                        </p>
                                        <label className="cursor-pointer">
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleFileUpload}
                                            />
                                            <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                                Choose File
                                            </span>
                                        </label>
                                        <p className="text-xs text-gray-500 mt-2">Or drag and drop files here</p>
                                    </div>

                                    {uploadedFile && (
                                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                                            <div className="flex items-center">
                                                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                                                <span className="text-sm text-blue-900">{uploadedFile.name}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 flex items-center space-x-2"
                                >
                                    <FileText className="h-4 w-4" />
                                    <span>Generate Legal Notice</span>
                                </button>
                            </div>
                        </div>

                        {/* Right Section - AI Preview */}
                        {/* <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">AI-Generated Legal Notice</h3>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span className="text-xs text-gray-600">AI Powered</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <p className="text-sm text-gray-600 text-center">
                                            Preview will appear here once you fill in the details
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                                            <Eye className="h-4 w-4" />
                                            <span>Show Preview</span>
                                        </button>
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                            View Preview
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TerminateLease;