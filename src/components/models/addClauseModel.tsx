// src/components/models/AddCommentModal.tsx
import React, { useEffect, useState } from "react";
import { X, MessageSquarePlus } from "lucide-react";

interface AddCommentModalProps {
  open: boolean;
  onClose: () => void;
  clauseName: string;
  onSubmit: (comment: string) => Promise<void> | void;
}

export default function AddCommentModal({
  open,
  onClose,
  clauseName,
  onSubmit,
}: AddCommentModalProps) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setText("");
      setBusy(false);
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={busy ? undefined : onClose} />
      <div className="absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">Add Comment</h3>
          </div>
          <button className="p-2 rounded hover:bg-gray-100" onClick={busy ? undefined : onClose}>
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-4">
          <div className="text-xs text-gray-500 mb-2">Clause</div>
          <div className="text-sm font-medium text-gray-900 mb-3">{clauseName}</div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Write your comment…"
            disabled={busy}
          />
        </div>

        <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
          <button
            className="inline-flex h-9 items-center rounded-md border border-gray-300 bg-white px-3 text-sm hover:bg-gray-50 disabled:opacity-50"
            onClick={busy ? undefined : onClose}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            className="inline-flex h-9 items-center rounded-md bg-blue-600 px-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            onClick={async () => {
              if (!text.trim()) return;
              try {
                setBusy(true);
                await onSubmit(text.trim());
                onClose();
              } finally {
                setBusy(false);
              }
            }}
            disabled={busy}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
