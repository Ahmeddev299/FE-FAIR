/* eslint-disable @typescript-eslint/no-explicit-any */

// components/ClausesList.tsx
import React from "react";
import { FileText } from "lucide-react";
import { ClauseCard } from "@/components/dashboard/lease/utils/ClauseCard";

interface ClausesListProps {
  clauses: any[];
  section: string;
  onClauseClick: (clause: any) => void;
  onClick?: () => void; // ✅ Made optional
}

export const ClausesList: React.FC<ClausesListProps> = ({
  clauses,
  section,
  onClauseClick,
}) => {
  // ✅ Placeholder functions for ClauseCard required props
  const handleAccept = (id: string) => {
    console.log("Accept clause:", id);
    // Implement accept logic if needed
  };

  const handleReject = (id: string) => {
    console.log("Reject clause:", id);
    // Implement reject logic if needed
  };

  const handleComment = (id: string, text: string) => {
    console.log("Comment on clause:", id, text);
    // Implement comment logic if needed
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Lease Clauses</h2>
      <p className="text-sm text-gray-500 mb-6">{clauses.length} clauses</p>

      {clauses.length === 0 ? (
        <EmptyState section={section} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clauses.map((clause) => (
            <div key={clause.id} className="relative">
              <ClauseCard
                clause={clause}
                onAccept={handleAccept}
                onReject={handleReject}
                onComment={handleComment}
                accepting={false}
                onOpenDetails={onClauseClick}
              />
              {/* Visual indicator for status changes */}
              {clause.status === "approved" && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
              {clause.status === "rejected" && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EmptyState: React.FC<{ section: string }> = ({ section }) => (
  <div className="text-center py-12">
    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Clauses Found</h3>
    <p className="text-gray-600">This section does not have any clauses yet.</p>
    <p className="text-sm text-gray-500 mt-2">Section: {section}</p>
  </div>
);