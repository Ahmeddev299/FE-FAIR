import React from "react";
import { AlertTriangle, Save, X, Check, Edit3 } from "lucide-react";
import { Card, RiskPill, StatusBadge } from "./ui";
import { ClauseData } from "@/types/loi";

type Props = {
  clauseName: string;
  clause: ClauseData;
  editing: boolean;
  editedContent: string;
  onChangeEditedContent: (v: string) => void;

  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEdit: () => void;
  onAccept: () => void;
  onReject: () => void;
};

const ClauseDetail: React.FC<Props> = ({
  clauseName,
  clause,
  editing,
  editedContent,
  onChangeEditedContent,
  onSaveEdit,
  onCancelEdit,
  onEdit,
  onAccept,
  onReject,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{clauseName}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <RiskPill risk={clause.risk} />
              <StatusBadge status={clause.status} />
            </div>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={onSaveEdit}
                  className="px-3 py-1.5 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
                >
                  <Save className="inline-block w-4 h-4 mr-1" />
                  Save
                </button>
                <button
                  onClick={onCancelEdit}
                  className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  <X className="inline-block w-4 h-4 mr-1" />
                  Cancel
                </button>
              </>
            ) : null}
          </div>
        </div>
      </Card>

      {/* Original + AI Suggested */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-gray-900">Original Clause</span>
          </div>
          {editing ? (
            <textarea
              value={editedContent}
              onChange={(e) => onChangeEditedContent(e.target.value)}
              rows={10}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-700 text-sm whitespace-pre-line">{clause.current_version}</p>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] font-semibold">
              AI
            </span>
            <span className="text-sm font-semibold text-gray-900">AI Suggested Clause</span>
          </div>
          <p className="text-gray-700 text-sm whitespace-pre-line">
            {clause.ai_suggested_clause_details}
          </p>
        </Card>
      </div>

      {/* AI Analysis */}
      <Card className="p-5 border-yellow-200 bg-yellow-50">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <span className="text-yellow-700 font-semibold text-sm">AI Analysis & Recommendations</span>
        </div>
        {clause.clause_details && (
          <p className="text-sm text-gray-800">{clause.clause_details}</p>
        )}
      </Card>

      {/* Actions */}
      <div className="w-full rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Reject */}
          <button
            type="button"
            onClick={onReject}
            aria-label="Reject suggestion"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 text-sm font-medium text-red-700 shadow-sm transition
              hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reject</span>
          </button>

          {/* Edit */}
          {!editing && (
            <button
              type="button"
              onClick={onEdit}
              aria-label="Edit clause"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-800 shadow-sm transition
                hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            >
              <Edit3 className="h-3.5 w-3.5 text-gray-700" />
              <span>Edit</span>
            </button>
          )}

          {/* Accept Suggestion */}
          <button
            type="button"
            onClick={onAccept}
            aria-label="Accept AI suggestion"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-green-600 px-3 text-sm font-semibold text-white shadow-sm transition
              hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/60"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Accept Suggestion</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClauseDetail;
