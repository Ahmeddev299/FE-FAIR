import React, { useState } from 'react';
import {
    User,
    CreditCard,
    FileText,
    Bell,
    Edit,
    Download,
    CheckCircle,
    XCircle,
    Calendar,
    Mail,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';
import Image from 'next/image';

interface NotificationSettings {
    leadEvents: boolean;
    legalNotices: boolean;
    contractReminders: boolean;
    renewalsDeadlines: boolean;
}

const Setting: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationSettings>({
        leadEvents: true,
        legalNotices: true,
        contractReminders: false,
        renewalsDeadlines: true
    });

    const [autoRenewal, setAutoRenewal] = useState<boolean>(true);

    const handleNotificationChange = (key: keyof NotificationSettings): void => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <DashboardLayout>
            <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <User className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
                <span className="text-sm text-gray-500 ml-2">Manage your profile, billing, and preferences</span>
            </div>

            <div className="max-w-4xl mx-auto p-6 min-h-screen">
                {/* Account Settings */}
                <div className="bg-white rounded-lg shadow-sm mb-6 p-6">

                    {/* Profile Information */}
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center">
                                <Image alt="profile" src='/profile.png' width={40} height={40} className='mr-5' />
                                <span className="font-bold text-gray-700">Profile Information</span>
                            </div>
                            <button className="flex items-center text-blue-600 hover:text-blue-700">
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <Image alt="plan" src='/plan.png' width={40} height={40} className='mr-5' />
                            <h2 className="text-lg font-bold text-gray-900">Plan & Usage</h2>
                            <span className="text-sm text-gray-500 ml-2">Current plan and usage</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Upgrade Plan
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 font-semibold">Current Plan</span>
                            <span className="text-gray-900">Pro</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 font-semibold">Monthly Queries</span>
                            <span className="font-medium text-gray-900">2 of 5</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 font-semibold">Storage Used</span>
                            <span className="font-medium text-gray-900">1.2TB of 5TB</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 font-semibold">Next billing date</span>
                            <span className="font-medium text-gray-900">January 15, 2024</span>
                        </div>
                    </div>
                </div>

                {/* Billing & Payment */}
                <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                <CreditCard className="w-5 h-5 text-purple-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Billing & Payment</h2>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
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

                    <div className="overflow-hidden">
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
                    <div className="flex items-center mb-4">
                        <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                            <Bell className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 mb-4">
                            Legal advice cannot be disabled as they are required for compliance and future protections.
                        </p>

                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center">
                                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                    <div className="font-medium text-gray-900">Lead Events</div>
                                    <div className="text-sm text-gray-500">Get notified about lead changes, approvals, and updates</div>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notifications.leadEvents}
                                    onChange={() => handleNotificationChange('leadEvents')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center">
                                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                    <div className="font-medium text-gray-900">Legal Notices</div>
                                    <div className="text-sm text-gray-500">Important notifications about license terms, warnings, and legal matters</div>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notifications.legalNotices}
                                    onChange={() => handleNotificationChange('legalNotices')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center">
                                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                    <div className="font-medium text-gray-900">Contract Reminders</div>
                                    <div className="text-sm text-gray-500">When contractors expire and it is times to renewal or discussions</div>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notifications.contractReminders}
                                    onChange={() => handleNotificationChange('contractReminders')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center">
                                <Bell className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                    <div className="font-medium text-gray-900">Renewals & Deadlines</div>
                                    <div className="text-sm text-gray-500">Notifications about license renewals, payment due dates, and important deadlines</div>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notifications.renewalsDeadlines}
                                    onChange={() => handleNotificationChange('renewalsDeadlines')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Setting;