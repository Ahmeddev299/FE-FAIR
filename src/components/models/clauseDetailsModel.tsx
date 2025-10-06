// src/components/models/ClauseDetailsModel.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { X, History, Check, AlertTriangle, Pencil } from 'lucide-react';
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
  clause: ExtendedClause;
  history?: ClauseHistoryEntry;

  onApprove?: () => void;
  onReject?: () => void;

  // Saves edited "Current Version"
  onSaveCurrentVersion?: (text: string) => Promise<boolean | void>;

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
  onAddComment,
  onSaveCurrentVersion,
}: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  const initialComments = useMemo<ClauseHistoryComment[]>(
    () => (Array.isArray(history?.comment) ? history!.comment : []),
    [history]
  );
  const [localComments, setLocalComments] = useState<ClauseHistoryComment[]>(initialComments);
  useEffect(() => setLocalComments(initialComments), [initialComments]);

  const displayStatus = history?.status ?? clause.status ?? 'Pending';
  const displayRisk = history?.risk ?? clause.risk ?? 'Low';
  const originalText = history?.clause_details ?? clause.originalText ?? clause.currentVersion ?? '—';
  const aiSuggested = history?.ai_suggested_clause_details ?? clause.aiSuggestion ?? '—';
  const initialCurrent = history?.current_version ?? clause.currentVersion ?? '';

  // ===== Editable current version state =====
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState<string>(initialCurrent);
  const [isSaving, setIsSaving] = useState(false);

  // keep currentText in sync when clause/history changes (e.g. after save/refresh)
  useEffect(() => {
    setCurrentText(initialCurrent);
    setIsEditing(false);
    setIsSaving(false);
  }, [initialCurrent]);

  const initialCurrentRef = useRef(initialCurrent);
  useEffect(() => { initialCurrentRef.current = initialCurrent; }, [initialCurrent]);

  const hasUnsaved = currentText !== initialCurrentRef.current;

  const aiScore =
    typeof history?.ai_confidence_score === 'number'
      ? `${Math.round(history.ai_confidence_score * 100)}%`
      : undefined;

  const handleSubmitComment = async () => {
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

  const handleSaveCurrent = async () => {
    if (!onSaveCurrentVersion || !hasUnsaved) return;
    setIsSaving(true);
    try {
      await onSaveCurrentVersion(currentText);
 
      initialCurrentRef.current = currentText;
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApprove = async () => {
    // If user edited but didn’t save, save first; then approve.
    if (onSaveCurrentVersion && hasUnsaved) {
      setIsSaving(true);
      try {
        await onSaveCurrentVersion(currentText);
        initialCurrentRef.current = currentText;
      } finally {
        setIsSaving(false);
      }
    }
    onApprove?.();
  };

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

                  {onSaveCurrentVersion && (
                    <button
                      type="button"
                      onClick={() => setIsEditing((v) => !v)}
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{currentText || '—'}</p>
                ) : (
                  <>
                    <textarea
                      value={currentText}
                      onChange={(e) => setCurrentText(e.target.value)}
                      rows={8}
                      className="w-full p-3 border border-emerald-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      placeholder="Edit the current version..."
                    />
                    <div className="mt-2 flex items-center justify-end gap-2">
                      <span className="text-xs text-gray-400">{currentText.length} chars</span>
                      <button
                        type="button"
                        onClick={handleSaveCurrent}
                        disabled={isSaving || !hasUnsaved}
                        className="px-3 py-1.5 text-xs rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        {isSaving ? 'Saving…' : 'Save'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

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
                      onClick={handleSubmitComment}
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
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm disabled:opacity-60"
                onClick={handleApprove}
                type="button"
                disabled={isSaving}
                title={isSaving ? 'Saving edits…' : 'Approve'}
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
