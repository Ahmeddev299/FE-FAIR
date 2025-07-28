import React, { useState } from 'react';
import {
    CreditCard,
    FileText,
    Bell,
    Edit,
    Download,
    CheckCircle,
    XCircle,
    FileWarning,
    MessageCircle,
    CalendarCheck,
    Mail,
    Settings,
    ArrowLeft,
} from 'lucide-react';

import { DashboardLayout } from '@/components/layouts';
import Image from 'next/image';

const Setting: React.FC = () => {

    const [autoRenewal, setAutoRenewal] = useState<boolean>(true);

    // Toggle Switch Component
    function Switch({ isOn, disabled = false }: { isOn: boolean; disabled?: boolean }) {
        return (
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={isOn}
                    disabled={disabled}
                    className="sr-only peer"
                    readOnly
                />
                <div
                    className={`w-11 h-6 rounded-full peer-focus:outline-none transition-colors ${disabled ? "bg-gray-300" : isOn ? "bg-blue-600" : "bg-gray-200"
                        }`}
                >
                    <div
                        className={`absolute top-[2px] left-[2px] h-5 w-5 bg-white border border-gray-300 rounded-full transition-transform ${isOn ? "translate-x-full" : ""
                            }`}
                    ></div>
                </div>
            </label>
        );
    }
    return (
        <DashboardLayout>
            <div className="flex items-center gap-3 mb-2">
                <ArrowLeft className="h-5 w-5 text-gray-600 cursor-pointer" />
                <span className="text-sm text-gray-600">Back</span>
            </div>

            <div className="mx-auto p-6 p-4 bg-[white] shadow-sm border border-gray-200 rounded">
                <div className="flex items-center gap-3">
                    <div className="text-white rounded-lg p-2">
                        <Image src='/account.png' alt='account' width={30} height={30} />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Account Setting</h1>
                        <p className="text-sm text-gray-600">Manage your profile, billing, and preferences.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-6 min-h-screen">
                {/* Account Settings */}
                <div className="bg-white rounded-lg shadow-sm mb-6 p-6">

                    {/* Profile Information */}
                    <div className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                            <div className="flex items-center">
                                <Image alt="profile" src='/profile.png' width={40} height={40} className='mr-5' />
                                <span className="font-bold text-gray-700">Profile Information</span>
                            </div>
                            <button className="flex  px-4 py-2  text-gray-800 rounded-lg border border-gray-300  bg-white transition-colors font-medium">
                                <Edit className="mr-6 mt-1 w-4 h-4 mr-1" />
                                Edit
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1 font-bold">Full Name</label>
                                <div className="text-gray-900">John Doe</div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1 font-bold">Email Address</label>
                                <div className="text-gray-900 flex items-center">
                                    john.doe@company.com
                                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Verified</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1 font-bold">Company Name</label>
                                <div className="text-gray-900">Acme Corporation</div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1 font-bold">Role</label>
                                <div className="text-gray-900 font-bold">Tenant</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Plan & Usage */}
                <div className="bg-white rounded-lg shadow-sm mb-6 p-6">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-2 rounded-lg mr-3">
                                <Settings className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Plan & Usage</h3>
                                <p className="text-sm text-gray-500">Current plan: Pro Plan</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">$29/month</span>
                            <button className="px-4 py-2  text-gray-800 rounded-lg border border-gray-300  bg-white transition-colors font-medium">
                                Upgrade Plan
                            </button>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {/* Documents Used */}
                        <div>
                            <div className="flex justify-between mb-1 text-sm text-gray-700 font-medium">
                                <span>Documents Used</span>
                                <span>8 of 20</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                            </div>
                        </div>

                        {/* Mailbox Notices */}
                        <div>
                            <div className="flex justify-between mb-1 text-sm text-gray-700 font-medium">
                                <span>Mailbox Notices</span>
                                <span>2 of 5</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                            </div>
                        </div>

                        {/* Storage Used */}
                        <div>
                            <div className="flex justify-between mb-1 text-sm text-gray-700 font-medium">
                                <span>Storage Used</span>
                                <span>1.2GB of 5GB</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "24%" }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-sm text-gray-600">
                        <span className="font-medium">Next billing date:</span>{" "}
                        <span className="text-gray-900 font-semibold">January 15, 2024</span>
                    </div>
                </div>

                {/* Billing & Payment */}
                <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                        <div className="flex  items-center">
                            <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                <CreditCard className="w-5 h-5 text-purple-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Billing & Payment</h2>
                        </div>
                        <button className="px-4 py-2  text-gray-800 rounded-lg border border-gray-300  bg-white transition-colors font-medium">
                            Update Payment Info
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">Payment Method</label>
                            <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                                <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">•••• •••• •••• 4532</div>
                                    <div className="text-sm text-gray-500">Expires 05/28</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-2">Billing Address</label>
                            <div className="text-gray-900">
                                <div>billing@company.com</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <div>
                                <div className="font-medium text-gray-900">Auto-renewal</div>
                                <div className="text-sm text-gray-500">Renew your subscription automatically</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={autoRenewal}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAutoRenewal(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="text-sm text-gray-500">
                            Next charge: $29.00 on January 15, 2024
                        </div>
                    </div>
                </div>

                {/* Invoice History */}
                <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
                    <div className="flex items-center mb-4">
                        <div className="bg-orange-100 p-2 rounded-lg mr-3">
                            <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Invoice History</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 text-sm font-medium text-gray-600">Date</th>
                                    <th className="text-left py-3 text-sm font-medium text-gray-600">Amount</th>
                                    <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                                    <th className="text-left py-3 text-sm font-medium text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="py-3 text-sm text-gray-900">Jan 15, 2024</td>
                                    <td className="py-3 text-sm text-gray-900">$29.00</td>
                                    <td className="py-3">
                                        <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Paid
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center">
                                            <Download className="w-4 h-4 mr-1" />
                                            Download PDF
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3 text-sm text-gray-900">Dec 15, 2023</td>
                                    <td className="py-3 text-sm text-gray-900">$29.00</td>
                                    <td className="py-3">
                                        <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Paid
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center">
                                            <Download className="w-4 h-4 mr-1" />
                                            Download PDF
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3 text-sm text-gray-900">Nov 15, 2023</td>
                                    <td className="py-3 text-sm text-gray-900">$29.00</td>
                                    <td className="py-3">
                                        <span className="inline-flex items-center bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                            <XCircle className="w-3 h-3 mr-1" />
                                            Overdue
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center">
                                            <Download className="w-4 h-4 mr-1" />
                                            Download PDF
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3 text-sm text-gray-900">Oct 15, 2023</td>
                                    <td className="py-3 text-sm text-gray-900">$29.00</td>
                                    <td className="py-3">
                                        <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Paid
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center">
                                            <Download className="w-4 h-4 mr-1" />
                                            Download PDF
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {/* Header */}
                    <div className="flex items-center mb-4">
                        <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                            <Bell className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                    </div>

                    {/* Notice */}
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mb-5 text-sm text-gray-700">
                        <span className="font-medium">Legal notices cannot be disabled</span> as they are required for compliance and tenant protection.
                    </div>

                    {/* Notification Options */}
                    <div className="space-y-5">
                        {/* Lease Events */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Mail className="w-5 h-5 text-blue-500 mr-3" />
                                <div>
                                    <div className="font-medium text-gray-900">Lease Events</div>
                                    <div className="text-sm text-gray-500">
                                        Get notified about lease status changes, approvals, and updates
                                    </div>
                                </div>
                            </div>
                            <Switch isOn={true} />
                        </div>

                        {/* Legal Notices */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FileWarning className="w-5 h-5 text-red-500 mr-3" />
                                <div>
                                    <div className="font-medium text-gray-900">Legal Notices</div>
                                    <div className="text-sm text-gray-500">
                                        Critical notifications about terminations, evictions, and legal documents
                                    </div>
                                </div>
                            </div>
                            <Switch isOn={false} disabled />
                        </div>

                        {/* Comment Mentions */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <MessageCircle className="w-5 h-5 text-green-500 mr-3" />
                                <div>
                                    <div className="font-medium text-gray-900">Comment Mentions</div>
                                    <div className="text-sm text-gray-500">
                                        When someone mentions you in lease comments or discussions
                                    </div>
                                </div>
                            </div>
                            <Switch isOn={false} />
                        </div>

                        {/* Renewals & Deadlines */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <CalendarCheck className="w-5 h-5 text-purple-500 mr-3" />
                                <div>
                                    <div className="font-medium text-gray-900">Renewals & Deadlines</div>
                                    <div className="text-sm text-gray-500">
                                        Reminders about lease renewals, payment due dates, and important deadlines
                                    </div>
                                </div>
                            </div>
                            <Switch isOn={true} />
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default Setting;