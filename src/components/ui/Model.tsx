// components/ui/Modal.tsx
'use client';
import React from 'react';
import { X } from 'lucide-react';

export default function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  maxWidth = 'max-w-lg',
}: React.PropsWithChildren<{
  open: boolean;
  title?: string;
  onClose: () => void;
  footer?: React.ReactNode;
  maxWidth?: string; // e.g. 'max-w-2xl'
}>) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} bg-white rounded-xl shadow-xl border`}>
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer ? <div className="px-5 py-4 border-t bg-gray-50">{footer}</div> : null}
      </div>
    </div>
  );
}
