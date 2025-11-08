// components/ClauseSection.tsx
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ClauseCategory } from "@/components/dashboard/lease/utils/ClauseCategory";
import { Clause } from "@/types/lease";

// ✅ Fixed Props interface
type Props = {
    title: string;
    clauses: Clause[];
    defaultCount?: number;
    acceptingId?: string | null;  // Changed from optional to explicitly allow null
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
    onComment: (id: string, text: string) => void;
    onOpenDetails: (clause: Clause) => void;  // ✅ Added missing prop
};

export const ClauseSection: React.FC<Props> = ({
    title,
    clauses,
    defaultCount = 4,
    onOpenDetails,
    acceptingId = null,  // ✅ Provide default value
    onAccept,
    onReject,
    onComment,
}) => {
    const [showAll, setShowAll] = useState(false);
    if (!clauses?.length) return null;

    const visible = showAll ? clauses : clauses.slice(0, defaultCount);

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                    {title}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                        ({clauses.length})
                    </span>
                </h2>
                {clauses.length > defaultCount && (
                    <button
                        onClick={() => setShowAll(v => !v)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                    >
                        {showAll ? (
                            <>
                                Show less <ChevronUp className="w-4 h-4" />
                            </>
                        ) : (
                            <>
                                Show all <ChevronDown className="w-4 h-4" />
                            </>
                        )}
                    </button>
                )}
            </div>

            <ClauseCategory
                category={title}
                clauses={visible}
                onAccept={onAccept}
                onReject={onReject}
                onComment={onComment}
                acceptingId={acceptingId}
                onOpenDetails={onOpenDetails}
            />
        </section>
    );
};