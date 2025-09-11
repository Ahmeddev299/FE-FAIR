// LeaseDetailsModal.tsx
import { X, Pencil, MessageSquare } from "lucide-react";
import type { Clause, Lease } from "@/types/loi"; // 👈 reuse your shared types

interface LeaseDetailsModalProps {
  lease: Lease;
  onClose: () => void;
  onEdit: (clause: Clause) => void;
  onComment: (clause: Clause) => void;
}

export default function LeaseDetailsModal({
  lease,
  onClose,
  onEdit,
  onComment,
}: LeaseDetailsModalProps) {
  if (!lease) return null;

  const { clauses } = lease;

  // filter out metadata keys like "_clause_log_id"
  const clauseEntries = Object.entries(clauses).filter(
    ([key]) => !key.startsWith("_")
  ) as [string, Clause][]; // 👈 tell TS that entries are [name, Clause]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">{lease.title}</h2>
            <p className="text-sm text-gray-500">{lease.property_address}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Clauses */}
        <div className="divide-y">
          {clauseEntries.map(([name, clause]) => (
            <div key={name} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(clause)} // 👈 now clause: Clause
                    className="px-2 py-1 text-xs flex items-center gap-1 rounded border hover:bg-gray-100"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => onComment(clause)} // 👈 clause is typed
                    className="px-2 py-1 text-xs flex items-center gap-1 rounded border hover:bg-gray-100"
                  >
                    <MessageSquare className="h-3 w-3" /> Comment
                  </button>
                </div>
              </div>
              {/* <p className="text-sm text-gray-700 mb-1">
                <strong>Clause:</strong> {clause.clause_details}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>AI Suggestion:</strong> {clause.ai_suggested_clause_details}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Current:</strong> {clause.current_version}
              </p> */}
              <p className="text-sm text-gray-500">
                <strong>Status:</strong> {clause.status} |{" "}
                <strong>Risk:</strong> {clause.risk}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}