// src/components/clauses/CommentPill.tsx
export default function CommentPill({ count }: { count: number }) {
  if (count > 0) {
    return <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">{count} unresolved</span>;
  }
  return <span className="inline-block text-xs px-2 py-1 rounded-full text-gray-500">No comments</span>;
}
