"use client";

import React from "react";
import {
  Settings,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { DashboardLayout } from "@/components/layouts";

const Setting: React.FC = () => {

  return (
    <DashboardLayout>
      {/* Back Row */}
      <div className="flex items-center gap-3 mb-2">
        <ArrowLeft className="h-5 w-5 text-gray-600 cursor-pointer" />
        <span className="text-sm text-gray-600">Back</span>
      </div>

      {/* Header Card */}
      <div className="mx-auto p-6 bg-white shadow-sm border border-gray-200 rounded">
        <div className="flex items-center gap-3">
          <div className="text-white rounded-lg p-2">
            <Image src="/account.png" alt="account" width={30} height={30} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Account Setting</h1>
            <p className="text-sm text-gray-600">Manage your profile, billing, and preferences.</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 min-h-screen">
        {/* Account Settings (Profile) */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div className="flex items-center">
                <Image alt="profile" src="/profile.png" width={40} height={40} className="mr-5" />
                <span className="font-bold text-gray-700">Profile Information</span>
              </div>
              <button className="px-4 py-2 text-gray-800 rounded-lg border border-gray-300 bg-white transition-colors font-medium">
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

        {/* Plan & Usage (unchanged) */}
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
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                $29/month
              </span>
              <button className="px-4 py-2 text-gray-800 rounded-lg border border-gray-300 bg-white transition-colors font-medium">
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
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "40%" }} />
              </div>
            </div>

            {/* Mailbox Notices */}
            <div>
              <div className="flex justify-between mb-1 text-sm text-gray-700 font-medium">
                <span>Mailbox Notices</span>
                <span>2 of 5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "40%" }} />
              </div>
            </div>

            {/* Storage Used */}
            <div>
              <div className="flex justify-between mb-1 text-sm text-gray-700 font-medium">
                <span>Storage Used</span>
                <span>1.2GB of 5GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "24%" }} />
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <span className="font-medium">Next billing date:</span>{" "}
            <span className="text-gray-900 font-semibold">January 15, 2024</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Setting;
