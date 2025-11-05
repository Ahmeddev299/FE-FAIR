// ============================================
// 6. CommentsList.tsx - Comments List Component

import { ClauseComment } from "@/types/lease";

// ============================================
interface CommentsListProps {
  comments: ClauseComment[];
}

export const CommentsList: React.FC<CommentsListProps> = ({ comments }) => {
  if (comments.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-900">Comments</h4>
      {comments.map((comment, idx) => (
        <div key={idx} className="p-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-900">{comment.author || "Anonymous"}</span>
            <span className="text-xs text-gray-500">{comment.created_at || ""}</span>
          </div>
          <p className="text-sm text-gray-700">{comment.text}</p>
        </div>
      ))}
    </div>
  )
}