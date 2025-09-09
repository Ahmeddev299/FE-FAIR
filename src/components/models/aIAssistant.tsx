// components/AiAssistantModal.tsx
import React, { useState } from "react";
import { X, Bot, CheckCircle2 } from "lucide-react";

type Message = { role: "user" | "assistant"; text: string };

type Props = {
  open: boolean;
  onClose: () => void;
  // should return { response: string } from API
  onAsk: (note: string) => Promise<{ response?: string }>;
  busy?: boolean;
};

export default function AiAssistantModal({ open, onClose, onAsk, busy = false }: Props) {
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const send = async (askText?: string) => {
    const text = (askText ?? note).trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setNote("");
    setSending(true);
    try {
      const res = await onAsk(text); // { response: string }
      const answer = res?.response || "No response text provided.";
      setMessages((m) => [...m, { role: "assistant", text: answer }]);
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div aria-modal="true" role="dialog" className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Card */}
      <div className="relative z-[101] w-full max-w-sm rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600">
              <Bot className="w-5 h-5" />
            </div>
            <div className="font-semibold">AI Assistant</div>
            <span className="ml-2 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Active
            </span>
          </div>
          <button className="p-2 rounded-md hover:bg-gray-100" aria-label="Close" onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Input row */}
          <div>
            <label className="sr-only">Ask me anything about your LOI…</label>
            <div className="flex items-center gap-2">
              <input
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ask me anything about your LOI..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={busy || sending}
              />
              <button
                type="button"
                onClick={() => send()}
                disabled={!note.trim() || busy || sending}
                className="inline-flex items-center justify-center rounded-lg p-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                title="Send"
              >
                {/* send icon */}
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Suggestions block */}
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <div className="text-sm font-semibold mb-1">Smart Suggestions</div>
            <div className="rounded-md bg-white border border-yellow-200 p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                Final Review
              </div>
              <p className="text-xs text-gray-600 mt-1">
                AI-powered review of your complete LOI — check for completeness and professional language.
              </p>
              <button
                onClick={() => send(note || "Please review my LOI for completeness and professional tone.")}
                disabled={busy || sending}
                className="mt-3 w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 font-medium disabled:opacity-60"
              >
                {sending ? "Applying..." : "Apply Suggestion"}
              </button>
            </div>
          </div>

          {/* Chat messages */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-blue-600 text-white ml-auto max-w-[85%]"
                    : "bg-gray-100 text-gray-800 mr-auto max-w-[85%]"
                }`}
              >
                {m.text}
              </div>
            ))}
            {(busy || sending) && (
              <div className="text-xs text-gray-500">Thinking…</div>
            )}
          </div>

        
        </div>
      </div>
    </div>
  );
}
