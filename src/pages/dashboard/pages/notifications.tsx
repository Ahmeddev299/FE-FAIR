"use client";

import React, { useState, useEffect } from "react";
import { Bell, Mail, FileWarning, MessageCircle, CalendarCheck } from "lucide-react";
import Switch from "@/components/setting/Switch";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardLayout } from "@/components/layouts";

export type NotificationPrefs = {
  leaseEvents: boolean;
  legalNotices: boolean; // shown but locked disabled
  mentions: boolean;
  renewals: boolean;
};

type NotificationPreferencesProps = {
  initial?: Partial<NotificationPrefs>;
  onChange?: (prefs: NotificationPrefs) => void;
};

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ initial, onChange }) => {
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    leaseEvents: initial?.leaseEvents ?? true,
    legalNotices: initial?.legalNotices ?? false, // cannot be disabled, but we display it disabled
    mentions: initial?.mentions ?? false,
    renewals: initial?.renewals ?? true,
  });

  useEffect(() => {
    onChange?.(prefs);
  }, [prefs, onChange]);

  return (
    <DashboardLayout>
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
        <span className="font-medium">Legal notices cannot be disabled</span> as they are required for
        compliance and tenant protection.
      </div>

      {/* Options */}
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
          <Switch
            isOn={prefs.leaseEvents}
            onChange={(checked) => setPrefs((p) => ({ ...p, leaseEvents: checked }))}
            ariaLabel="Toggle lease events"
          />
        </div>

        {/* Legal Notices (disabled) */}
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
          <Switch isOn={false} disabled ariaLabel="Legal notices (locked)" />
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
          <Switch
            isOn={prefs.mentions}
            onChange={(checked) => setPrefs((p) => ({ ...p, mentions: checked }))}
            ariaLabel="Toggle mention notifications"
          />
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
          <Switch
            isOn={prefs.renewals}
            onChange={(checked) => setPrefs((p) => ({ ...p, renewals: checked }))}
            ariaLabel="Toggle renewals and deadlines"
          />
        </div>
      </div>
       
    </div>

    </DashboardLayout>
  );
};

export default NotificationPreferences;
