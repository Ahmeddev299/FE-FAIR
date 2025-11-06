// components/CommentItem.tsx
import React from "react";

interface CommentItemProps {
  comment: {
    author: string;
    text: string;
    created_at: string;
  };
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <div className="text-sm">
      <p className="font-medium text-gray-900">{comment.author}</p>
      <p className="text-gray-600 mt-1">{comment.text}</p>
      <p className="text-xs text-gray-400 mt-1">
        {new Date(comment.created_at).toLocaleDateString()}
      </p>
    </div>
  );
};