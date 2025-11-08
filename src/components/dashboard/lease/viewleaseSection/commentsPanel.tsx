/* eslint-disable @typescript-eslint/no-explicit-any */

// components/CommentsPanel.tsx
import React from "react";
import { CommentItem } from "./commentItem";

interface CommentsPanelProps {
  comments: any[];
  commentText: string;
  loading: boolean;
  onCommentChange: (text: string) => void;
  onAddComment: () => void;
}

export const CommentsPanel: React.FC<CommentsPanelProps> = ({
  comments,
  commentText,
  loading,
  onCommentChange,
  onAddComment,
}) => {
  return (
    <div className="w-80">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-1">Comments</h3>
        <p className="text-sm text-gray-500 mb-4">
          {comments.length} comments on this clause
        </p>

        <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
          {comments.map((comment, idx) => (
            <CommentItem key={idx} comment={comment} />
          ))}
        </div>

        <div>
          <textarea
            value={commentText}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none"
            rows={3}
          />
          <button
            onClick={onAddComment}
            disabled={loading || !commentText.trim()}
            className="mt-2 w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
};