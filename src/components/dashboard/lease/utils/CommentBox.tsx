// ============================================
// 5. CommentBox.tsx - Comment Box Component
// ============================================
import { Send } from "lucide-react";
import { useState } from "react";

interface CommentBoxProps {
  onSubmit: (text: string) => void;
  onCancel: () => void;
}

export const CommentBox: React.FC<CommentBoxProps> = ({ onSubmit, onCancel }) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = () => {
    if (commentText.trim()) {
      onSubmit(commentText);
      setCommentText("");
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write your comment..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows={3}
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Submit Comment
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};