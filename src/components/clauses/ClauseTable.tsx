// src/components/clauses/ClauseTable.tsx
import { useState, useMemo } from 'react';
import { Clause } from '@/types/loi';
import { StatusBadge } from '../dashboard/StatusBadge';
import RiskBadge from './RiskBadge';
import CommentPill from './CommenPill';
import { Check, EditIcon, Eye, MessageSquare, Sparkles, X } from 'lucide-react';

type Props = {
    clauses: any;
    onEdit(clause: Clause): void;
    onApprove?(clause: Clause): void;
    onAcceptAI?(clause: Clause): void;
};

// Helper function to extract numeric risk value
const extractRiskValue = (riskString: string): number => {
    if (!riskString) return 2; // Default to Low risk (2/10)

    const match = riskString.match(/\((\d+)\/10\)/);
    if (match) {
        return parseInt(match[1], 10);
    }

    // Fallback mapping for text-based risk
    const riskLower = riskString.toLowerCase();
    if (riskLower.includes('high')) return 8;
    if (riskLower.includes('medium')) return 5;
    if (riskLower.includes('low')) return 2;

    return 2; // Default to low
};

// Helper function to get risk category from numeric value
const getRiskCategory = (value: number): string => {
    if (value >= 8) return 'High';
    if (value >= 5) return 'Medium';
    return 'Low';
};

const getStatusPriority = (status: string): number => {
    const priorities = {
        'pending': 1,
        'review': 2,
        'edited': 3,
        'suggested': 4,
        'approved': 5
    };
    return priorities[status.toLowerCase()] || 1;
};

export default function ClauseTable({ clauses, onViewDetails, onApprove, onAcceptAI }: Props) {
    const [editingClause, setEditingClause] = useState<Clause | null>(null);

    console.log('Full clauses object:', clauses);
    console.log('clauses.data:', clauses?.data);
    console.log('clauses.data[0]:', clauses?.data?.[0]);

    // Get the actual clause data from your structure
    const getClauseData = () => {
        if (!clauses?.data?.[0]) return [];

        const dataObject = clauses.data[0];
        const clauseKeys = [
            'Additional Conditions',
            'End Date',
            'Lease Duration',
            'Lease Type',
            'Monthly Rent',
            'Property Address',
            'Renewal Options',
            'Security Deposit',
            'Start Date'
        ];

        return clauseKeys
            .filter(key => dataObject[key])
            .map(key => ({
                title: key,
                ...dataObject[key]
            }));
    };

    const clauseData = getClauseData();
    console.log('Processed clause data:', clauseData);

    // Calculate overall risk and status
    const { overallRisk, overallStatus } = useMemo(() => {
        if (!clauseData.length) {
            return { overallRisk: 'Low (2/10)', overallStatus: 'pending' };
        }

        let totalRiskValue = 0;
        let validRiskCount = 0;
        let highestPriority = 0;
        let statusWithHighestPriority = 'pending';

        clauseData.forEach(clause => {
            // Calculate risk
            if (clause.risk) {
                totalRiskValue += extractRiskValue(clause.risk);
                validRiskCount++;
            }

            // Calculate status priority
            if (clause.status) {
                const priority = getStatusPriority(clause.status);
                if (priority > highestPriority) {
                    highestPriority = priority;
                    statusWithHighestPriority = clause.status;
                }
            }
        });

        const averageRisk = validRiskCount > 0 ? Math.round(totalRiskValue / validRiskCount) : 2;
        const riskCategory = getRiskCategory(averageRisk);
        const overallRiskString = `${riskCategory} (${averageRisk}/10)`;

        return {
            overallRisk: overallRiskString,
            overallStatus: statusWithHighestPriority
        };
    }, [clauseData]);

    const handleEdit = (clause: Clause) => {
        setEditingClause(clause);
    };


    return (
        <>
            {/* Overall Risk and Status Display */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">Overall Risk:</span>
                            <RiskBadge risk={overallRisk} />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">Overall Status:</span>
                            <StatusBadge status={overallStatus} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="hidden md:block px-4 xl:px-6 py-3 bg-white border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-4 xl:gap-6 text-sm font-medium text-gray-700">
                        <div className="col-span-3">Clause</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1">Risk</div>
                        <div className="col-span-3">Comments</div>
                        <div className="col-span-3">Actions</div>
                    </div>
                </div>
                <div className="divide-y divide-gray-200">
                    {clauses.data.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No clause data available. Check console for debug info.
                        </div>
                    ) : (
                        clauses.data.map((clause, index) => (
                            <div key={clause.title || index} className="p-4 xl:pl-6 xl:py-5 hover:bg-gray-50 transition">
                                <div className="grid grid-cols-1 md:grid-cols-12 md:gap-4 xl:gap-6 gap-y-3 md:items-center">
                                    <div className="md:col-span-3 truncate">
                                        <div className="font-medium text-gray-900 truncate">{clause.title}</div>
                                        {clauses.data[0].property_address && (
                                            <div className="text-sm text-gray-500 truncate">
                                                {clauses.data[0].property_address}
                                            </div>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <StatusBadge status={clause?.status || 'pending'} />
                                    </div>

                                    <div className="md:col-span-1">
                                        <RiskBadge risk={clause?.risk || 'Low (2/10)'} />
                                    </div>

                                    <div className="md:col-span-3">
                                        <CommentPill count={clause?.comment?.length || 0} />
                                    </div>

                                    <div className="md:col-span-3">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {clause.status === 'Suggested' && onAcceptAI && (
                                                <button
                                                    onClick={() => onAcceptAI(clause)}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 flex items-center gap-1"
                                                >
                                                    <Sparkles className="h-4 w-4" />
                                                    <span>Accept AI</span>
                                                </button>
                                            )}
                                            {(clause.status === 'Edited' || clause.status === 'Review') && onApprove && (
                                                <button
                                                    onClick={() => onApprove(clause)}
                                                    className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 flex items-center gap-1"
                                                >
                                                    <Check className="h-4 w-4" />
                                                    <span>Approve</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => onViewDetails(clause)}
                                                className="px-3 py-1.5 text-sm rounded-lg border flex items-center gap-1 hover:bg-gray-100"
                                            >
                                                <Eye className="h-4 w-4" /> View Details
                                            </button>

                                        </div>
                                    </div>


                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </>
    );
}