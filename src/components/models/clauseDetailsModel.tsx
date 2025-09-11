// src/components/models/ClauseDetailsModel.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { X, History, Check, AlertTriangle } from 'lucide-react';
import type { ExtendedClause } from '@/types/loi';

export type ClauseHistoryComment = {
  text: string;
  author?: string;
  created_at?: string;
};

export type ClauseHistoryEntry = {
  status?: string;
  clause_details?: string;
  current_version?: string;
  ai_confidence_score?: number;
  ai_suggested_clause_details?: string;
  comment?: ClauseHistoryComment[];
  risk?: string;
  risk_line?: string;
  Recommendation?: string;
  Analysis?: string;
  compare_loi_vs_lease?: string;
  accepted_ai?: boolean;
  created_at?: string;
  updated_at?: string;
};

type Props = {
  onClose: () => void;
  clause: ExtendedClause; // parent ensures this exists (it already gates rendering)
  history?: ClauseHistoryEntry;
  onApprove?: () => void;
  onReject?: () => void;
  onRequestReview?: () => void;

  // Return the created comment so modal can append locally
  onAddComment?:
    | ((text: string) => Promise<ClauseHistoryComment | undefined>)
    | ((text: string) => ClauseHistoryComment | undefined);
};

export default function ClauseDetailsModel({
  onClose,
  clause,
  history,
  onApprove,
  onReject,
  onRequestReview,
  onAddComment,
}: Props) {
  // Hooks must always run; don't early-return before these.
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  // Initialize comments from API history
  const initialComments = useMemo<ClauseHistoryComment[]>(
    () => (Array.isArray(history?.comment) ? history!.comment : []),
    [history]
  );

  // Keep comments local to modal (don’t mutate clause/UIClause types)
  const [localComments, setLocalComments] = useState<ClauseHistoryComment[]>(initialComments);

  // Reset local comments when clause/history changes
  useEffect(() => {
    setLocalComments(initialComments);
  }, [initialComments]);

  const handleSubmit = async () => {
    const text = commentText.trim();
    if (!text || !onAddComment) return;
    setSubmitting(true);
    try {
      const created = await onAddComment(text);
      if (created) setLocalComments((prev) => [...prev, created]);
      setCommentText('');
    } finally {
      setSubmitting(false);
    }
  };

  // Derived fields (prefer history when present)
  const displayStatus = history?.status ?? clause.status ?? 'Pending';
  const displayRisk = history?.risk ?? clause.risk ?? 'Low';
  const originalText = history?.clause_details ?? clause.originalText ?? clause.currentVersion ?? '—';
  const aiSuggested  = history?.ai_suggested_clause_details ?? clause.aiSuggestion ?? '—';
  const currentVersion = history?.current_version ?? clause.currentVersion ?? '—';

  const aiScore =
    typeof history?.ai_confidence_score === 'number'
      ? `${Math.round(history.ai_confidence_score * 100)}%`
      : undefined;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4">
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold">{clause.name ?? clause.title ?? 'Clause'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600 capitalize">{String(displayStatus)}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {String(displayRisk)}
                </span>
                {aiScore && (
                  <>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      AI confidence {aiScore}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHistory((v) => !v)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                type="button"
              >
                <History className="h-4 w-4" />
                {showHistory ? 'Hide History' : 'History'}
              </button>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600" type="button">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
            {/* Text panels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Original Clause</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{originalText}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">AI Suggested</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{aiSuggested}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Current Version</h3>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{currentVersion}</p>
              </div>
            </div>

            {/* History details */}
            {showHistory && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history?.risk_line && (
                  <div className="border border-gray-200 rounded p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Risk Line</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{history.risk_line}</p>
                  </div>
                )}

                {history?.Recommendation && (
                  <div className="border border-gray-200 rounded p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Recommendation</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{history.Recommendation}</p>
                  </div>
                )}

                {history?.Analysis && (
                  <div className="border border-gray-200 rounded p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Analysis</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{history.Analysis}</p>
                  </div>
                )}

                {history?.compare_loi_vs_lease && (
                  <div className="border border-gray-200 rounded p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Compare LOI vs Lease</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{history.compare_loi_vs_lease}</p>
                  </div>
                )}

                {(history?.created_at || history?.updated_at) && (
                  <div className="border border-gray-200 rounded p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Timestamps</h4>
                    <div className="text-xs text-gray-600">
                      {history.created_at && <>Created: {new Date(history.created_at).toLocaleString()}</>}
                      {history.created_at && history.updated_at && <br />}
                      {history.updated_at && <>Updated: {new Date(history.updated_at).toLocaleString()}</>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Comments */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Comments ({localComments.length})</h3>
              </div>

              <div className="space-y-3">
                {localComments.length === 0 && <div className="text-sm text-gray-500">No comments yet.</div>}
                {localComments.map((cm, i) => (
                  <div key={`${cm.created_at ?? i}-${i}`} className="border border-gray-200 rounded p-3">
                    <div className="text-sm text-gray-800 whitespace-pre-wrap">{cm.text}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      {cm.author ? cm.author : 'by System'}
                      {cm.created_at ? ` • ${new Date(cm.created_at).toLocaleString()}` : ''}
                    </div>
                  </div>
                ))}
              </div>

              {onAddComment && (
                <div className="mt-4">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment…"
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || !commentText.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-60"
                      type="button"
                    >
                      {submitting ? 'Adding…' : 'Add Comment'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="flex justify-end mt-2 space-x-3">
              <button
                className="flex items-center px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 text-sm"
                onClick={onReject}
                type="button"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </button>
              <button
                className="flex items-center px-4 py-2 border border-yellow-500 text-yellow-700 bg-yellow-50 rounded-md hover:bg-yellow-100 text-sm"
                onClick={onRequestReview}
                type="button"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Request Review
              </button>
              <button
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                onClick={onApprove}
                type="button"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}