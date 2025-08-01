// components/AIBenefits.tsx
import React from 'react';
import Image from 'next/image';
import { CheckCircle, Bell } from 'lucide-react';

export const AIBenefits: React.FC = () => (
    <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-blue-900 mb-4 flex items-center">
            <Image alt="ai" src="/ai.png" height={30} width={30} className='mr-3 flex-shrink-0' />
            <span className="flex-1">AI Processing Benefits</span>
        </h2>

        <div className="space-y-3">
            <div className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-800">Automatically extract key lease terms and dates</span>
            </div>
            <div className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-800">Identify important clauses and potential issues</span>
            </div>
            <div className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-800">Generate summary and recommendations</span>
            </div>
            <div className="flex items-start">
                <Bell className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-800">Set up automated reminders and alerts</span>
            </div>
        </div>
    </div>
);