// src/components/models/ClauseDetailsModel.tsx
import React, { useEffect } from 'react';
import { X, History, Check, MessageSquare, AlertTriangle } from 'lucide-react';
import { ExtendedClause } from '@/types/loi';


interface ClauseDetailsModelProps {
  onClose: () => void;
  clause: ExtendedClause;
  newComment: string;
  setNewComment: (value: string) => void;
  handleAddComment: () => void;
}

export default function ClauseDetailsModel({
  onClose,
  clause,
  newComment,
  setNewComment,
  handleAddComment,
}: ClauseDetailsModelProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const displayStatus = clause.status ?? 'pending';
  const displayRisk = clause.risk ?? 'Low';

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-white/20 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4">
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              {/* <h2 className="text-lg font-semibold">{clause.name ?? clause.title ?? 'Clause'}</h2> */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">{displayStatus}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {displayRisk}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                <History className="h-4 w-4" />
                History
              </button>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Clause text sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Original</h3>
                <p className="text-sm text-gray-700">{clause.originalText ?? '—'}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">AI Suggested</h3>
                <p className="text-sm text-gray-700">{clause.aiSuggestion ?? '—'}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Current</h3>
                <p className="text-sm text-gray-700">{clause.currentVersion ?? '—'}</p>
              </div>
            </div>

            {/* Comments */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-4 w-4 text-gray-600" />
                <h3 className="font-medium text-gray-900">Comments</h3>
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleAddComment}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Comment
                </button>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex justify-end mt-6 space-x-3">
              <button className="flex items-center px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 text-sm">
                <X className="w-4 h-4 mr-2" />
                Reject
              </button>
              <button className="flex items-center px-4 py-2 border border-yellow-500 text-yellow-700 bg-yellow-50 rounded-md hover:bg-yellow-100 text-sm">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Request Review
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                <Check className="w-4 h-4 mr-2" />
                Approve
              </button>
            </div>

            {/* Meta */}
            {(clause.lastEdited || clause.editor) && (
              <div className="mt-6 pt-4 border-t border-gray-200 text-right">
                <p className="text-xs text-gray-500">
                  Last edited {clause.lastEdited ?? '—'} {clause.editor ? `by ${clause.editor}` : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
