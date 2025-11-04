"use client";

import React from "react";
import { CheckCircle, CreditCard, Download, FileText} from "lucide-react";
import Switch from "@/components/setting/Switch";
import { DashboardLayout } from "@/components/layouts";

type BillingAndPaymentProps = {
  autoRenewal: boolean;
  onAutoRenewalChange: (value: boolean) => void;
  nextChargeText?: string; 
};

const BillingAndPayment: React.FC<BillingAndPaymentProps> = ({
  autoRenewal,
  onAutoRenewalChange,
  nextChargeText = "Next charge: $29.00 on January 15, 2024",
}) => {
  return (
    <DashboardLayout>
    <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center">
          <div className="bg-purple-100 p-2 rounded-lg mr-3">
            <CreditCard className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Billing & Payment</h2>
        </div>
        <button className="px-4 py-2 text-gray-800 rounded-lg border border-gray-300 bg-white transition-colors font-medium">
          Update Payment Info
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Payment Method */}
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

        {/* Billing Address */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">Billing Address</label>
          <div className="text-gray-900">
            <div>billing@company.com</div>
          </div>
        </div>

        {/* Auto-renewal */}
        <div className="flex items-center justify-between py-2">
          <div>
            <div className="font-medium text-gray-900">Auto-renewal</div>
            <div className="text-sm text-gray-500">Renew your subscription automatically</div>
          </div>
          <Switch
            isOn={autoRenewal}
            onChange={onAutoRenewalChange}
            ariaLabel="Toggle auto-renewal"
          />
        </div>

        <div className="text-sm text-gray-500">{nextChargeText}</div>
      </div>        
    </div>
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
                {/* ...more rows... */}
              </tbody>
            </table>
          </div>
        </div>
        
    </DashboardLayout>
  );
};

export default BillingAndPayment;
